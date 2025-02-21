"use client";

import Link from "next/link";
import { Button } from "./components/ui/button";
import { FileText, Zap, CheckCircle, Clock } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

// Animation Variants
const headerVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
};

const staggerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const featureVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
};

export default function LandingPage() {
    const { scrollY } = useScroll();
    const headerShadow = useTransform(scrollY, [0, 50], ["none", "0 4px 30px rgba(0,0,0,0.1)"]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-gray-50 flex flex-col">
            {/* Animated Header */}
            <motion.header
                style={{ boxShadow: headerShadow }}
                variants={headerVariants}
                initial="hidden"
                animate="visible"
                className="bg-white/80 backdrop-blur-md py-4 sticky top-0 z-50"
            >
                <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 text-indigo-600">
                        <FileText className="h-8 w-8 md:h-10 md:w-10" aria-hidden="true" />
                        <span className="text-2xl md:text-3xl font-extrabold">BillMate</span>
                    </Link>
                    <nav className="flex gap-2 md:gap-4" aria-label="Main navigation">
                        <Link href="/login">
                            <Button
                                variant="outline"
                                className="rounded-full text-sm md:text-base border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-transform hover:scale-105"
                                aria-label="Log in to BillMate"
                            >
                                Login
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button
                                className="rounded-full text-sm md:text-base bg-indigo-600 hover:bg-indigo-700 text-white transition-transform hover:scale-105"
                                aria-label="Register for BillMate"
                            >
                                Register
                            </Button>
                        </Link>
                    </nav>
                </div>
            </motion.header>

            {/* Main Content */}
            <main className="flex-grow container mx-auto px-4 sm:px-6">
                {/* Hero Section */}
                <section className="py-16 md:py-24 flex flex-col items-center">
                    <motion.div
                        variants={staggerVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-center max-w-4xl"
                    >
                        <motion.h1
                            variants={itemVariants}
                            className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6"
                        >
                            Streamline Invoicing with{" "}
                            <span className="bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
                                BillMate
                            </span>
                        </motion.h1>
                        <motion.p
                            variants={itemVariants}
                            className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
                        >
                            Professional invoicing made simple for Freelancers and small businesses. Create,
                            manage, and track payments in one intuitive platform.
                        </motion.p>
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Link href="/register">
                                <Button
                                    size="lg"
                                    className="rounded-full bg-indigo-600 hover:bg-indigo-700 px-8 py-3 text-lg shadow-lg hover:shadow-indigo-200 transition-all hover:scale-105"
                                    aria-label="Start a free trial with BillMate"
                                >
                                    Start Free Trial
                                </Button>
                            </Link>
                            <Link href="/features">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="rounded-full border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-8 py-3 text-lg transition-all hover:scale-105"
                                    aria-label="Watch a demo of BillMate"
                                >
                                    Watch Demo
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Features Section */}
                    <motion.div
                        variants={staggerVariants}
                        initial="hidden"
                        animate="visible"
                        className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={featureVariants}
                                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                            >
                                <feature.icon
                                    className="h-8 w-8 text-indigo-600 mb-4"
                                    aria-hidden="true"
                                />
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>
            </main>

            {/* Accessible Footer */}
            <footer className="bg-gray-800 py-8 mt-24">
                <div className="container mx-auto px-4 sm:px-6 text-center text-gray-300">
                    <p className="text-sm md:text-base">
                        © {new Date().getFullYear()} BillMate. All rights reserved.
                        <br />
                        <span className="text-indigo-300">Accessibility-first design</span> •
                        <Link href="/privacy" className="ml-2 hover:text-indigo-200" aria-label="Privacy Policy">
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </footer>
        </div>
    );
}

// Feature Data
const features = [
    {
        icon: Zap,
        title: "Lightning Fast",
        description: "Generate invoices in seconds with smart templates",
    },
    {
        icon: CheckCircle,
        title: "Reliable Tracking",
        description: "Real-time payment status and reminders",
    },
    {
        icon: Clock,
        title: "Time Savings",
        description: "Automate recurring invoices and client management",
    },
];