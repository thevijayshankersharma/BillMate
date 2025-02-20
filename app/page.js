"use client";

import Link from "next/link";
import { Button } from "./components/ui/button";
import { FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-gray-100 flex flex-col">
            <motion.header
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white shadow-lg py-4"
            >
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 text-indigo-600">
                        <FileText className="h-8 w-8" />
                        <span className="text-2xl font-extrabold">BillMate</span>
                    </Link>
                    <nav className="space-x-4">
                        <Link href="/login">
                            <Button variant="outline" className="rounded-lg">
                                Login
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button className="rounded-lg bg-indigo-600 hover:bg-indigo-700">Register</Button>
                        </Link>
                    </nav>
                </div>
            </motion.header>

            <main className="flex-grow container mx-auto px-6 py-16 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-center"
                >
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
                        Simplify Your Invoicing with <span className="text-indigo-600">BillMate</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Create professional invoices quickly and easily. Perfect for freelancers and small businesses.
                    </p>
                    <div className="space-x-4">
                        <Link href="/login">
                            <Button size="lg" className="rounded-lg bg-indigo-600 hover:bg-indigo-700">
                                Get Started
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button size="lg" variant="outline" className="rounded-lg">
                                Learn More
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </main>

            <footer className="bg-gray-800 py-6 text-center text-gray-300">
                © {new Date().getFullYear()} BillMate. All rights reserved.
            </footer>   
        </div>
    );
}