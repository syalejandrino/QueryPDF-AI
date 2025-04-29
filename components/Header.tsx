import { UserButton, SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";
import { FilePlus2 } from "lucide-react";

function Header() {
  return (
    <header className="sticky top-0 z-50 flex justify-between items-center bg-black text-yellow-300 shadow-md px-6 py-4 border-b border-yellow-500/30">
      <Link href="/dashboard" className="text-2xl font-extrabold tracking-tight">
        <span className="text-yellow-400">QueryPDF</span>{" "}
        <span className="text-white">AI</span>
      </Link>

      <SignedIn>
        <nav className="flex items-center space-x-3">
          <Button
            asChild
            className="bg-transparent border border-yellow-500 text-yellow-300 
              hover:bg-yellow-500 hover:text-black transition-all duration-200"
          >
            <Link href="/dashboard">My Documents</Link>
          </Button>

          <Button
            asChild
            className="border border-yellow-500 text-yellow-300 hover:bg-yellow-500 hover:text-black 
              transition-all duration-200"
          >
            <Link href="/dashboard/upload" className="flex items-center gap-2">
              <FilePlus2 className="h-5 w-5 transition-colors duration-200" />
              <span className="hidden md:inline">Upload</span>
            </Link>
          </Button>

          <UserButton />
        </nav>
      </SignedIn>
    </header>
  );
}

export default Header;
