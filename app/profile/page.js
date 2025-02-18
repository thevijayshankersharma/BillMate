"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { FormItem, FormLabel } from '../components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";

// GSTIN parser function (copied from InvoiceForm for ProfilePage functionality)
function parseGSTIN(gstin) {
    if (!gstin) {
        return { state: "" };
    }
    let stateCode = gstin.length >= 2 ? gstin.substring(0, 2) : "0" + gstin;
    const statesMap = {
        "01": "JAMMU AND KASHMIR",
        "02": "HIMACHAL PRADESH",
        "03": "PUNJAB",
        "04": "CHANDIGARH",
        "05": "UTTARAKHAND",
        "06": "HARYANA",
        "07": "DELHI",
        "08": "RAJASTHAN",
        "09": "UTTAR PRADESH",
        "10": "BIHAR",
        "11": "SIKKIM",
        "12": "ARUNACHAL PRADESH",
        "13": "NAGALAND",
        "14": "MANIPUR",
        "15": "MIZORAM",
        "16": "TRIPURA",
        "17": "MEGHALAYA",
        "18": "ASSAM",
        "19": "WEST BENGAL",
        "20": "JHARKHAND",
        "21": "ODISHA",
        "22": "CHATTISGARH",
        "23": "MADHYA PRADESH",
        "24": "GUJARAT",
        "26": "DADRA AND NAGAR HAVELI AND DAMAN AND DIU",
        "27": "MAHARASHTRA",
        "28": "ANDHRA PRADESH",
        "29": "KARNATAKA",
        "30": "GOA",
        "31": "LAKSHADWEEP",
        "32": "KERALA",
        "33": "TAMIL NADU",
        "34": "PUDUCHERRY",
        "35": "ANDAMAN AND NICOBAR ISLANDS",
        "36": "TELANGANA",
        "37": "ANDHRA PRADESH",
        "38": "LADAKH",
    };
    return statesMap[stateCode] || "";
}


export default function ProfilePage() {
    const [companyName, setCompanyName] = useState('');
    const [address, setAddress] = useState('');
    const [gstin, setGstin] = useState('');
    const [state, setState] = useState(''); // Initialize state as empty string
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [logo, setLogo] = useState(null);
    const [signature, setSignature] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const indianStates = [ // Array of Indian states for Select component
        "JAMMU AND KASHMIR", "HIMACHAL PRADESH", "PUNJAB", "CHANDIGARH", "UTTARAKHAND",
        "HARYANA", "DELHI", "RAJASTHAN", "UTTAR PRADESH", "BIHAR", "SIKKIM",
        "ARUNACHAL PRADESH", "NAGALAND", "MANIPUR", "MIZORAM", "TRIPURA",
        "MEGHALAYA", "ASSAM", "WEST BENGAL", "JHARKHAND", "ODISHA", "CHATTISGARH",
        "MADHYA PRADESH", "GUJARAT", "DADRA AND NAGAR HAVELI AND DAMAN AND DIU",
        "MAHARASHTRA", "ANDHRA PRADESH", "KARNATAKA", "GOA", "LAKSHADWEEP",
        "KERALA", "TAMIL NADU", "PUDUCHERRY", "ANDAMAN AND NICOBAR ISLANDS", "TELANGANA",
        "LADAKH"
    ];


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
                setEmail(profileData.email || '');
                setPhone(profileData.phone || '');
                // Handle logo and signature loading
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

        const profileData = { companyName, address, gstin, state, email, phone, /* logo, signature - to be implemented */ };

        try {
            const response = await fetch('/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData),
            });

            if (response.ok) {
                setMessage('Profile updated successfully!');
                fetchProfile();
                localStorage.setItem("profileData", JSON.stringify(profileData));
            } else {
                setError('Failed to update profile.');
            }
        } catch (e) {
            setError('Failed to update profile.');
            console.error("Profile update error:", e);
        }
    };

    // Function to handle GSTIN change and update state
    const handleGSTINChange = (e) => {
        const gstinValue = e.target.value;
        setGstin(gstinValue);
        const parsedState = parseGSTIN(gstinValue);
        setState(parsedState); // Automatically set state based on GSTIN
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
                    <FormLabel>Phone Number</FormLabel>
                    <Input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" />
                </FormItem>
                <FormItem>
                    <FormLabel>Email ID</FormLabel>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email ID" />
                </FormItem>
                <FormItem>
                    <FormLabel>GSTIN Number</FormLabel>
                    <Input
                        type="text"
                        value={gstin}
                        onChange={handleGSTINChange} // Use handleGSTINChange for GSTIN input
                        placeholder="GSTIN"
                    />
                </FormItem>
                <FormItem>
                    <FormLabel>State</FormLabel>
                    <Select value={state} onValueChange={setState}>
                        <SelectTrigger className="w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" side="top">
                            <SelectValue placeholder="Select State" className="text-gray-700" />
                        </SelectTrigger>
                        <SelectContent side="top" className="z-50">
                            {indianStates.map((s) => (
                                <SelectItem key={s} value={s} className="text-gray-700 hover:bg-gray-100 focus:bg-gray-100">
                                    {s}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </FormItem>
                {/* File upload inputs for logo and signature to be added later */}

                <Button type="submit">Save Profile</Button>
                {message && <p className="text-green-500 mt-2">{message}</p>}
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>
        </div>
    );
}