import PdfView from '@/components/PdfView';
import Chat from '@/components/Chat';
import { auth } from '@clerk/nextjs/server';
import { adminDb } from '@/firebaseAdmin';

export default async function FileConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const incomingParams = await params;
  const fileId = incomingParams.id;

  const session = await auth();
  const activeUserId = session?.userId;

  if (!activeUserId) {
    throw new Error('Access Denied: No User Found');
  }

  const fileSnapshot = await adminDb
    .collection('users')
    .doc(activeUserId)
    .collection('files')
    .doc(fileId)
    .get();

  const fileUrl = fileSnapshot.exists ? fileSnapshot.data()?.downloadUrl : null;

  return (
    <section className="grid grid-cols-5 h-full overflow-hidden">
      {/* Document Panel */}
      <aside className="col-span-5 lg:col-span-3 bg-gray-100 border-r-2 order-last lg:order-first overflow-y-scroll">
        <PdfView url={fileUrl} />
      </aside>

      {/* Conversation Panel */}
      <main className="col-span-5 lg:col-span-2 overflow-y-auto">
        <Chat id={fileId} />
      </main>
    </section>
  );
}