import Documents from "@/components/Documents";

export const dynamic = "force-dynamic";

function Dashboard() {
  return (
    <main className="min-h-screen bg-black text-yellow-300 px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-semibold text-yellow-400 mb-8 border-b border-yellow-500/30 pb-4">
          My Documents
        </h1>

        <Documents />
      </div>
    </main>
  );
}

export default Dashboard;
