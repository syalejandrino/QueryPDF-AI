import { ClerkLoaded } from "@clerk/nextjs";
import Header from "@/components/Header";

export default function MainDashboard({ children }: { children: React.ReactNode }) {
  return (
    <ClerkLoaded>
      <section className="flex flex-col flex-grow h-screen">
        <Header />
        <div className="flex-1 overflow-y-scroll">
          {children}
        </div>
      </section>
    </ClerkLoaded>
  );
}
