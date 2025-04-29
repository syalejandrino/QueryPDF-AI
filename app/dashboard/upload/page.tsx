import FileUploader from '@/components/FileUploader';

export default function NewUploadScreen() {
  return (
    <section className="w-full min-h-screen bg-black text-yellow-300 py-10 px-6">
      <div className="container mx-auto max-w-6xl">
        <FileUploader />
      </div>
    </section>
  );
}
