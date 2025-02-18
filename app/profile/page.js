"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { FormItem, FormLabel } from '../components/ui/form';

export default function ProfilePage() {
    const [companyName, setCompanyName] = useState('');
    const [address, setAddress] = useState('');
    const [gstin, setGstin] = useState('');
    const [state, setState] = useState('');
    const [logo, setLogo] = useState(null); // For file upload later
    const [signature, setSignature] = useState(null); // For file upload later
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await fetch('/api/profile');
            if (response.ok) {
                const profileData = await response.json();
                setCompanyName(profileData.companyName || '');
                setAddress(profileData.address || '');
                setGstin(profileData.gstin || '');
                setState(profileData.state || '');
                // Handle logo and signature loading if needed (URLs or base64 strings)
            } else {
                console.error("Failed to fetch profile");
            }
        } catch (e) {
            console.error("Error fetching profile:", e);
        }
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setError('');

        const profileData = { companyName, address, gstin, state, /* logo, signature */ }; // Add logo/signature later

        try {
            const response = await fetch('/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData),
            });

            if (response.ok) {
                setMessage('Profile updated successfully!');
            } else {
                setError('Failed to update profile.');
            }
        } catch (e) {
            setError('Failed to update profile.');
            console.error("Profile update error:", e);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-6">Company Profile Settings</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <Input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company Name" />
                </FormItem>
                <FormItem>
                    <FormLabel>Address</FormLabel>
                    <Textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Company Address" />
                </FormItem>
                <FormItem>
                    <FormLabel>GSTIN Number</FormLabel>
                    <Input type="text" value={gstin} onChange={(e) => setGstin(e.target.value)} placeholder="GSTIN" />
                </FormItem>
                <FormItem>
                    <FormLabel>State</FormLabel>
                    <Input type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder="State" />
                </FormItem>
                {/* File upload inputs for logo and signature to be added later */}

                <Button type="submit">Save Profile</Button>
                {message && <p className="text-green-500 mt-2">{message}</p>}
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>
        </div>
    );
}