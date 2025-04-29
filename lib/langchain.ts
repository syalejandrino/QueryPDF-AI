import { HumanMessage, AIMessage } from "@langchain/core/messages";
import pineconeClient from "./pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import { adminDb } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";
import { ChatOpenAI } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";

export const indexName = "chopper";

const llm = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4o-mini",
});

async function getUserId() {
  const { userId } = await auth();
  if (!userId) throw new Error("Authentication failed. User missing.");
  return userId;
}

async function retrieveChatHistory(docId: string) {
  const userId = await getUserId();
  console.info("🔵 Fetching chat logs...");

  const chatSnapshot = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .collection("chat")
    .orderBy("createdAt", "desc")
    .get();

  const messages = chatSnapshot.docs.map((doc) =>
    doc.data().role === "human"
      ? new HumanMessage(doc.data().message)
      : new AIMessage(doc.data().message)
  );

  console.info(`🔵 Retrieved ${messages.length} historical messages.`);
  return messages;
}

async function loadAndSplitPDF(docId: string) {
  const userId = await getUserId();
  console.info("🟣 Getting file download link from Firebase...");

  const fileDoc = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .get();

  const downloadUrl = fileDoc.data()?.downloadUrl;
  if (!downloadUrl) throw new Error("Download URL not available.");

  console.info(`🟣 File located: ${downloadUrl}`);
  const response = await fetch(downloadUrl);
  const fileBlob = await response.blob();

  console.info("🟣 Loading PDF content...");
  const loader = new PDFLoader(fileBlob);
  const documents = await loader.load();

  console.info("🟣 Splitting PDF into segments...");
  const splitter = new RecursiveCharacterTextSplitter();
  const sections = await splitter.splitDocuments(documents);

  console.info(`🟣 Document divided into ${sections.length} parts.`);
  return sections;
}

async function checkNamespace(index: Index<RecordMetadata>, namespace: string) {
  if (!namespace) throw new Error("Missing namespace.");
  const { namespaces } = await index.describeIndexStats();
  return namespaces?.[namespace] !== undefined;
}

export async function generateEmbeddingsInPineconeVectorStore(docId: string) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const userId = await getUserId();
  console.log("🛠️ Initializing vector store setup...");

  const embeddings = new OpenAIEmbeddings();
  const index = await pineconeClient.index(indexName);
  const existingNamespace = await checkNamespace(index, docId);

  if (existingNamespace) {
    console.log(`🛠️ Namespace '${docId}' already populated. Reusing data...`);
    return await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: docId,
    });
  }

  console.log(`🛠️ No namespace '${docId}' found. Processing new embeddings...`);
  const docs = await loadAndSplitPDF(docId);

  return await PineconeStore.fromDocuments(docs, embeddings, {
    pineconeIndex: index,
    namespace: docId,
  });
}

export async function generateLangchainCompletion(docId: string, query: string) {
  const vectorStore = await generateEmbeddingsInPineconeVectorStore(docId);
  if (!vectorStore) throw new Error("Failed to create or access vector store.");

  console.log("🔍 Building retriever from vector store...");
  const retriever = vectorStore.asRetriever();
  const pastMessages = await retrieveChatHistory(docId);

  console.log("🧩 Setting up prompt structure...");
  const dynamicPrompt = ChatPromptTemplate.fromMessages([
    ...pastMessages,
    ["user", "{input}"],
    [
      "user",
      "Generate a refined search query based on the above discussion for best retrieval.",
    ],
  ]);

  console.log("🔗 Establishing history-aware retriever chain...");
  const historyRetriever = await createHistoryAwareRetriever({
    llm,
    retriever,
    rephrasePrompt: dynamicPrompt,
  });

  console.log("📚 Defining document combiner template...");
  const answerPrompt = ChatPromptTemplate.fromMessages([
    ["system", "Utilize the context below to answer the question:\n\n{context}"],
    ...pastMessages,
    ["user", "{input}"],
  ]);

  const combinerChain = await createStuffDocumentsChain({
    llm,
    prompt: answerPrompt,
  });

  console.log("🚀 Assembling final retrieval pipeline...");
  const retrievalChain = await createRetrievalChain({
    retriever: historyRetriever,
    combineDocsChain: combinerChain,
  });

  console.log("🧠 Running the complete retrieval process...");
  const result = await retrievalChain.invoke({
    chat_history: pastMessages,
    input: query,
  });

  console.log("✅ Response generated.");
  return result.answer;
}

export { llm as model };
