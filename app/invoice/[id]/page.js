"use client";

import { formatCurrency, numberToWords } from "../../lib/utils";
import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // For animations

// Helper function to format state name
const formatStateName = (stateName) =>
    stateName ? stateName.charAt(0).toUpperCase() + stateName.slice(1).toLowerCase() : "";

// Function to format address into two lines
const formatAddress = (address) => {
    if (!address) return "";
    const parts = address.split(", ");
    let firstLine = "";
    let secondLine = "";

    for (let i = 0; i < parts.length; i++) {
        const currentPart = parts[i] + (i < parts.length - 1 ? ", " : "");
        if (firstLine.length + currentPart.length <= 50) firstLine += currentPart;
        else secondLine += currentPart;
    }

    if (!secondLine && parts.length > 2) {
        firstLine = parts.slice(0, -1).join(", ") + ",";
        secondLine = parts[parts.length - 1];
    }

    return (
        <>
            <p className="text-sm text-gray-600 mt-1">{firstLine.replace(/,\s*$/, "")}</p>
            {secondLine && <p className="text-sm text-gray-600 mt-1">{secondLine.replace(/,\s*$/, "")}</p>}
        </>
    );
};

export default function InvoicePage() {
    const [invoice, setInvoice] = useState(null);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const storedInvoice = localStorage.getItem("invoiceData");
        if (storedInvoice) setInvoice(JSON.parse(storedInvoice));

        const fetchProfileData = async () => {
            try {
                const response = await fetch("/api/profile");
                if (response.ok) setProfile(await response.json());
                else console.error("Failed to fetch profile from API");
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };
        fetchProfileData();
    }, []);

    if (!invoice || !profile)
        return (
            <div className="flex items-center justify-center min-h-screen">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-gray-600 text-lg"
                >
                    Loading...
                </motion.div>
            </div>
        );

    const isIntraState = invoice.stateOfSupply.trim().toLowerCase() === "gujarat";
    const customerGSTIN = invoice.customer.gstin?.trim() || "";
    const customerState = invoice.customer.state?.trim() || "";

    const stateCodeMap = {
        "JAMMU AND KASHMIR": "01", "HIMACHAL PRADESH": "02", "PUNJAB": "03", "CHANDIGARH": "04",
        "UTTARAKHAND": "05", "HARYANA": "06", "DELHI": "07", "RAJASTHAN": "08", "UTTAR PRADESH": "09",
        "BIHAR": "10", "SIKKIM": "11", "ARUNACHAL PRADESH": "12", "NAGALAND": "13", "MANIPUR": "14",
        "MIZORAM": "15", "TRIPURA": "16", "MEGHALAYA": "17", "ASSAM": "18", "WEST BENGAL": "19",
        "JHARKHAND": "20", "ODISHA": "21", "CHATTISGARH": "22", "MADHYA PRADESH": "23", "GUJARAT": "24",
        "DADRA AND NAGAR HAVELI AND DAMAN AND DIU": "26", "MAHARASHTRA": "27", "ANDHRA PRADESH": "28",
        "KARNATAKA": "29", "GOA": "30", "LAKSHADWEEP": "31", "KERALA": "32", "TAMIL NADU": "33",
        "PUDUCHERRY": "34", "ANDAMAN AND NICOBAR ISLANDS": "35", "TELANGANA": "36", "LADAKH": "38",
        "ANDHRA PRADESH (NEW)": "37",
    };

    const formatStateDisplay = (state) => {
        const formattedState = formatStateName(state);
        const stateCode = stateCodeMap[state?.toUpperCase()];
        return stateCode ? `${stateCode}-${formattedState}` : formattedState;
    };

    const placeOfSupply = formatStateDisplay(invoice.stateOfSupply);
    const calculateGSTAmount = (item) =>
        item.tax === "GST@18%" ? (Number(item.qty) || 0) * (Number(item.price) || 0) * 0.18 : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8"
        >
            <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full overflow-hidden">
                <div className="px-6 py-8 sm:p-10">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start border-b border-gray-200 pb-6 mb-8">
                        <div className="space-y-2">
                            {profile.companyName && (
                                <h1 className="text-3xl font-extrabold text-gray-900">{profile.companyName}</h1>
                            )}
                            {profile.address && formatAddress(profile.address)}
                            {profile.phone && <p className="text-sm text-gray-600">Phone: {profile.phone}</p>}
                            {profile.email && <p className="text-sm text-gray-600">Email: {profile.email}</p>}
                            {profile.gstin && <p className="text-sm text-gray-600">GSTIN: {profile.gstin}</p>}
                            {profile.state && (
                                <p className="text-sm text-gray-600">State: {formatStateDisplay(profile.state)}</p>
                            )}
                        </div>
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="w-24 h-24 mt-4 sm:mt-0 rounded-lg shadow-md overflow-hidden flex items-center justify-center bg-gray-50"
                        >
                            {profile.logoUrl ? (
                                <img src={profile.logoUrl} alt="Logo" className="object-cover w-full h-full" />
                            ) : (
                                <span className="text-gray-400 text-sm font-medium">Logo</span>
                            )}
                        </motion.div>
                    </div>

                    {/* Title */}
                    <h2 className="text-center text-4xl font-bold text-indigo-600 mb-8">Tax Invoice</h2>

                    {/* Bill To & Invoice Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                            <h3 className="font-semibold text-xl text-gray-800 mb-4">Bill To</h3>
                            <p className="font-medium text-gray-900">{invoice.customer.name}</p>
                            <p className="text-sm text-gray-600">{invoice.customer.address}</p>
                            {invoice.customer.contact?.trim() && (
                                <p className="text-sm text-gray-600 mt-1">Contact: {invoice.customer.contact}</p>
                            )}
                            {customerGSTIN && <p className="text-sm text-gray-600 mt-1">GSTIN: {customerGSTIN}</p>}
                            {customerState && (
                                <p className="text-sm text-gray-600 mt-1">State: {formatStateDisplay(customerState)}</p>
                            )}
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-right"
                        >
                            <h3 className="font-semibold text-xl text-gray-800 mb-4">Invoice Details</h3>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium text-gray-700">Invoice No.: </span>
                                {invoice.invoice.number}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                <span className="font-medium text-gray-700">Date: </span>
                                {invoice.invoice.date}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                <span className="font-medium text-gray-700">Place of Supply: </span>
                                {placeOfSupply}
                            </p>
                        </motion.div>
                    </div>

                    {/* Items Table */}
                    <div className="overflow-x-auto rounded-lg shadow-sm">
                        <table className="min-w-full border-collapse bg-white">
                            <thead className="bg-indigo-50">
                                <tr>
                                    {["#", "Item Name", "HSN/SAC", "Quantity", "Price/Unit", "GST", "Amount"].map(
                                        (header) => (
                                            <th
                                                key={header}
                                                className="border-b border-gray-200 px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider"
                                            >
                                                {header}
                                            </th>
                                        )
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.items.map((item, index) => {
                                    const qty = Number(item.qty) || 0;
                                    const price = Number(item.price) || 0;
                                    const gstAmount = calculateGSTAmount(item);
                                    return (
                                        <motion.tr
                                            key={index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="border-b border-gray-200 px-4 py-3 text-sm text-gray-700">
                                                {index + 1}
                                            </td>
                                            <td className="border-b border-gray-200 px-4 py-3 text-sm text-gray-700">
                                                {item.name}
                                            </td>
                                            <td className="border-b border-gray-200 px-4 py-3 text-sm text-gray-700">
                                                {item.hsn}
                                            </td>
                                            <td className="border-b border-gray-200 px-4 py-3 text-sm text-gray-700">
                                                {qty}
                                            </td>
                                            <td className="border-b border-gray-200 px-4 py-3 text-sm text-gray-700">
                                                ₹ {formatCurrency(price)}
                                            </td>
                                            <td className="border-b border-gray-200 px-4 py-3 text-sm text-gray-700">
                                                {item.tax === "GST@18%" ? `₹ ${formatCurrency(gstAmount)} (18%)` : item.tax}
                                            </td>
                                            <td className="border-b border-gray-200 px-4 py-3 text-sm text-gray-700">
                                                ₹ {formatCurrency(item.amount)}
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                            <tfoot className="bg-indigo-50 font-medium">
                                <tr>
                                    <td colSpan={2} className="px-4 py-3 text-sm text-gray-800">
                                        Total
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-800"></td>
                                    <td className="px-4 py-3 text-sm text-gray-800">
                                        {invoice.items.reduce((acc, item) => acc + Number(item.qty), 0)}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-800"></td>
                                    <td className="px-4 py-3 text-sm text-gray-800">
                                        {isIntraState
                                            ? `₹ ${formatCurrency(invoice.totals.sgst + invoice.totals.cgst)}`
                                            : `₹ ${formatCurrency(invoice.totals.igst)}`}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900">
                                        ₹ {formatCurrency(invoice.totals.total)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Description */}
                    {invoice.description && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-8 mb-10"
                        >
                            <h4 className="font-semibold text-lg text-gray-800 mb-3">Description</h4>
                            <p className="text-sm text-gray-600">{invoice.description}</p>
                        </motion.div>
                    )}

                    {/* Amount Details */}
                    <div className="flex flex-col md:flex-row justify-between gap-8 mb-10">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                            <h4 className="font-semibold text-lg text-gray-800 mb-3">Invoice Amount In Words</h4>
                            <p className="text-sm text-gray-600 italic">
                                {numberToWords(invoice.totals.total)} Rupees only
                            </p>
                            <div className="mt-6">
                                <h4 className="font-semibold text-lg text-gray-800 mb-3">Terms and Conditions</h4>
                                <p className="text-sm text-gray-600">Thanks for doing business with us!</p>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="w-full md:w-72"
                        >
                            <table className="w-full text-sm bg-indigo-50 rounded-lg p-4">
                                <tbody>
                                    {[
                                        ["Sub Total", invoice.totals.subTotal],
                                        ...(isIntraState
                                            ? [
                                                ["SGST@9%", invoice.totals.sgst],
                                                ["CGST@9%", invoice.totals.cgst],
                                            ]
                                            : [["IGST@18%", invoice.totals.igst]]),
                                        ["Total", invoice.totals.total, true],
                                        ["Received", invoice.totals.received],
                                        ["Balance", invoice.totals.balance, true],
                                    ].map(([label, value, bold], idx) => (
                                        <tr key={idx} className={bold ? "border-t border-gray-200" : ""}>
                                            <td className={`py-2 ${bold ? "text-gray-800 font-semibold" : "text-gray-700"}`}>
                                                {label}
                                            </td>
                                            <td
                                                className={`text-right ${bold ? "text-gray-800 font-semibold" : "text-gray-700"}`}
                                            >
                                                ₹ {formatCurrency(value)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </motion.div>
                    </div>

                    {/* Footer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-12 flex justify-end"
                    >
                        <div className="flex flex-col items-center max-w-xs">
                            <p className="mb-2 text-gray-700 text-center">For: {profile.companyName}</p>
                            {profile.signatureUrl && (
                                <img
                                    src={profile.signatureUrl}
                                    alt="Signature"
                                    className="max-h-20 mb-2"
                                />
                            )}
                            <div className="border-t border-gray-300 pt-1 w-full">
                                <p className="text-gray-800 font-semibold text-center">Authorized Signatory</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}