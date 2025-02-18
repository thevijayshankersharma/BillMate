import { FileText } from "lucide-react";
import Link from "next/link";
import { MainNav } from "./components/main-nav";
import { InvoiceForm } from "./components/invoice-form";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50"> {/* Light gray background for the whole page */}
      <header className="sticky top-0 z-50 w-full bg-white shadow-md"> {/* White header with shadow */}
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8"> {/* Increased header height and added horizontal padding */}
          <Link href="/" className="flex items-center gap-2 font-semibold text-indigo-600"> {/* Brand link color */}
            <FileText className="h-5 w-5" />
            <span className="text-xl font-bold">BillMate</span> {/* Increased font size and weight for brand name */}
          </Link>
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-12 px-4 sm:px-6 lg:px-8"> {/* Increased vertical padding for main content */}
          <InvoiceForm />
        </div>
      </main>
      <footer className="w-full border-t border-gray-200 py-4 bg-white text-center text-sm text-gray-500"> {/* Basic footer */}
        © {new Date().getFullYear()} BillMate. All rights reserved.
      </footer>
    </div>
  );
}