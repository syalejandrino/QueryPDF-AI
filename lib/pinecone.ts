import { Pinecone } from "@pinecone-database/pinecone";

const token = process.env.PINECONE_API_KEY ?? "";

if (!token.length) {
  throw new Error("Environment setup error: Pinecone API key missing.");
}

const pinecone = new Pinecone({ apiKey: token });

export default pinecone;
