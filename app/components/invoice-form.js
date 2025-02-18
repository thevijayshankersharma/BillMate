"use client";

import React, { useState, useEffect } from "react";
import { FileText, Trash2, X } from "lucide-react";
import { Button } from "./ui/button";
import { FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { useRouter } from "next/navigation";

// GSTIN parser used for lookup only (it does not alter the original input)
function parseGSTIN(gstin) {
  if (!gstin) {
    return { state: "", gstType: "Unregistered/Consumer" };
  }
  // For lookup purposes, if only one digit is entered, pad with a zero.
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
    "26": "DADRA AND NAGAR HAVELI AND DAMAN AND DIU (NEWLY MERGED UT)",
    "27": "MAHARASHTRA",
    "28": "ANDHRA PRADESH (BEFORE DIVISION)",
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
  const state = statesMap[stateCode] || "";
  const gstType = state ? "Registered Business - Regular" : "Unregistered/Consumer";
  return { state, gstType };
}

export function InvoiceForm() {
  const router = useRouter();

  // Invoice details state
  const [invoiceNumber, setInvoiceNumber] = useState(1);
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  // Customer details
  const [customer, setCustomer] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [stateOfSupply, setStateOfSupply] = useState("none");

  // Payment type state
  const [paymentType, setPaymentType] = useState("cash");
  const [chequeRef, setChequeRef] = useState("");

  // Items state: two empty rows by default
  const [items, setItems] = useState([
    { id: 1, name: "", hsn: "", qty: "", unit: "none", price: "", tax: "none", total: 0 },
    { id: 2, name: "", hsn: "", qty: "", unit: "none", price: "", tax: "none", total: 0 },
  ]);

  // Description state
  const [showDescription, setShowDescription] = useState(false);
  const [description, setDescription] = useState("");

  // Received amount (for dynamic balance calculation)
  const [received, setReceived] = useState(0);

  // --- Party (Customer) Management ---
  const [parties, setParties] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null);
  const [showAddPartyModal, setShowAddPartyModal] = useState(false);

  // Party form fields
  const [partyName, setPartyName] = useState("");
  const [partyGSTIN, setPartyGSTIN] = useState("");
  const [partyPhone, setPartyPhone] = useState("");
  const [partyBillingAddress, setPartyBillingAddress] = useState("");
  const [partyState, setPartyState] = useState("");
  const [partyGSTType, setPartyGSTType] = useState("");
  const [partyEmail, setPartyEmail] = useState("");

  // --- Persist Parties ---
  // On mount, load any previously saved parties from localStorage.
  useEffect(() => {
    const storedParties = localStorage.getItem("parties");
    if (storedParties) {
      setParties(JSON.parse(storedParties));
    }
  }, []);

  // Whenever parties change, save them to localStorage.
  useEffect(() => {
    localStorage.setItem("parties", JSON.stringify(parties));
  }, [parties]);

  // Update GSTIN lookup as user types (for party fields only)
  const handleGSTINChange = (e) => {
    const gstin = e.target.value;
    setPartyGSTIN(gstin);
    const details = parseGSTIN(gstin);
    setPartyState(details.state);
    setPartyGSTType(details.gstType);
  };

  const handleAddParty = () => {
    if (!partyName.trim()) {
      alert("Party Name is required");
      return;
    }
    const newParty = {
      id: parties.length + 1,
      name: partyName,
      gstin: partyGSTIN, // Save the GSTIN as entered (without padding)
      phone: partyPhone,
      billingAddress: partyBillingAddress,
      state: partyState,
      gstType: partyGSTType,
      email: partyEmail,
    };
    setParties([...parties, newParty]);
    setSelectedParty(newParty);
    // Update main form fields with party details
    setPhone(newParty.phone || "");
    setBillingAddress(newParty.billingAddress || "");
    setShowAddPartyModal(false);
    // Clear party fields
    setPartyName("");
    setPartyGSTIN("");
    setPartyPhone("");
    setPartyBillingAddress("");
    setPartyState("");
    setPartyGSTType("");
    setPartyEmail("");
  };

  const handleSavePartyAndNew = () => {
    if (!partyName.trim()) {
      alert("Party Name is required");
      return;
    }
    const newParty = {
      id: parties.length + 1,
      name: partyName,
      gstin: partyGSTIN,
      phone: partyPhone,
      billingAddress: partyBillingAddress,
      state: partyState,
      gstType: partyGSTType,
      email: partyEmail,
    };
    setParties([...parties, newParty]);
    setSelectedParty(newParty);
    // Update main form fields with party details
    setPhone(newParty.phone || "");
    setBillingAddress(newParty.billingAddress || "");
    // Clear fields but keep modal open for adding another party
    setPartyName("");
    setPartyGSTIN("");
    setPartyPhone("");
    setPartyBillingAddress("");
    setPartyState("");
    setPartyGSTType("");
    setPartyEmail("");
  };

  // --- Existing Functions ---
  const addItem = () => {
    setItems([
      ...items,
      { id: items.length + 1, name: "", hsn: "", qty: "", unit: "none", price: "", tax: "none", total: 0 },
    ]);
  };

  const handleDeleteRow = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const calculateTotal = (item) => {
    const price = parseFloat(item.price) || 0;
    const qty = parseFloat(item.qty) || 0;
    const taxRate = item.tax === "GST@18%" ? 0.18 : 0;
    const subtotal = price * qty;
    const tax = subtotal * taxRate;
    return subtotal + tax;
  };

  const totalQuantity = items.reduce((acc, item) => acc + (parseFloat(item.qty) || 0), 0);
  const totalTax = items.reduce((acc, item) => {
    const price = parseFloat(item.price) || 0;
    const qty = parseFloat(item.qty) || 0;
    const taxRate = item.tax === "GST@18%" ? 0.18 : 0;
    return acc + price * qty * taxRate;
  }, 0);
  const grandTotal = items.reduce((acc, item) => acc + calculateTotal(item), 0);

  const indianStates = [
    "JAMMU AND KASHMIR",
    "HIMACHAL PRADESH",
    "PUNJAB",
    "CHANDIGARH",
    "UTTARAKHAND",
    "HARYANA",
    "DELHI",
    "RAJASTHAN",
    "UTTAR PRADESH",
    "BIHAR",
    "SIKKIM",
    "ARUNACHAL PRADESH",
    "NAGALAND",
    "MANIPUR",
    "MIZORAM",
    "TRIPURA",
    "MEGHALAYA",
    "ASSAM",
    "WEST BENGAL",
    "JHARKHAND",
    "ODISHA",
    "CHATTISGARH",
    "MADHYA PRADESH",
    "GUJARAT",
    "DADRA AND NAGAR HAVELI AND DAMAN AND DIU (NEWLY MERGED UT)",
    "MAHARASHTRA",
    "ANDHRA PRADESH (BEFORE DIVISION)",
    "KARNATAKA",
    "GOA",
    "LAKSHADWEEP",
    "KERALA",
    "TAMIL NADU",
    "PUDUCHERRY",
    "ANDAMAN AND NICOBAR ISLANDS",
    "TELANGANA",
    "ANDHRA PRADESH",
    "LADAKH",
  ];

  const handleSave = () => {
    alert("Invoice saved!");
    setInvoiceNumber((prev) => prev + 1);
    setCustomer("");
    setBillingAddress("");
    setPhone("");
    setStateOfSupply("none");
    setPaymentType("cash");
    setChequeRef("");
    setItems([
      { id: 1, name: "", hsn: "", qty: "", unit: "none", price: "", tax: "none", total: 0 },
      { id: 2, name: "", hsn: "", qty: "", unit: "none", price: "", tax: "none", total: 0 },
    ]);
    setInvoiceDate(new Date().toISOString().substring(0, 10));
    setShowDescription(false);
    setDescription("");
    setSelectedParty(null);
    setReceived(0);
  };

  // Modified handleShare: include GSTIN, state, received and dynamically calculate balance.
  const handleShare = () => {
    const baseTotal = items.reduce(
      (acc, item) => acc + ((parseFloat(item.price) || 0) * (parseFloat(item.qty) || 0)),
      0
    );
    const taxTotal = items.reduce((acc, item) => {
      const price = parseFloat(item.price) || 0;
      const qty = parseFloat(item.qty) || 0;
      return acc + price * qty * (item.tax === "GST@18%" ? 0.18 : 0);
    }, 0);
    const calculatedGrandTotal = baseTotal + taxTotal;
    const isIntraState = stateOfSupply.trim().toLowerCase() === "gujarat";

    let sgst = 0, cgst = 0, igst = 0;
    if (isIntraState) {
      sgst = taxTotal / 2;
      cgst = taxTotal / 2;
    } else {
      igst = taxTotal;
    }

    const invoiceData = {
      company: {
        name: "ETRONICS SOLUTIONS",
        phone: "8142870951",
      },
      customer: {
        name: selectedParty ? selectedParty.name : customer,
        contact: phone,
        address: billingAddress,
        gstin: selectedParty ? selectedParty.gstin : "",
        state: selectedParty ? selectedParty.state : "",
      },
      invoice: {
        number: invoiceNumber.toString(),
        date: invoiceDate,
      },
      items: items.map((item) => ({
        name: item.name,
        hsn: item.hsn,
        qty: Number(item.qty),
        price: Number(item.price),
        tax: item.tax,
        amount:
          (parseFloat(item.price) || 0) *
          (parseFloat(item.qty) || 0) *
          (item.tax === "GST@18%" ? 1.18 : 1),
      })),
      totals: {
        subTotal: baseTotal,
        ...(isIntraState ? { sgst, cgst } : { igst }),
        total: calculatedGrandTotal,
        received: received,
        balance: calculatedGrandTotal - received,
      },
      description,
      stateOfSupply,
      paymentType,
      chequeRef,
    };

    localStorage.setItem("invoiceData", JSON.stringify(invoiceData));
    router.push("/invoice/1");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-6 sm:py-12">
      {/* Global styles */}
      <style jsx global>{`
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden md:max-w-4xl lg:max-w-5xl xl:max-w-6xl">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Create Sale Invoice</h1>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Left Section: Customer & Contact Details */}
            <div className="space-y-4">
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700 mb-1">Customer *</FormLabel>
                <Select
                  value={selectedParty ? selectedParty.id.toString() : ""}
                  onValueChange={(value) => {
                    if (value === "add") {
                      setShowAddPartyModal(true);
                    } else {
                      const party = parties.find((p) => p.id.toString() === value);
                      setSelectedParty(party);
                      // Update main form fields with party details
                      setPhone(party.phone || "");
                      setBillingAddress(party.billingAddress || "");
                    }
                  }}
                >
                  <SelectTrigger className="w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" side="top">
                    <SelectValue placeholder="Select Party" className="text-gray-700" />
                  </SelectTrigger>
                  <SelectContent side="top" className="z-50">
                    <SelectItem value="add" className="text-gray-700 hover:bg-gray-100 focus:bg-gray-100">+ Add Party</SelectItem>
                    {parties.map((party) => (
                      <SelectItem key={party.id} value={party.id.toString()} className="text-gray-700 hover:bg-gray-100 focus:bg-gray-100">
                        {party.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700 mb-1">Phone Number</FormLabel>
                <Input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </FormItem>
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700 mb-1">Billing Address</FormLabel>
                <Textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  placeholder="Enter billing address"
                  rows={3} // Added rows for better default height
                />
              </FormItem>
            </div>

            {/* Right Section: Invoice Details */}
            <div className="space-y-4">
              <div className="flex justify-between gap-4">
                <FormItem className="w-1/2">
                  <FormLabel className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</FormLabel>
                  <Input
                    type="number"
                    step="any"
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(Number(e.target.value))}
                  />
                </FormItem>
                <FormItem className="w-1/2">
                  <FormLabel className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</FormLabel>
                  <Input
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                  />
                </FormItem>
              </div>
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700 mb-1">State of Supply</FormLabel>
                <Select value={stateOfSupply} onValueChange={setStateOfSupply}>
                  <SelectTrigger className="w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" side="top">
                    <SelectValue placeholder="None" className="text-gray-700" />
                  </SelectTrigger>
                  <SelectContent side="top" className="z-50">
                    <SelectItem value="none" className="text-gray-700 hover:bg-gray-100 focus:bg-gray-100">None</SelectItem>
                    {indianStates.map((state) => (
                      <SelectItem key={state} value={state} className="text-gray-700 hover:bg-gray-100 focus:bg-gray-100">
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            </div>
          </div>

          {/* Party Modal */}
          {showAddPartyModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out"
                 style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} // Semi-transparent overlay using inline style for animation
            >
              <div className="bg-white p-6 z-10 w-full max-w-md rounded-lg shadow-xl transform transition-transform duration-300 ease-in-out">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Add Party</h3>
                  <button
                    onClick={() => setShowAddPartyModal(false)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <X className="h-5 w-5" /> {/* Using X icon from lucide-react */}
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Responsive grid for modal fields */}
                  <div className="col-span-full"> {/* Full width on small screens */}
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">Party Name *</FormLabel>
                      <Input
                        type="text"
                        value={partyName}
                        onChange={(e) => setPartyName(e.target.value)}
                        placeholder="Enter party name"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </FormItem>
                  </div>
                  <div>
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">GSTIN</FormLabel>
                      <Input
                        type="text"
                        value={partyGSTIN}
                        onChange={handleGSTINChange}
                        placeholder="Enter GSTIN"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </FormItem>
                  </div>
                  <div>
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">Phone Number</FormLabel>
                      <Input
                        type="text"
                        value={partyPhone}
                        onChange={(e) => setPartyPhone(e.target.value)}
                        placeholder="Enter phone number"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </FormItem>
                  </div>
                  <div className="col-span-full"> {/* Full width on small screens */}
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">Billing Address</FormLabel>
                      <Textarea
                        value={partyBillingAddress}
                        onChange={(e) => setPartyBillingAddress(e.target.value)}
                        placeholder="Enter billing address"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        rows={2} // Adjusted rows for modal
                      />
                    </FormItem>
                  </div>
                  <div>
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">State</FormLabel>
                      <Select value={partyState} onValueChange={setPartyState}>
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
                  </div>
                  <div>
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">GST Type</FormLabel>
                      <Select value={partyGSTType} onValueChange={setPartyGSTType}>
                        <SelectTrigger className="w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" side="top">
                          <SelectValue placeholder="Select GST Type" className="text-gray-700" />
                        </SelectTrigger>
                        <SelectContent side="top" className="z-50">
                          <SelectItem value="Unregistered/Consumer" className="text-gray-700 hover:bg-gray-100 focus:bg-gray-100">
                            Unregistered/Consumer
                          </SelectItem>
                          <SelectItem value="Registered Business - Regular" className="text-gray-700 hover:bg-gray-100 focus:bg-gray-100">
                            Registered Business - Regular
                          </SelectItem>
                          <SelectItem value="Registered Business - Composition" className="text-gray-700 hover:bg-gray-100 focus:bg-gray-100">
                            Registered Business - Composition
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  </div>
                  <div className="col-span-full"> {/* Full width on small screens */}
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">Email ID</FormLabel>
                      <Input
                        type="email"
                        value={partyEmail}
                        onChange={(e) => setPartyEmail(e.target.value)}
                        placeholder="Enter Email ID"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </FormItem>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="secondary" onClick={() => setShowAddPartyModal(false)} className="rounded-md shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Cancel</Button>
                  <Button onClick={handleSavePartyAndNew} className="rounded-md shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Save & New</Button>
                  <Button onClick={handleAddParty} className="rounded-md shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Save</Button>
                </div>
              </div>
            </div>
          )}

          {/* Items Table */}
          <div className="mt-8">
            <div className="shadow overflow-hidden border border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ITEM</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HSN CODE</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QTY</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UNIT</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <span >PRICE/UNIT</span>
                      <Select defaultValue="without">
                        <SelectTrigger className="ml-1 inline-block h-8 text-xs bg-white border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500" side="top">
                          <SelectValue className="text-gray-700">Without Tax</SelectValue>
                        </SelectTrigger>
                        <SelectContent side="top" className="z-50">
                          <SelectItem value="without" className="text-gray-700 hover:bg-gray-100 focus:bg-gray-100">Without Tax</SelectItem>
                        </SelectContent>
                      </Select>
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TAX</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AMOUNT</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item, index) => (
                    <tr key={item.id} className="group hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center space-x-2">
                        <span>{index + 1}</span>
                        <button
                          onClick={() => handleDeleteRow(item.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        <Input
                          className="bg-transparent border-0 p-0 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm"
                          value={item.name}
                          onChange={(e) =>
                            setItems(
                              items.map((i) =>
                                i.id === item.id ? { ...i, name: e.target.value } : i
                              )
                            )
                          }
                        />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        <Input
                          className="bg-transparent border-0 p-0 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm"
                          value={item.hsn}
                          onChange={(e) =>
                            setItems(
                              items.map((i) =>
                                i.id === item.id ? { ...i, hsn: e.target.value } : i
                              )
                            )
                          }
                        />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        <Input
                          type="number"
                          step="any"
                          min="0"
                          className="bg-transparent border-0 p-0 h-8 w-16 focus:ring-indigo-500 focus:border-indigo-500 block sm:text-sm"
                          value={item.qty}
                          onChange={(e) =>
                            setItems(
                              items.map((i) =>
                                i.id === item.id ? { ...i, qty: e.target.value } : i
                              )
                            )
                          }
                        />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        <Select
                          value={item.unit}
                          onValueChange={(value) =>
                            setItems(
                              items.map((i) =>
                                i.id === item.id ? { ...i, unit: value } : i
                              )
                            )
                          }
                        >
                          <SelectTrigger className="bg-transparent border-0 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm" side="top">
                            <SelectValue placeholder="Select" className="text-gray-700" />
                          </SelectTrigger>
                          <SelectContent side="top" className="z-50">
                            <SelectItem value="none" className="text-gray-700 hover:bg-gray-100 focus:bg-gray-100">Select</SelectItem>
                            <SelectItem value="NONE" className="text-gray-700 hover:bg-gray-100 focus:bg-gray-100">NONE</SelectItem>
                            <SelectItem value="PCS" className="text-gray-700 hover:bg-gray-100 focus:bg-gray-100">PCS</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        <Input
                          type="number"
                          step="any"
                          min="0"
                          className="bg-transparent border-0 p-0 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm"
                          value={item.price}
                          onChange={(e) =>
                            setItems(
                              items.map((i) =>
                                i.id === item.id ? { ...i, price: e.target.value } : i
                              )
                            )
                          }
                        />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        <Select
                          value={item.tax}
                          onValueChange={(value) =>
                            setItems(
                              items.map((i) =>
                                i.id === item.id ? { ...i, tax: value } : i
                              )
                            )
                          }
                        >
                          <SelectTrigger className="bg-transparent border-0 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm" side="top">
                            <SelectValue placeholder="Select" className="text-gray-700" />
                          </SelectTrigger>
                          <SelectContent side="top" className="z-50">
                            <SelectItem value="none" className="text-gray-700 hover:bg-gray-100 focus:bg-gray-100">Select</SelectItem>
                            <SelectItem value="NONE" className="text-gray-700 hover:bg-gray-100 focus:bg-gray-100">NONE</SelectItem>
                            <SelectItem value="GST@18%" className="text-gray-700 hover:bg-gray-100 focus:bg-gray-100">GST@18%</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{calculateTotal(item).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={8} className="px-3 py-3">
                      <Button
                        variant="link"
                        size="sm"
                        className="text-indigo-600 hover:text-indigo-700 p-0 h-auto font-medium"
                        onClick={addItem}
                      >
                        ADD ROW
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <td colSpan={3} className="px-3 py-3 text-sm font-medium text-gray-900">TOTAL</td>
                    <td className="px-3 py-3 text-sm text-gray-700">{totalQuantity}</td>
                    <td colSpan={3} className="px-3 py-3 text-right text-sm font-medium text-gray-900">{totalTax.toFixed(2)}</td>
                    <td className="px-3 py-3 text-sm font-medium text-gray-900">{grandTotal.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Payment Section */}
          <div className="mt-8 flex justify-between flex-col sm:flex-row gap-6"> {/* Responsive layout for payment section */}
            <div className="space-y-4">
              <div>
                <FormLabel className="block text-sm font-medium text-gray-700 mb-1">Payment Type</FormLabel>
                <Select value={paymentType} onValueChange={setPaymentType}>
                  <SelectTrigger className="w-full sm:w-[200px] rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" side="top">
                    <SelectValue placeholder="Select Payment Type" className="text-gray-700" />
                  </SelectTrigger>
                  <SelectContent side="top" className="z-50">
                    <SelectItem value="cash" className="text-gray-700 hover:bg-gray-100 focus:bg-gray-100">Cash</SelectItem>
                    <SelectItem value="cheque" className="text-gray-700 hover:bg-gray-100 focus:bg-gray-100">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {paymentType === "cheque" && (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-gray-700 mb-1">Cheque Reference Number</FormLabel>
                  <Input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter reference number"
                    value={chequeRef}
                    onChange={(e) => setChequeRef(e.target.value)}
                  />
                </FormItem>
              )}
              <Button variant="link" className="text-indigo-600 hover:text-indigo-700 p-0 h-auto font-medium">
                + Add Payment type
              </Button>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-indigo-600 hover:text-indigo-700 p-0 h-auto font-medium rounded-md shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  onClick={() => setShowDescription(!showDescription)}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  ADD DESCRIPTION
                </Button>
                {showDescription && (
                  <Textarea
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter description here..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2} // Adjusted rows for description
                  />
                )}
              </div>
            </div>

            {/* Totals Section (No Round Off; dynamic Received/Balance) */}
            <div className="space-y-4 min-w-[200px] self-end"> {/* Aligned to the end in flex container */}
              <div className="flex items-center justify-between gap-4">
                <label className="text-sm font-medium text-gray-700">Total</label>
                <Input type="number" className="w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-right" value={grandTotal.toFixed(2)} readOnly />
              </div>
              <div className="flex items-center justify-between gap-4">
                <label className="text-sm font-medium text-gray-700">Received</label>
                <Input
                  type="number"
                  className="w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-right"
                  value={received}
                  onChange={(e) => setReceived(Number(e.target.value))}
                />
              </div>
              <div className="flex items-center justify-between gap-4 pt-2 border-t border-gray-200">
                <label className="text-sm font-semibold text-gray-800">Balance</label>
                <span className="text-sm font-semibold text-gray-800">{(grandTotal - received).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end gap-3">
            <Button variant="outline" onClick={handleShare} className="rounded-md shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Share</Button>
            <Button onClick={handleSave} className="rounded-md shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Save</Button>
          </div>
        </div>
      </div>
    </div>
  );
}