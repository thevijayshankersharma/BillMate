"use client";

import { formatCurrency, numberToWords } from "../../lib/utils";
import { useEffect, useState } from "react";

// Helper function to format state name (Initial Capital, lowercase rest)
const formatStateName = (stateName) => {
    if (!stateName) return "";
    return stateName.charAt(0).toUpperCase() + stateName.slice(1).toLowerCase();
};

// Function to format address to two lines with character limit
const formatAddress = (address) => {
    if (!address) return "";
    const parts = address.split(', ');
    let firstLine = "";
    let secondLine = "";

    for (let i = 0; i < parts.length; i++) {
        const currentPart = parts[i] + (i < parts.length - 1 ? ', ' : ''); // Add comma if not the last part

        if (firstLine.length + currentPart.length <= 50) { // Adjust 50 to your desired character limit
            firstLine += currentPart;
        } else {
            secondLine += currentPart;
        }
    }

    // If after processing, secondLine is still empty but we have more than 2 parts initially,
    // it means the first line took up almost everything. In this case, force a split
    if (secondLine === "" && parts.length > 2) {
        firstLine = parts.slice(0, parts.length -1 ).join(', ') + ',';
        secondLine = parts[parts.length - 1];
         // Re-split based on original logic if character limit doesn't create two lines
        if (secondLine.trim() === "") {
            const partsOriginalLogic = address.split(', ');
            if (partsOriginalLogic.length > 2) {
                firstLine = partsOriginalLogic.slice(0, 2).join(', ') + ',';
                secondLine = partsOriginalLogic.slice(2).join(', ');
            } else {
                return address; // Fallback to single line if still not splitted
            }
        }


    }


    return (
        <>
            <p className="text-sm text-gray-600 mt-1">{firstLine.replace(/,\s*$/, '')}</p> {/* Remove trailing comma and space */}
            {secondLine && <p className="text-sm text-gray-600 mt-1">{secondLine.replace(/,\s*$/, '')}</p>} {/* Remove trailing comma and space */}
        </>
    );
};


