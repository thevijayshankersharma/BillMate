"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { FormItem, FormLabel } from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { useRouter } from "next/navigation";
import { FileText, Trash2, X, Plus } from "lucide-react";

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

const parseGSTIN = (gstin) =>
  !gstin || gstin.length < 2
    ? { state: "", gstType: "Unregistered/Consumer" }
    : {
      state: statesMap[gstin.substring(0, 2)] || "",
      gstType: statesMap[gstin.substring(0, 2)]
        ? "Registered Business - Regular"
        : "Unregistered/Consumer",
    };

const getTaxRate = (tax) =>
({
  "GST@18%": 0.18,
  "IGST@18%": 0.18,
  "IGST@28%": 0.28,
  "IGST@12%": 0.12,
  "IGST@5%": 0.05,
  "IGST@3%": 0.03,
  "IGST@0.25%": 0.0025,
  "IGST@0%": 0,
}[tax] || 0);

export default function InvoiceForm() {
  const router = useRouter();
  const [invoiceNumber, setInvoiceNumber] = useState(1);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().substring(0, 10));
  const [customer, setCustomer] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [stateOfSupply, setStateOfSupply] = useState("none");
  const [paymentType, setPaymentType] = useState("cash");
  const [chequeRef, setChequeRef] = useState("");
  const [items, setItems] = useState([
    { id: 1, name: "", hsn: "", qty: "", unit: "NONE", price: "", tax: "NONE", total: 0 },
    { id: 2, name: "", hsn: "", qty: "", unit: "NONE", price: "", tax: "NONE", total: 0 },
  ]);
  const [showDescription, setShowDescription] = useState(false);
  const [description, setDescription] = useState("");
  const [received, setReceived] = useState(0);

  // Parties state (fetched from database)
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

  // Saved items state (fetched from database)
  const [savedItems, setSavedItems] = useState([]);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newItemType, setNewItemType] = useState("Product");
  const [newItemName, setNewItemName] = useState("");
  const [newItemHSN, setNewItemHSN] = useState("");
  const [newItemSalePrice, setNewItemSalePrice] = useState("");
  const [newItemWholesalePrice, setNewItemWholesalePrice] = useState("");
  const [newItemPurchasePrice, setNewItemPurchasePrice] = useState(""); // Removed from modal but kept in state
  const [newItemTaxRate, setNewItemTaxRate] = useState("NONE"); // Changed to "NONE" as default for Select
  const [newItemUnit, setNewItemUnit] = useState("NONE"); // Added unit for modal
  const [showWholesalePrice, setShowWholesalePrice] = useState(false); // ADDED BACK - for wholesale price toggle

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") !== "true") router.push("/login");
  }, [router]);

  // Fetch parties from your database via API
  useEffect(() => {
    const fetchParties = async () => {
      try {
        const res = await fetch("/api/parties");
        if (res.ok) {
          const data = await res.json();
          setParties(data);
        }
      } catch (error) {
        console.error("Error fetching parties:", error);
      }
    };
    fetchParties();
  }, []);

  // Fetch saved items from your database via API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("/api/items");
        if (res.ok) {
          const data = await res.json();
          setSavedItems(data);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchItems();
  }, []);

  const handleGSTINChange = (e) => {
    const gstin = e.target.value;
    setPartyGSTIN(gstin);
    const { state, gstType } = parseGSTIN(gstin);
    setPartyState(state);
    setPartyGSTType(gstType);
  };

  // Save new party to database
  const handleAddParty = async () => {
    if (!partyName.trim()) return alert("Party Name is required");
    const newParty = {
      name: partyName,
      gstin: partyGSTIN,
      phone: partyPhone,
      billingAddress: partyBillingAddress,
      state: partyState,
      gstType: partyGSTType,
      email: partyEmail,
    };
    try {
      const res = await fetch("/api/parties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newParty),
      });
      if (res.ok) {
        const savedParty = await res.json();
        setParties([...parties, savedParty]);
        setSelectedParty(savedParty);
        setPhone(savedParty.phone || "");
        setBillingAddress(savedParty.billingAddress || "");
        setShowAddPartyModal(false);
      } else {
        alert("Error saving party");
      }
    } catch (error) {
      console.error("Error saving party:", error);
      alert("Error saving party");
    }
  };

  // Save party and clear form for additional entry
  const handleSavePartyAndNew = async () => {
    if (!partyName.trim()) return alert("Party Name is required");
    const newParty = {
      name: partyName,
      gstin: partyGSTIN,
      phone: partyPhone,
      billingAddress: partyBillingAddress,
      state: partyState,
      gstType: partyGSTType,
      email: partyEmail,
    };
    try {
      const res = await fetch("/api/parties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newParty),
      });
      if (res.ok) {
        const savedParty = await res.json();
        setParties([...parties, savedParty]);
        setSelectedParty(savedParty);
        setPhone(savedParty.phone || "");
        setBillingAddress(savedParty.billingAddress || "");
        // Clear form fields
        setPartyName("");
        setPartyGSTIN("");
        setPartyPhone("");
        setPartyBillingAddress("");
        setPartyState("");
        setPartyGSTType("");
        setPartyEmail("");
      } else {
        alert("Error saving party");
      }
    } catch (error) {
      console.error("Error saving party:", error);
      alert("Error saving party");
    }
  };

  // Save new item to database and add to invoice items list
  const handleAddItem = async () => {
    if (!newItemName.trim()) return alert("Item Name is required");
    const newItem = {
      type: newItemType,
      name: newItemName,
      hsn: newItemHSN,
      salePrice: parseFloat(newItemSalePrice) || 0,
      wholesalePrice: parseFloat(newItemWholesalePrice) || 0,
      purchasePrice: parseFloat(newItemPurchasePrice) || 0, // Still sending to API
      taxRate: getTaxRate(newItemTaxRate) * 100, // Storing taxRate as percentage in DB if needed
      unit: newItemUnit,
    };
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      if (res.ok) {
        const savedItem = await res.json();
        setSavedItems([...savedItems, savedItem]);
        // Optionally add it as a new row in the invoice items list:
        const invoiceItem = {
          id: items.length + 1,
          name: newItemName,
          hsn: newItemHSN,
          qty: "",
          unit: newItemUnit,
          price: newItemSalePrice,
          tax: newItemTaxRate,
          total: 0,
        };
        setItems([...items, invoiceItem]);
        setShowAddItemModal(false);
      } else {
        alert("Error saving item");
      }
    } catch (error) {
      console.error("Error saving item:", error);
      alert("Error saving item");
    }
  };

  // Save new item and clear form for additional entry
  const handleSaveItemAndNew = async () => {
    if (!newItemName.trim()) return alert("Item Name is required");
    const newItem = {
      type: newItemType,
      name: newItemName,
      hsn: newItemHSN,
      salePrice: parseFloat(newItemSalePrice) || 0,
      wholesalePrice: parseFloat(newItemWholesalePrice) || 0,
      purchasePrice: parseFloat(newItemPurchasePrice) || 0, // Still sending to API
      taxRate: getTaxRate(newItemTaxRate) * 100, // Storing taxRate as percentage in DB if needed
      unit: newItemUnit,
    };
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      if (res.ok) {
        const savedItem = await res.json();
        setSavedItems([...savedItems, savedItem]);
        const invoiceItem = {
          id: items.length + 1,
          name: newItemName,
          hsn: newItemHSN,
          qty: "",
          unit: newItemUnit,
          price: newItemSalePrice,
          tax: newItemTaxRate,
          total: 0,
        };
        setItems([...items, invoiceItem]);
        // Clear new item form fields for next entry
        setNewItemType("Product");
        setNewItemName("");
        setNewItemHSN("");
        setNewItemSalePrice("");
        setShowWholesalePrice(false);
        setNewItemWholesalePrice("");
        setNewItemPurchasePrice("");
        setNewItemTaxRate("NONE"); // Reset to "NONE"
        setNewItemUnit("NONE"); // Reset Unit
      } else {
        alert("Error saving item");
      }
    } catch (error) {
      console.error("Error saving item:", error);
      alert("Error saving item");
    }
  };

  const calculateTotal = (item) => {
    const price = parseFloat(item.price) || 0;
    const qty = parseFloat(item.qty) || 0;
    return price * qty * (1 + getTaxRate(item.tax));
  };

  const totalTax = items.reduce(
    (acc, item) => acc + (parseFloat(item.price) || 0) * (parseFloat(item.qty) || 0) * getTaxRate(item.tax),
    0
  );
  const grandTotal = items.reduce((acc, item) => acc + calculateTotal(item), 0);
  const units = [
    "NONE",
    "BAGS (BAG)",
    "BOTTLES (BTL)",
    "BOX (BOX)",
    "BUNDLES (BDL)",
    "CANS (CAN)",
    "CARTONS (CTN)",
    "DOZENS (DZN)",
    "GRAMMES (GM)",
    "KILOGRAMS (KG)",
    "LITRE (LTR)",
    "METERS (MTR)",
    "MILILITRE (ML)",
    "NUMBERS (NOS)",
    "PACKS (PAC)",
    "PAIRS (PRS)",
    "PIECES (PCS)",
    "QUINTAL (QTL)",
    "ROLLS (ROL)",
    "SQUARE FEET (SQF)",
    "SQUARE METERS (SQM)",
    "TABLETS (TBS)",
  ];
  const taxRates = [
    "NONE",
    "IGST@0%",
    "IGST@0.25%",
    "IGST@3%",
    "IGST@5%",
    "IGST@12%",
    "IGST@18%",
    "GST@18%",
    "IGST@28%",
    "EXEMPT",
  ];

  const handleSave = () => {
    alert("Invoice saved!");
    setInvoiceNumber(invoiceNumber + 1);
    setCustomer("");
    setBillingAddress("");
    setPhone("");
    setStateOfSupply("none");
    setPaymentType("cash");
    setChequeRef("");
    setItems([
      { id: 1, name: "", hsn: "", qty: "", unit: "NONE", price: "", tax: "NONE", total: 0 },
      { id: 2, name: "", hsn: "", qty: "", unit: "NONE", price: "", tax: "NONE", total: 0 },
    ]);
    setInvoiceDate(new Date().toISOString().substring(0, 10));
    setShowDescription(false);
    setDescription("");
    setSelectedParty(null);
    setReceived(0);
  };

  const handleShare = () => {
    const baseTotal = items.reduce((acc, item) => acc + ((parseFloat(item.price) || 0) * (parseFloat(item.qty) || 0)), 0);
    const isIntraState = stateOfSupply.trim().toLowerCase() === "gujarat";
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
        ...(isIntraState ? { sgst: totalTax / 2, cgst: totalTax / 2 } : { igst: totalTax }),
        total: grandTotal,
        received,
        balance: grandTotal - received,
      },
      description,
      stateOfSupply,
      paymentType,
      chequeRef,
    };
    // You might send invoiceData to an API endpoint or share it as needed.
    router.push("/invoice/1");
  };

  const handleItemSelect = (value, itemId) => {
    if (value === "add") {
      setShowAddItemModal(true);
    } else {
      const selectedItem = savedItems.find((item) => item.id?.toString() === value);
      if (selectedItem) {
        setItems(
          items.map((item) =>
            item.id === itemId
              ? {
                ...item,
                name: selectedItem.name,
                hsn: selectedItem.hsn,
                price: selectedItem.salePrice.toString(), // or wholesalePrice based on logic
                tax: `IGST@${selectedItem.taxRate}%`, // Assuming taxRate is stored as percentage
                unit: selectedItem.unit || "NONE", // Set unit if available in saved item
              }
              : item
          )
        );
      }
    }
  };


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
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">Create Sale Invoice</h1>
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <div className="space-y-4">
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Customer *</FormLabel>
              <Select
                value={selectedParty?.id?.toString() || ""}
                onValueChange={(value) =>
                  value === "add"
                    ? setShowAddPartyModal(true)
                    : setSelectedParty(parties.find((p) => p.id?.toString() === value)) ||
                    setPhone(parties.find((p) => p.id?.toString() === value)?.phone || "") ||
                    setBillingAddress(parties.find((p) => p.id?.toString() === value)?.billingAddress || "")
                }
              >
                <SelectTrigger className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 h-10 sm:h-12">
                  <SelectValue placeholder="Select Party" />
                </SelectTrigger>
                <SelectContent side="top" className="z-50">
                  <SelectItem key="add-party" value="add">+ Add Party</SelectItem>
                  {parties && Array.isArray(parties) ? (
                    parties.map((party) => (
                      <SelectItem key={party.id} value={party.id?.toString()}>
                        {party.name}
                      </SelectItem>
                    ))
                  ) : null}
                </SelectContent>
              </Select>
            </FormItem>
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Phone Number</FormLabel>
              <Input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone number" className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 h-10 sm:h-12" />
            </FormItem>
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Billing Address</FormLabel>
              <Textarea value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} placeholder="Enter billing address" className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 h-[120px]" style={{ resize: "none" }} />
            </FormItem>
          </div>
          <div className="space-y-4">
            <div className="flex gap-4">
              <FormItem className="flex-1">
                <FormLabel className="text-sm font-medium text-gray-700">Invoice Number</FormLabel>
                <Input type="number" value={invoiceNumber} onChange={(e) => setInvoiceNumber(Number(e.target.value))} className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 h-10 sm:h-12" min="0" />
              </FormItem>
              <FormItem className="flex-1">
                <FormLabel className="text-sm font-medium text-gray-700">Invoice Date</FormLabel>
                <Input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 h-10 sm:h-12" />
              </FormItem>
            </div>
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">State of Supply</FormLabel>
              <Select value={stateOfSupply} onValueChange={setStateOfSupply}>
                <SelectTrigger className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 h-10 sm:h-12">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent side="top" className="z-50">
                  <SelectItem key="none" value="none">None</SelectItem>
                  {Object.entries(statesMap).map(([code, state]) => (
                    <SelectItem key={code} value={state}>
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
                <button onClick={() => setShowAddPartyModal(false)} aria-label="Close modal">
                  <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormItem className="col-span-full">
                  <FormLabel className="text-sm font-medium text-gray-700">Party Name *</FormLabel>
                  <Input type="text" value={partyName} onChange={(e) => setPartyName(e.target.value)} placeholder="Enter party name" className="h-10 sm:h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" />
                </FormItem>
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">GSTIN</FormLabel>
                  <Input type="text" value={partyGSTIN} onChange={handleGSTINChange} placeholder="Enter GSTIN" className="h-10 sm:h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" />
                </FormItem>
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Phone Number</FormLabel>
                  <Input type="text" value={partyPhone} onChange={(e) => setPartyPhone(e.target.value)} placeholder="Enter phone number" className="h-10 sm:h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" />
                </FormItem>
                <FormItem className="col-span-full">
                  <FormLabel className="text-sm font-medium text-gray-700">Billing Address</FormLabel>
                  <Textarea value={partyBillingAddress} onChange={(e) => setPartyBillingAddress(e.target.value)} placeholder="Enter billing address" className="h-[120px] border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" style={{ resize: "none" }} />
                </FormItem>
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">State</FormLabel>
                  <Select value={partyState} onValueChange={setPartyState}>
                    <SelectTrigger className="h-10 sm:h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent side="top" className="z-50">
                      {Object.entries(statesMap).map(([code, state]) => (
                        <SelectItem key={code} value={state}>
                          {state}
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
                      <SelectItem key="unregistered" value="Unregistered/Consumer">Unregistered/Consumer</SelectItem>
                      <SelectItem key="regular" value="Registered Business - Regular">Registered Business - Regular</SelectItem>
                      <SelectItem key="composition" value="Registered Business - Composition">Registered Business - Composition</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
                <FormItem className="col-span-full">
                  <FormLabel className="text-sm font-medium text-gray-700">Email ID</FormLabel>
                  <Input type="email" value={partyEmail} onChange={(e) => setPartyEmail(e.target.value)} placeholder="Enter Email ID" className="h-10 sm:h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" />
                </FormItem>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setShowAddPartyModal(false)} className="h-10 sm:h-12 px-6 transition-transform duration-200 hover:scale-105">
                  Cancel
                </Button>
                <Button onClick={handleSavePartyAndNew} className="h-10 sm:h-12 px-6 bg-indigo-600 hover:bg-indigo-700 transition-transform duration-200 hover:scale-105">
                  Save & New
                </Button>
                <Button onClick={handleAddParty} className="h-10 sm:h-12 px-6 bg-indigo-600 hover:bg-indigo-700 transition-transform duration-200 hover:scale-105">
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Add Item Modal - Horizontal Form */}
        {showAddItemModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300">
            <div className="bg-white p-6 w-full max-w-2xl rounded-xl shadow-2xl md:w-full animate-fade-in"> {/* Increased max-w for horizontal layout */}
              <div className="flex justify-between items-center mb-6"> {/* Increased margin-bottom */}
                <h3 className="text-xl font-bold text-gray-800">Add Item</h3>
                <button onClick={() => setShowAddItemModal(false)} aria-label="Close modal">
                  <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4"> {/* 2 Columns, horizontal gap, vertical gap */}
                {/* Item Type */}
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Type</FormLabel>
                  <Select value={newItemType} onValueChange={setNewItemType}>
                    <SelectTrigger className="h-10 sm:h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent side="top" className="z-50">
                      <SelectItem key="product" value="Product">Product</SelectItem>
                      <SelectItem key="service" value="Service">Service</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
                {/* Item Name / Service Name */}
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    {newItemType === "Service" ? "Service Name *" : "Item Name *"}
                  </FormLabel>
                  <Input type="text" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} placeholder={`Enter ${newItemType === "Service" ? "service" : "item"} name`} className="h-10 sm:h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" />
                </FormItem>
                {/* Item HSN / Service HSN */}
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    {newItemType === "Service" ? "Service HSN" : "Item HSN"}
                  </FormLabel>
                  <Input type="text" value={newItemHSN} onChange={(e) => setNewItemHSN(e.target.value)} placeholder="Enter HSN code" className="h-10 sm:h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" />
                </FormItem>
                {/* Sale Price */}
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Sale Price</FormLabel>
                  <Input type="number" value={newItemSalePrice} onChange={(e) => setNewItemSalePrice(e.target.value)} placeholder="Enter sale price" className="h-10 sm:h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" />
                </FormItem>
                {/* Unit */}
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Unit</FormLabel>
                  <Select value={newItemUnit} onValueChange={setNewItemUnit}>
                    <SelectTrigger className="h-10 sm:h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                      <SelectValue placeholder="Select Unit" />
                    </SelectTrigger>
                    <SelectContent side="top" className="z-50">
                      {units.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
                {/* Tax Rate */}
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Tax Rate</FormLabel>
                  <Select value={newItemTaxRate} onValueChange={setNewItemTaxRate}>
                    <SelectTrigger className="h-10 sm:h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                      <SelectValue placeholder="Select Tax Rate" />
                    </SelectTrigger>
                    <SelectContent side="top" className="z-50">
                      {taxRates.map((tax) => (
                        <SelectItem key={tax} value={tax}>
                          {tax}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
                {/* Wholesale Price */}
                <FormItem className="col-span-2"> {/* span 2 columns */}
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-sm font-medium text-gray-700">Wholesale Price</FormLabel>
                    <button onClick={() => setShowWholesalePrice(!showWholesalePrice)} className="text-indigo-600 hover:text-indigo-700 text-sm">
                      {showWholesalePrice ? "Remove" : "Add Wholesale Price"}
                    </button>
                  </div>
                  {showWholesalePrice && (
                    <Input type="number" value={newItemWholesalePrice} onChange={(e) => setNewItemWholesalePrice(e.target.value)} placeholder="Enter wholesale price" className="h-10 sm:h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" />
                  )}
                </FormItem>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setShowAddItemModal(false)} className="h-10 sm:h-12 px-6 transition-transform duration-200 hover:scale-105">
                  Cancel
                </Button>
                <Button onClick={handleSaveItemAndNew} className="h-10 sm:h-12 px-6 bg-indigo-600 hover:bg-indigo-700 transition-transform duration-200 hover:scale-105">
                  Save & New
                </Button>
                <Button onClick={handleAddItem} className="h-10 sm:h-12 px-6 bg-indigo-600 hover:bg-indigo-700 transition-transform duration-200 hover:scale-105">
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
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
                      <button onClick={() => setItems(items.filter((i) => i.id !== item.id))} className="text-red-500 hover:text-red-700 transition-colors duration-200" aria-label={`Delete item ${index + 1}`}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                    <td className="px-3 py-2 text-sm">
                      <Select
                        value={item.name}
                        onValueChange={(value) => handleItemSelect(value, item.id)}
                      >
                        <SelectTrigger className="border-0 h-10 focus:ring-indigo-500 w-full">
                          <SelectValue placeholder="Select Item" />
                        </SelectTrigger>
                        <SelectContent side="top" className="z-50">
                          <SelectItem key="add-item" value="add">+ Add Item</SelectItem>
                          {savedItems && Array.isArray(savedItems) ? (
                            savedItems.map((savedItem) => (
                              <SelectItem key={savedItem.id} value={savedItem.id?.toString()}>
                                {savedItem.name}
                              </SelectItem>
                            ))
                          ) : null}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-3 py-2 text-sm">
                      <Input value={item.hsn} onChange={(e) => setItems(items.map((i) => (i.id === item.id ? { ...i, hsn: e.target.value } : i)))} className="border-0 h-10 focus:ring-indigo-500" />
                    </td>
                    <td className="px-3 py-2 text-sm">
                      <Input type="number" value={item.qty} onChange={(e) => setItems(items.map((i) => (i.id === item.id ? { ...i, qty: Math.max(0, e.target.value) } : i)))} className="border-0 h-10 w-16 focus:ring-indigo-500" min="0" />
                    </td>
                    <td className="px-3 py-2 text-sm">
                      <Select value={item.unit} onValueChange={(value) => setItems(items.map((i) => (i.id === item.id ? { ...i, unit: value } : i)))}>
                        <SelectTrigger className="border-0 h-10 focus:ring-indigo-500">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent side="top" className="z-50">
                          {units.map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-3 py-2 text-sm">
                      <Input type="number" value={item.price} onChange={(e) => setItems(items.map((i) => (i.id === item.id ? { ...i, price: Math.max(0, e.target.value) } : i)))} className="border-0 h-10 focus:ring-indigo-500" min="0" />
                    </td>
                    <td className="px-3 py-2 text-sm">
                      <Select value={item.tax} onValueChange={(value) => setItems(items.map((i) => (i.id === item.id ? { ...i, tax: value } : i)))}>
                        <SelectTrigger className="border-0 h-10 focus:ring-indigo-500">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent side="top" className="z-50">
                          {taxRates.map((tax) => (
                            <SelectItem key={tax} value={tax}>
                              {tax}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-900">{calculateTotal(item).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:hidden space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="border rounded-xl p-4 bg-white shadow-md transition-all duration-300 animate-slide-in">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">Item {index + 1}</span>
                  <button onClick={() => setItems(items.filter((i) => i.id !== item.id))} className="text-red-500 hover:text-red-700 transition-colors duration-200" aria-label={`Delete item ${index + 1}`}>
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <div className="grid gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600">Item</label>
                    <Select
                      value={item.name}
                      onValueChange={(value) => handleItemSelect(value, item.id)}
                    >
                      <SelectTrigger className="h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 w-full">
                        <SelectValue placeholder="Select Item" />
                      </SelectTrigger>
                      <SelectContent side="top" className="z-50">
                        <SelectItem key="add-item" value="add">+ Add Item</SelectItem>
                        {savedItems && Array.isArray(savedItems) ? (
                          savedItems.map((savedItem) => (
                            <SelectItem key={savedItem.id} value={savedItem.id?.toString()}>
                              {savedItem.name}
                            </SelectItem>
                          ))
                        ) : null}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">HSN Code</label>
                    <Input value={item.hsn} onChange={(e) => setItems(items.map((i) => (i.id === item.id ? { ...i, hsn: e.target.value } : i)))} className="h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-medium text-gray-600">Qty</label>
                      <Input type="number" value={item.qty} onChange={(e) => setItems(items.map((i) => (i.id === item.id ? { ...i, qty: Math.max(0, e.target.value) } : i)))} className="h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" min="0" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Unit</label>
                      <Select value={item.unit} onValueChange={(value) => setItems(items.map((i) => (i.id === item.id ? { ...i, unit: value } : i)))}>
                        <SelectTrigger className="h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent side="top" className="z-50">
                          {units.map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Price/Unit</label>
                    <Input type="number" value={item.price} onChange={(e) => setItems(items.map((i) => (i.id === item.id ? { ...i, price: Math.max(0, e.target.value) } : i)))} className="h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" min="0" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Tax</label>
                    <Select value={item.tax} onValueChange={(value) => setItems(items.map((i) => (i.id === item.id ? { ...i, tax: value } : i)))}>
                      <SelectTrigger className="h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent side="top" className="z-50">
                        {taxRates.map((tax) => (
                          <SelectItem key={tax} value={tax}>
                            {tax}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-600">Total</span>
                    <span className="text-sm font-semibold text-gray-900">{calculateTotal(item).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
          <div className="space-y-4">
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Payment Type</FormLabel>
              <Select value={paymentType} onValueChange={setPaymentType}>
                <SelectTrigger className="w-full md:w-[200px] h-10 sm:h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                  <SelectValue placeholder="Select Payment Type" />
                </SelectTrigger>
                <SelectContent side="top" className="z-50">
                  <SelectItem key="cash" value="cash">Cash</SelectItem>
                  <SelectItem key="cheque" value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
            {paymentType === "cheque" && (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Cheque Reference</FormLabel>
                <Input type="text" value={chequeRef} onChange={(e) => setChequeRef(e.target.value)} placeholder="Enter reference number" className="h-10 sm:h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" />
              </FormItem>
            )}
            <Button variant="outline" onClick={() => setShowDescription(!showDescription)} className="flex items-center h-10 sm:h-12 px-6 border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-transform duration-200 hover:scale-105">
              <FileText className="h-4 w-4 mr-2" />
              {showDescription ? "Hide Description" : "Add Description"}
            </Button>
            {showDescription && (
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description here..." className="h-[120px] border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" style={{ resize: "none" }} />
            )}
          </div>
          <div className="space-y-4 min-w-[200px]">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Total Qty</span>
              <span className="text-sm text-gray-900">{items.reduce((acc, item) => acc + (parseFloat(item.qty) || 0), 0)}</span>
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
              <Input type="number" value={received} onChange={(e) => setReceived(Math.max(0, Number(e.target.value)))} className="w-24 h-10 sm:h-12 text-right border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" min="0" />
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="text-sm font-semibold text-gray-800">Balance</span>
              <span className="text-sm font-semibold text-gray-800">{(grandTotal - received).toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 flex justify-end gap-3 md:static md:p-0 md:border-0">
          <Button variant="outline" onClick={handleShare} className="h-10 sm:h-12 px-6 border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-transform duration-200 hover:scale-105">
            Share
          </Button>
          <Button onClick={handleSave} className="h-10 sm:h-12 px-6 bg-indigo-600 hover:bg-indigo-700 text-white transition-transform duration-200 hover:scale-105">
            Save
          </Button>
        </div>
      </div>
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