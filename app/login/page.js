"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Import Link
import { Button } from "../components/ui/button";
import { FormItem, FormLabel } from "../components/ui/form";
import { Input } from "../components/ui/input";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react"; // Import back arrow icon

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                localStorage.setItem("isLoggedIn", "true");
                router.push("/invoice-form");
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Login failed");
            }
        } catch (e) {
            setError("Login failed");
            console.error("Login error:", e);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden" // Added overflow-hidden for rounded corners to work with bg-white
            >
                {/* Back Button */}
                <Link href="/" className="absolute top-4 left-4 text-gray-600 hover:text-indigo-600 transition-colors">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>

                <div className="px-8 py-10 sm:p-12"> {/* Increased padding and removed skew/rotate bg */}
                    <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Login to BillMate</h1> {/* Increased mb */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FormItem>
                            <FormLabel className="text-gray-700">Email</FormLabel> {/* Added text color */}
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com" // More user-friendly placeholder
                                required
                                className="rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500" // Improved input styling
                            />
                        </FormItem>
                        <FormItem>
                            <FormLabel className="text-gray-700">Password</FormLabel> {/* Added text color */}
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••" // Password placeholder
                                required
                                className="rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500" // Improved input styling
                            />
                        </FormItem>
                        {error && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-red-500 text-sm text-center mt-2" // Added mt for spacing
                            >
                                {error}
                            </motion.p>
                        )}
                        <Button type="submit" className="w-full rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 shadow-sm hover:shadow-md transition-shadow duration-300"> {/* Improved button styling */}
                            Login
                        </Button>
                    </form>
                    <div className="mt-6 text-center text-sm text-gray-600">
                        Don't have an account? <Link href="/register" className="font-semibold text-indigo-600 hover:underline">Register</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}