export default function InvoicePage() {
    const [invoice, setInvoice] = useState(null);
    const [profile, setProfile] = useState(null); // State to store profile data

    useEffect(() => {
        const storedInvoice = localStorage.getItem("invoiceData");
        if (storedInvoice) {
            setInvoice(JSON.parse(storedInvoice));
        }
        // Fetch profile data from API instead of localStorage
        const fetchProfileData = async () => {
            try {
                const response = await fetch('/api/profile');
                if (response.ok) {
                    const profileData = await response.json();
                    setProfile(profileData);
                } else {
                    console.error("Failed to fetch profile from API");
                }
            } catch (error) {
                console.error("Error fetching profile from API:", error);
            }
        };
        fetchProfileData(); // Call the fetch function
    }, []);

    if (!invoice) return <div className="p-4">Loading invoice...</div>;
    if (!profile) return <div className="p-4">Loading profile...</div>; // Add loading state for profile if needed

    // Determine if intra-state for tax breakdown
    const isIntraState = invoice.stateOfSupply.trim().toLowerCase() === "gujarat";

    // Helper variables for customer GSTIN and state (trimmed)
    const customerGSTIN = invoice.customer.gstin?.trim() || "";
    const customerState = invoice.customer.state?.trim() || "";

    // GSTIN State Code Map
    const stateCodeMap = {
        "JAMMU AND KASHMIR": "01",
        "HIMACHAL PRADESH": "02",
        "PUNJAB": "03",
        "CHANDIGARH": "04",
        "UTTARAKHAND": "05",
        "HARYANA": "06",
        "DELHI": "07",
        "RAJASTHAN": "08",
        "UTTAR PRADESH": "09",
        "BIHAR": "10",
        "SIKKIM": "11",
        "ARUNACHAL PRADESH": "12",
        "NAGALAND": "13",
        "MANIPUR": "14",
        "MIZORAM": "15",
        "TRIPURA": "16",
        "MEGHALAYA": "17",
        "ASSAM": "18",
        "WEST BENGAL": "19",
        "JHARKHAND": "20",
        "ODISHA": "21",
        "CHATTISGARH": "22",
        "MADHYA PRADESH": "23",
        "GUJARAT": "24",
        "DADRA AND NAGAR HAVELI AND DAMAN AND DIU": "26",
        "MAHARASHTRA": "27",
        "ANDHRA PRADESH": "28",
        "KARNATAKA": "29",
        "GOA": "30",
        "LAKSHADWEEP": "31",
        "KERALA": "32",
        "TAMIL NADU": "33",
        "PUDUCHERRY": "34",
        "ANDAMAN AND NICOBAR ISLANDS": "35",
        "TELANGANA": "36",
        "LADAKH": "38",
        "ANDHRA PRADESH (NEW)": "37" // As per statesMap in profile page, assuming this is for 37 state code.
    };


    // Function to format state display (with GSTIN prefix based on selected state)
    const formatStateDisplay = (state) => {
        const formattedState = formatStateName(state); // Format state name
        const stateCode = stateCodeMap[state?.toUpperCase()]; // Look up state code, handle undefined state
        if (stateCode) {
            return `${stateCode}-${formattedState}`; // Prefix with state code if found
        }
        return formattedState; // Just return formatted state if code not found (or no state selected)
    };


    // Compute "Place of Supply" using customer's GSTIN and state if available
    const placeOfSupply = formatStateDisplay(invoice.stateOfSupply);


    // Helper function to calculate GST amount for an item
    const calculateGSTAmount = (item) => {
        const qty = Number(item.qty) || 0;
        const price = Number(item.price) || 0;
        return item.tax === "GST@18%" ? price * qty * 0.18 : 0;
    };

    return (
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl w-full">
                <div className="px-6 py-8">
                    {/* Header */}
                    <div className="flex justify-between items-start border-b pb-4 mb-6">
                        <div>
                            {profile.companyName && <h1 className="text-2xl font-bold text-gray-800">{profile.companyName}</h1>}
                            {profile.address && formatAddress(profile.address)}
                            {profile.phone && <p className="text-sm text-gray-600 mt-1">Phone no. : {profile.phone}</p>}
                            {profile.email && <p className="text-sm text-gray-600 mt-1">Email : {profile.email}</p>}
                            {profile.gstin && <p className="text-sm text-gray-600 mt-1">GSTIN : {profile.gstin}</p>}
                            {profile.state && <p className="text-sm text-gray-600 mt-1">State : {formatStateDisplay(profile.state)}</p>} {/* Display formatted state in header */}
                        </div>
                        <div className="w-20 h-20 rounded-md flex items-center justify-center shadow-sm overflow-hidden">
                            {profile.logoUrl ? (
                                <img src={profile.logoUrl} alt="Company Logo" className="object-cover w-full h-full" />
                            ) : (
                                <span className="text-gray-500 text-xs font-medium uppercase">Logo</span>
                            )}
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-center text-3xl font-semibold text-gray-800 my-6">Tax Invoice</h2>

                    {/* Bill To & Invoice Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {/* Bill To */}
                        <div>
                            <h3 className="font-semibold text-lg text-gray-700 mb-3">Bill To</h3>
                            <p className="font-medium text-gray-800">{invoice.customer.name}</p>
                            <p className="text-sm text-gray-600">{invoice.customer.address}</p>
                            {invoice.customer.contact?.trim() && (
                                <p className="text-sm text-gray-600 mt-1">Contact No. : {invoice.customer.contact}</p>
                            )}
                            {customerGSTIN && (
                                <p className="text-sm text-gray-600 mt-1">GSTIN : {customerGSTIN}</p>
                            )}
                            {customerState && (
                                <p className="text-sm text-gray-600 mt-1">
                                    State: {formatStateDisplay(customerState)} {/* Display formatted customer state */}
                                </p>
                            )}
                        </div>
                        {/* Invoice Details */}
                        <div className="text-right">
                            <h3 className="font-semibold text-lg text-gray-700 mb-3">Invoice Details</h3>
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
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border border-gray-200 rounded-md shadow-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">#</th>
                                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Item name</th>
                                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">HSN/SAC</th>
                                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Quantity</th>
                                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Price/Unit</th>
                                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">GST</th>
                                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {invoice.items.map((item, index) => {
                                    const qty = Number(item.qty) || 0;
                                    const price = Number(item.price) || 0;
                                    const gstAmount = calculateGSTAmount(item);
                                    return (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">{index + 1}</td>
                                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">{item.name}</td>
                                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">{item.hsn}</td>
                                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">{qty}</td>
                                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">₹ {formatCurrency(price)}</td>
                                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">
                                                {item.tax === "GST@18%"
                                                    ? `₹ ${formatCurrency(gstAmount)} (18%)`
                                                    : item.tax}
                                            </td>
                                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">₹ {formatCurrency(item.amount)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot className="bg-gray-50 font-medium">
                                <tr>
                                    <td colSpan={2} className="border border-gray-200 px-4 py-3 text-sm text-gray-700">Total</td>
                                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700"></td>
                                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">
                                        {invoice.items.reduce((acc, item) => acc + Number(item.qty), 0)}
                                    </td>
                                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700"></td>
                                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">
                                        {isIntraState
                                            ? `₹ ${formatCurrency(invoice.totals.sgst + invoice.totals.cgst)}`
                                            : `₹ ${formatCurrency(invoice.totals.igst)}`}
                                    </td>
                                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                                        ₹ {formatCurrency(invoice.totals.total)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Description Section (if provided) */}
                    {invoice.description && (
                        <div className="mb-8 mt-6">
                            <h4 className="font-medium text-lg text-gray-700 mb-3">Description</h4>
                            <p className="text-sm text-gray-600">{invoice.description}</p>
                        </div>
                    )}

                    {/* Amount Details Section */}
                    <div className="flex justify-between flex-col md:flex-row mb-8 gap-6">
                        <div className="max-w-md">
                            <h4 className="font-medium text-lg text-gray-700 mb-3">Invoice Amount In Words</h4>
                            <p className="text-sm text-gray-600 italic">
                                {numberToWords(invoice.totals.total)} Rupees only
                            </p>
                            <div className="mt-6">
                                <h4 className="font-medium text-lg text-gray-700 mb-3">Terms and Conditions</h4>
                                <p className="text-sm text-gray-600">Thanks for doing business with us!</p>
                            </div>
                        </div>
                        <div className="w-full md:w-64">
                            <table className="w-full text-sm">
                                <tbody>
                                    <tr>
                                        <td className="py-2 text-gray-700">Sub Total</td>
                                        <td className="text-right text-gray-700">₹ {formatCurrency(invoice.totals.subTotal)}</td>
                                    </tr>
                                    {isIntraState ? (
                                        <>
                                            <tr>
                                                <td className="py-2 text-gray-700">SGST@9%</td>
                                                <td className="text-right text-gray-700">₹ {formatCurrency(invoice.totals.sgst)}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-2 text-gray-700">CGST@9%</td>
                                                <td className="text-right text-gray-700">₹ {formatCurrency(invoice.totals.cgst)}</td>
                                            </tr>
                                        </>
                                    ) : (
                                        <tr>
                                            <td className="py-2 text-gray-700">IGST@18%</td>
                                            <td className="text-right text-gray-700">₹ {formatCurrency(invoice.totals.igst)}</td>
                                        </tr>
                                    )}
                                    <tr className="border-t border-gray-200 font-medium">
                                        <td className="py-2 text-gray-800">Total</td>
                                        <td className="text-right text-gray-800">₹ {formatCurrency(invoice.totals.total)}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 text-gray-700">Received</td>
                                        <td className="text-right text-gray-700">₹ {formatCurrency(invoice.totals.received)}</td>
                                    </tr>
                                    <tr className="border-t border-gray-200 font-medium">
                                        <td className="py-2 text-gray-800">Balance</td>
                                        <td className="text-right text-gray-800">₹ {formatCurrency(invoice.totals.balance)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-right mt-12">
                        <p className="mb-2 text-gray-700">For: {profile.companyName}</p>
                        {profile.signatureUrl && (
                            <div className="mb-2">
                                <img src={profile.signatureUrl} alt="Authorized Signature" className="max-h-20 inline-block" />
                            </div>
                        )}
                        <div className="border-t border-gray-300 pt-1 inline-block">
                            <p className="text-gray-800 font-semibold">Authorized Signatory</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}