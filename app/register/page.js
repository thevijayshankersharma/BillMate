"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import { FormItem, FormLabel } from "../components/ui/form";
import { Input } from "../components/ui/input";
import { motion } from "framer-motion";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("Registration is currently closed. Please try again later.");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative max-w-md w-full"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl shadow-2xl transform -skew-y-6 sm:skew-y-0 sm:-rotate-6"></div>
                <div className="relative bg-white rounded-3xl shadow-xl p-8 sm:p-10">
                    <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Register for BillMate</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                className="rounded-lg"
                            />
                        </FormItem>
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                className="rounded-lg"
                            />
                        </FormItem>
                        {error && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-red-500 text-sm text-center"
                            >
                                {error}
                            </motion.p>
                        )}
                        <Button type="submit" className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700">
                            Register
                        </Button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}