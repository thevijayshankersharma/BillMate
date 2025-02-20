"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { FormItem, FormLabel } from "../components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { motion } from "framer-motion";

function parseGSTIN(gstin) {
    if (!gstin) return "";
    const stateCode = gstin.length >= 2 ? gstin.substring(0, 2) : "0" + gstin;
    const statesMap = {
        "01": "JAMMU AND KASHMIR", "02": "HIMACHAL PRADESH", "03": "PUNJAB", "04": "CHANDIGARH",
        "05": "UTTARAKHAND", "06": "HARYANA", "07": "DELHI", "08": "RAJASTHAN", "09": "UTTAR PRADESH",
        "10": "BIHAR", "11": "SIKKIM", "12": "ARUNACHAL PRADESH", "13": "NAGALAND", "14": "MANIPUR",
        "15": "MIZORAM", "16": "TRIPURA", "17": "MEGHALAYA", "18": "ASSAM", "19": "WEST BENGAL",
        "20": "JHARKHAND", "21": "ODISHA", "22": "CHATTISGARH", "23": "MADHYA PRADESH", "24": "GUJARAT",
        "26": "DADRA AND NAGAR HAVELI AND DAMAN AND DIU", "27": "MAHARASHTRA", "28": "ANDHRA PRADESH",
        "29": "KARNATAKA", "30": "GOA", "31": "LAKSHADWEEP", "32": "KERALA", "33": "TAMIL NADU",
        "34": "PUDUCHERRY", "35": "ANDAMAN AND NICOBAR ISLANDS", "36": "TELANGANA", "37": "ANDHRA PRADESH",
        "38": "LADAKH",
    };
    return statesMap[stateCode] || "";
}

export default function ProfilePage() {
    const [companyName, setCompanyName] = useState("");
    const [address, setAddress] = useState("");
    const [gstin, setGstin] = useState("");
    const [state, setState] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [logo, setLogo] = useState(null);
    const [signature, setSignature] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const indianStates = [
        "JAMMU AND KASHMIR", "HIMACHAL PRADESH", "PUNJAB", "CHANDIGARH", "UTTARAKHAND", "HARYANA",
        "DELHI", "RAJASTHAN", "UTTAR PRADESH", "BIHAR", "SIKKIM", "ARUNACHAL PRADESH", "NAGALAND",
        "MANIPUR", "MIZORAM", "TRIPURA", "MEGHALAYA", "ASSAM", "WEST BENGAL", "JHARKHAND", "ODISHA",
        "CHATTISGARH", "MADHYA PRADESH", "GUJARAT", "DADRA AND NAGAR HAVELI AND DAMAN AND DIU",
        "MAHARASHTRA", "ANDHRA PRADESH", "KARNATAKA", "GOA", "LAKSHADWEEP", "KERALA", "TAMIL NADU",
        "PUDUCHERRY", "ANDAMAN AND NICOBAR ISLANDS", "TELANGANA", "LADAKH",
    ];

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch("/api/profile");
                if (response.ok) {
                    const profileData = await response.json();
                    setCompanyName(profileData.companyName || "");
                    setAddress(profileData.address || "");
                    setGstin(profileData.gstin || "");
                    setState(profileData.state || "");
                    setEmail(profileData.email || "");
                    setPhone(profileData.phone || "");
                }
            } catch (e) {
                console.error("Error fetching profile:", e);
            }
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");
        setError("");

        const formData = new FormData();
        formData.append("companyName", companyName);
        formData.append("address", address);
        formData.append("gstin", gstin);
        formData.append("state", state);
        formData.append("email", email);
        formData.append("phone", phone);
        if (logo) formData.append("logo", logo);
        if (signature) formData.append("signature", signature);

        try {
            const response = await fetch("/api/profile", { method: "POST", body: formData });
            if (response.ok) setMessage("Profile updated successfully!");
            else setError("Failed to update profile.");
        } catch (e) {
            setError("Failed to update profile.");
            console.error("Profile update error:", e);
        }
    };

    const handleGSTINChange = (e) => {
        const gstinValue = e.target.value;
        setGstin(gstinValue);
        setState(parseGSTIN(gstinValue));
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container mx-auto p-6 sm:p-10 bg-gray-50 min-h-screen"
        >
            <h1 className="text-3xl font-bold text-indigo-600 mb-8">Company Profile Settings</h1>
            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
                <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <Input
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Enter company name"
                        className="rounded-lg"
                    />
                </FormItem>
                <FormItem>
                    <FormLabel>Address</FormLabel>
                    <Textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter company address"
                        className="rounded-lg"
                    />
                </FormItem>
                <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter phone number"
                        className="rounded-lg"
                    />
                </FormItem>
                <FormItem>
                    <FormLabel>Email ID</FormLabel>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email"
                        className="rounded-lg"
                    />
                </FormItem>
                <FormItem>
                    <FormLabel>GSTIN Number</FormLabel>
                    <Input
                        value={gstin}
                        onChange={handleGSTINChange}
                        placeholder="Enter GSTIN"
                        className="rounded-lg"
                    />
                </FormItem>
                <FormItem>
                    <FormLabel>State</FormLabel>
                    <Select value={state} onValueChange={setState}>
                        <SelectTrigger className="rounded-lg">
                            <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                            {indianStates.map((s) => (
                                <SelectItem key={s} value={s}>
                                    {s}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </FormItem>
                <FormItem>
                    <FormLabel>Logo</FormLabel>
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setLogo(e.target.files[0])}
                        className="rounded-lg"
                    />
                </FormItem>
                <FormItem>
                    <FormLabel>Signature</FormLabel>
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSignature(e.target.files[0])}
                        className="rounded-lg"
                    />
                </FormItem>
                <Button type="submit" className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700">
                    Save Profile
                </Button>
                {message && <p className="text-green-500 text-center">{message}</p>}
                {error && <p className="text-red-500 text-center">{error}</p>}
            </form>
        </motion.div>
    );
}