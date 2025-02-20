"use client";

import Link from 'next/link';
import { Button } from './components/ui/button';
import { FileText } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <header className="bg-white shadow-md py-4">
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 font-semibold text-indigo-600">
                        <FileText className="h-6 w-6" />
                        <span className="text-xl font-bold">BillMate</span>
                    </Link>
                    <nav className="space-x-4">
                        <Link href="/login">
                            <Button variant="outline">Login</Button>
                        </Link>
                        <Link href="/register"> {/* For simplicity, linking Register to Login for single user */}
                            <Button>Register</Button>
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-6 py-16 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-6">
                        Simplify Your Invoicing with BillMate
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
                        Create professional invoices quickly and easily. Perfect for freelancers and small businesses.
                    </p>
                    <div className="space-x-4">
                        <Link href="/login"> {/* Changed href to "/login" */}
                            <Button size="lg">Get Started - Create Invoice</Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="secondary" size="lg">Learn More</Button> {/* Example: Could link to a features page later */}
                        </Link>
                    </div>
                </div>
            </main>

            <footer className="bg-gray-200 py-8 text-center text-gray-600 border-t border-gray-300">
                © {new Date().getFullYear()} BillMate. All rights reserved.
            </footer>
        </div>
    );
}