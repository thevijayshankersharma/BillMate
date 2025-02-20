"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/button';
import { FormItem, FormLabel } from '../components/ui/form';
import { Input } from '../components/ui/input';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        // Set the error message to indicate registration is closed
        setError('Registration is currently closed. Please try again later.');

        // **Important:** Comment out or remove the fetch request below to disable actual registration
        /*
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                // Registration successful:
                alert('Registration successful! Please login.');
                router.push('/login');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Registration failed');
            }
        } catch (e) {
            setError('Registration failed');
            console.error("Registration error:", e);
        }
        */
    };

    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <div className="max-w-md mx-auto">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-800 text-center">
                                Register for BillMate
                            </h1>
                        </div>
                        <div className="divide-y divide-gray-200">
                            <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                <form onSubmit={handleSubmit}>
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <Input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Email"
                                            required
                                        />
                                    </FormItem>
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <Input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Password"
                                            required
                                        />
                                    </FormItem>
                                    {error && <p className="text-red-500 text-sm">{error}</p>}
                                    <Button type="submit" className="w-full">
                                        Register
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}