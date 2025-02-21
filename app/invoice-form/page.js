"use client";

import React, { useState, useEffect } from "react";
import { FileText, Trash2, X, Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { FormItem, FormLabel } from "../components/ui/form";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { useRouter } from "next/navigation";

function parseGSTIN(gstin) {
  if (!gstin) return { state: "", gstType: "Unregistered/Consumer" };
  const stateCode = gstin.length >= 2 ? gstin.substring(0, 2) : "0" + gstin;
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
  const state = statesMap[stateCode] || "";
  const gstType = state ? "Registered Business - Regular" : "Unregistered/Consumer";
  return { state, gstType };
}

export default function InvoiceForm() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [invoiceNumber, setInvoiceNumber] = useState(1);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().substring(0, 10));
  const [customer, setCustomer] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [stateOfSupply, setStateOfSupply] = useState("none");
  const [paymentType, setPaymentType] = useState("cash");
  const [chequeRef, setChequeRef] = useState("");
  const [items, setItems] = useState([
    { id: 1, name: "", hsn: "", qty: "", unit: "none", price: "", tax: "none", total: 0 },
    { id: 2, name: "", hsn: "", qty: "", unit: "none", price: "", tax: "none", total: 0 },
  ]);
  const [showDescription, setShowDescription] = useState(false);
  const [description, setDescription] = useState("");
  const [received, setReceived] = useState(0);
  const [parties, setParties] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null);
  const [showAddPartyModal, setShowAddPartyModal] = useState(false);
  const [partyName, setPartyName] = useState("");
  const [partyGSTIN, setPartyGSTIN] = useState("");
  const [partyPhone, setPartyPhone] = useState("");
  const [partyBillingAddress, setPartyBillingAddress] = useState("");
  const [partyState, setPartyState] = useState("");
  const [partyGSTType, setPartyGSTType] = useState("");
  const [partyEmail, setPartyEmail] = useState("");

  useEffect(() => {
    const storedLoginStatus = localStorage.getItem("isLoggedIn");
    if (storedLoginStatus !== "true") {
      router.push("/login");
    }
    setIsCheckingAuth(false);
  }, [router]);

  useEffect(() => {
    const storedParties = localStorage.getItem("parties");
    if (storedParties) setParties(JSON.parse(storedParties));
  }, []);

  useEffect(() => {
    localStorage.setItem("parties", JSON.stringify(parties));
  }, [parties]);

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
      gstin: partyGSTIN,
      phone: partyPhone,
      billingAddress: partyBillingAddress,
      state: partyState,
      gstType: partyGSTType,
      email: partyEmail,
    };
    setParties([...parties, newParty]);
    setSelectedParty(newParty);
    setPhone(newParty.phone || "");
    setBillingAddress(newParty.billingAddress || "");
    setShowAddPartyModal(false);
    resetPartyFields();
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
    setPhone(newParty.phone || "");
    setBillingAddress(newParty.billingAddress || "");
    resetPartyFields();
  };

  const resetPartyFields = () => {
    setPartyName("");
    setPartyGSTIN("");
    setPartyPhone("");
    setPartyBillingAddress("");
    setPartyState("");
    setPartyGSTType("");
    setPartyEmail("");
  };

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
    "JAMMU AND KASHMIR", "HIMACHAL PRADESH", "PUNJAB", "CHANDIGARH", "UTTARAKHAND",
    "HARYANA", "DELHI", "RAJASTHAN", "UTTAR PRADESH", "BIHAR", "SIKKIM",
    "ARUNACHAL PRADESH", "NAGALAND", "MANIPUR", "MIZORAM", "TRIPURA", "MEGHALAYA",
    "ASSAM", "WEST BENGAL", "JHARKHAND", "ODISHA", "CHATTISGARH", "MADHYA PRADESH",
    "GUJARAT", "DADRA AND NAGAR HAVELI AND DAMAN AND DIU", "MAHARASHTRA",
    "ANDHRA PRADESH", "KARNATAKA", "GOA", "LAKSHADWEEP", "KERALA", "TAMIL NADU",
    "PUDUCHERRY", "ANDAMAN AND NICOBAR ISLANDS", "TELANGANA", "LADAKH",
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

  const handleShare = () => {
    const baseTotal = items.reduce(
      (acc, item) => acc + ((parseFloat(item.price) || 0) * (parseFloat(item.qty) || 0)),
      0
    );
    const taxTotal = totalTax;
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
      company: { name: "ETRONICS SOLUTIONS", phone: "8142870951" },
      customer: {
        name: selectedParty ? selectedParty.name : customer,
        contact: phone,
        address: billingAddress,
        gstin: selectedParty ? selectedParty.gstin : "",
        state: selectedParty ? selectedParty.state : "",
      },
      invoice: { number: invoiceNumber.toString(), date: invoiceDate },
      items: items.map((item) => ({
        name: item.name,
        hsn: item.hsn,
        qty: Number(item.qty),
        price: Number(item.price),
        tax: item.tax,
        amount: calculateTotal(item),
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

  if (isCheckingAuth) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-6 sm:py-12">
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

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl p-4 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">
          Create Sale Invoice
        </h1>

        {/* Customer and Invoice Details */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <div className="space-y-4">
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Customer *</FormLabel>
              <Select
                value={selectedParty ? selectedParty.id.toString() : ""}
                onValueChange={(value) => {
                  if (value === "add") setShowAddPartyModal(true);
                  else {
                    const party = parties.find((p) => p.id.toString() === value);
                    setSelectedParty(party);
                    setPhone(party.phone || "");
                    setBillingAddress(party.billingAddress || "");
                  }
                }}
              >
                <SelectTrigger className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 h-10 sm:h-12">
                  <SelectValue placeholder="Select Party" />
                </SelectTrigger>
                <SelectContent side="top" className="z-50">
                  <SelectItem value="add">+ Add Party</SelectItem>
                  {parties.map((party) => (
                    <SelectItem key={party.id} value={party.id.toString()}>
                      {party.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Phone Number</FormLabel>
              <Input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 h-10 sm:h-12"
              />
            </FormItem>
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Billing Address</FormLabel>
              <Textarea
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
                placeholder="Enter billing address"
                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 h-[120px]"
                style={{ resize: 'none' }} // Disable resize here
              />
            </FormItem>
          </div>
          <div className="space-y-4">
            <div className="flex gap-4">
              <FormItem className="flex-1">
                <FormLabel className="text-sm font-medium text-gray-700">Invoice Number</FormLabel>
                <Input
                  type="number"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(Number(e.target.value))}
                  className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 h-10 sm:h-12"
                  min="0" // Prevent negative values
                />
              </FormItem>
              <FormItem className="flex-1">
                <FormLabel className="text-sm font-medium text-gray-700">Invoice Date</FormLabel>
                <Input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 h-10 sm:h-12"
                />
              </FormItem>
            </div>
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">State of Supply</FormLabel>
              <Select value={stateOfSupply} onValueChange={setStateOfSupply}>
                <SelectTrigger className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 h-10 sm:h-12">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent side="top" className="z-50">
                  <SelectItem value="none">None</SelectItem>
                  {indianStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          </div>
        </div>

        {/* Add Party Modal */}
        {showAddPartyModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300">
            <div className="bg-white p-6 w-full max-w-md sm:max-w-lg rounded-xl shadow-2xl md:w-full animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Add Party</h3>
                <button
                  onClick={() => setShowAddPartyModal(false)}
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormItem className="col-span-full">
                  <FormLabel className="text-sm font-medium text-gray-700">Party Name *</FormLabel>
                  <Input
                    type="text"
                    value={partyName}
                    onChange={(e) => setPartyName(e.target.value)}
                    placeholder="Enter party name"
                    className="h-10 sm:h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </FormItem>
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">GSTIN</FormLabel>
                  <Input
                    type="text"
                    value={partyGSTIN}
                    onChange={handleGSTINChange}
                    placeholder="Enter GSTIN"
                    className="h-10 sm:h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </FormItem>
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Phone Number</FormLabel>
                  <Input
                    type="text"
                    value={partyPhone}
                    onChange={(e) => setPartyPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="h-10 sm:h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </FormItem>
                <FormItem className="col-span-full">
                  <FormLabel className="text-sm font-medium text-gray-700">Billing Address</FormLabel>
                  <Textarea
                    value={partyBillingAddress}
                    onChange={(e) => setPartyBillingAddress(e.target.value)}
                    placeholder="Enter billing address"
                    className="h-[120px] border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    style={{ resize: 'none' }} // Disable resize here
                  />
                </FormItem>
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">State</FormLabel>
                  <Select value={partyState} onValueChange={setPartyState}>
                    <SelectTrigger className="h-10 sm:h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent side="top" className="z-50">
                      {indianStates.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">GST Type</FormLabel>
                  <Select value={partyGSTType} onValueChange={setPartyGSTType}>
                    <SelectTrigger className="h-10 sm:h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                      <SelectValue placeholder="Select GST Type" />
                    </SelectTrigger>
                    <SelectContent side="top" className="z-50">
                      <SelectItem value="Unregistered/Consumer">Unregistered/Consumer</SelectItem>
                      <SelectItem value="Registered Business - Regular">Registered Business - Regular</SelectItem>
                      <SelectItem value="Registered Business - Composition">Registered Business - Composition</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
                <FormItem className="col-span-full">
                  <FormLabel className="text-sm font-medium text-gray-700">Email ID</FormLabel>
                  <Input
                    type="email"
                    value={partyEmail}
                    onChange={(e) => setPartyEmail(e.target.value)}
                    placeholder="Enter Email ID"
                    className="h-10 sm:h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </FormItem>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowAddPartyModal(false)}
                  className="h-10 sm:h-12 px-6 transition-transform duration-200 hover:scale-105"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSavePartyAndNew}
                  className="h-10 sm:h-12 px-6 bg-indigo-600 hover:bg-indigo-700 transition-transform duration-200 hover:scale-105"
                >
                  Save & New
                </Button>
                <Button
                  onClick={handleAddParty}
                  className="h-10 sm:h-12 px-6 bg-indigo-600 hover:bg-indigo-700 transition-transform duration-200 hover:scale-105"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Items Section */}
        <div className="mb-8">
          {/* Desktop Table */}
          <div className="hidden md:block shadow overflow-hidden border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">#</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Item</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">HSN Code</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Qty</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Unit</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Price/Unit</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Tax</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-100 transition-all duration-200">
                    <td className="px-3 py-2 text-sm text-gray-900 flex items-center space-x-2">
                      <span>{index + 1}</span>
                      <button
                        onClick={() => handleDeleteRow(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors duration-200"
                        aria-label={`Delete item ${index + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                    <td className="px-3 py-2 text-sm">
                      <Input
                        value={item.name}
                        onChange={(e) =>
                          setItems(items.map((i) => (i.id === item.id ? { ...i, name: e.target.value } : i)))
                        }
                        className="border-0 h-10 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-3 py-2 text-sm">
                      <Input
                        value={item.hsn}
                        onChange={(e) =>
                          setItems(items.map((i) => (i.id === item.id ? { ...i, hsn: e.target.value } : i)))
                        }
                        className="border-0 h-10 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-3 py-2 text-sm">
                      <Input
                        type="number"
                        value={item.qty}
                        onChange={(e) =>
                          setItems(items.map((i) => (i.id === item.id ? { ...i, qty: Math.max(0, e.target.value) } : i))) // Ensure qty is not negative
                        }
                        className="border-0 h-10 w-16 focus:ring-indigo-500"
                        min="0" // Prevent negative values
                      />
                    </td>
                    <td className="px-3 py-2 text-sm">
                      <Select
                        value={item.unit}
                        onValueChange={(value) =>
                          setItems(items.map((i) => (i.id === item.id ? { ...i, unit: value } : i)))
                        }
                      >
                        <SelectTrigger className="border-0 h-10 focus:ring-indigo-500">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent side="top" className="z-50">
                          <SelectItem value="none">Select</SelectItem>
                          <SelectItem value="NONE">NONE</SelectItem>
                          <SelectItem value="PCS">PCS</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-3 py-2 text-sm">
                      <Input
                        type="number"
                        value={item.price}
                        onChange={(e) =>
                          setItems(items.map((i) => (i.id === item.id ? { ...i, price: Math.max(0, e.target.value) } : i))) // Ensure price is not negative
                        }
                        className="border-0 h-10 focus:ring-indigo-500"
                        min="0" // Prevent negative values
                      />
                    </td>
                    <td className="px-3 py-2 text-sm">
                      <Select
                        value={item.tax}
                        onValueChange={(value) =>
                          setItems(items.map((i) => (i.id === item.id ? { ...i, tax: value } : i)))
                        }
                      >
                        <SelectTrigger className="border-0 h-10 focus:ring-indigo-500">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent side="top" className="z-50">
                          <SelectItem value="none">Select</SelectItem>
                          <SelectItem value="NONE">NONE</SelectItem>
                          <SelectItem value="GST@18%">GST@18%</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-900">{calculateTotal(item).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="border rounded-xl p-4 bg-white shadow-md transition-all duration-300 animate-slide-in"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">Item {index + 1}</span>
                  <button
                    onClick={() => handleDeleteRow(item.id)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                    aria-label={`Delete item ${index + 1}`}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <div className="grid gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600">Item</label>
                    <Input
                      value={item.name}
                      onChange={(e) =>
                        setItems(items.map((i) => (i.id === item.id ? { ...i, name: e.target.value } : i)))
                      }
                      className="h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">HSN Code</label>
                    <Input
                      value={item.hsn}
                      onChange={(e) =>
                        setItems(items.map((i) => (i.id === item.id ? { ...i, hsn: e.target.value } : i)))
                      }
                      className="h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-medium text-gray-600">Qty</label>
                      <Input
                        type="number"
                        value={item.qty}
                        onChange={(e) =>
                          setItems(items.map((i) => (i.id === item.id ? { ...i, qty: Math.max(0, e.target.value) } : i))) // Ensure qty is not negative
                        }
                        className="h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                        min="0" // Prevent negative values
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Unit</label>
                      <Select
                        value={item.unit}
                        onValueChange={(value) =>
                          setItems(items.map((i) => (i.id === item.id ? { ...i, unit: value } : i)))
                        }
                      >
                        <SelectTrigger className="h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent side="top" className="z-50">
                          <SelectItem value="none">Select</SelectItem>
                          <SelectItem value="NONE">NONE</SelectItem>
                          <SelectItem value="PCS">PCS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Price/Unit</label>
                    <Input
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        setItems(items.map((i) => (i.id === item.id ? { ...i, price: Math.max(0, e.target.value) } : i))) // Ensure price is not negative
                        }
                      className="h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      min="0" // Prevent negative values
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Tax</label>
                    <Select
                      value={item.tax}
                      onValueChange={(value) =>
                        setItems(items.map((i) => (i.id === item.id ? { ...i, tax: value } : i)))
                      }
                    >
                      <SelectTrigger className="h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent side="top" className="z-50">
                        <SelectItem value="none">Select</SelectItem>
                        <SelectItem value="NONE">NONE</SelectItem>
                        <SelectItem value="GST@18%">GST@18%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-600">Total</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {calculateTotal(item).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Item Button */}
          <Button
            onClick={addItem}
            className="hidden md:block mt-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-6 py-2 transition-transform duration-200 hover:scale-105"
          >
            Add Item
          </Button>
          <Button
            onClick={addItem}
            className="fixed bottom-20 right-4 md:hidden bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3 shadow-lg transition-transform duration-200 hover:scale-105"
            aria-label="Add new item"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        {/* Payment and Totals */}
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
          <div className="space-y-4">
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Payment Type</FormLabel>
              <Select value={paymentType} onValueChange={setPaymentType}>
                <SelectTrigger className="w-full md:w-[200px] h-10 sm:h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                  <SelectValue placeholder="Select Payment Type" />
                </SelectTrigger>
                <SelectContent side="top" className="z-50">
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
            {paymentType === "cheque" && (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Cheque Reference</FormLabel>
                <Input
                  type="text"
                  value={chequeRef}
                  onChange={(e) => setChequeRef(e.target.value)}
                  placeholder="Enter reference number"
                  className="h-10 sm:h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </FormItem>
            )}
            <Button
              variant="outline"
              onClick={() => setShowDescription(!showDescription)}
              className="flex items-center h-10 sm:h-12 px-6 border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-transform duration-200 hover:scale-105"
            >
              <FileText className="h-4 w-4 mr-2" />
              {showDescription ? "Hide Description" : "Add Description"}
            </Button>
            {showDescription && (
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description here..."
                className="h-[120px] border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                style={{ resize: 'none' }} // Disable resize here
              />
            )}
          </div>
          <div className="space-y-4 min-w-[200px]">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Total Qty</span>
              <span className="text-sm text-gray-900">{totalQuantity}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Tax</span>
              <span className="text-sm text-gray-900">{totalTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Total</span>
              <span className="text-sm text-gray-900">{grandTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">Received</label>
              <Input
                type="number"
                value={received}
                onChange={(e) => setReceived(Math.max(0, Number(e.target.value)))} // Ensure received is not negative
                className="w-24 h-10 sm:h-12 text-right border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                min="0" // Prevent negative values
              />
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="text-sm font-semibold text-gray-800">Balance</span>
              <span className="text-sm font-semibold text-gray-800">
                {(grandTotal - received).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Bar on Mobile */}
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 flex justify-end gap-3 md:static md:p-0 md:border-0">
          <Button
            variant="outline"
            onClick={handleShare}
            className="h-10 sm:h-12 px-6 border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-transform duration-200 hover:scale-105"
          >
            Share
          </Button>
          <Button
            onClick={handleSave}
            className="h-10 sm:h-12 px-6 bg-indigo-600 hover:bg-indigo-700 text-white transition-transform duration-200 hover:scale-105"
          >
            Save
          </Button>
        </div>
      </div>

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}