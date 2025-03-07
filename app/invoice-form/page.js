"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InvoiceDetails from './InvoiceDetails';
import ItemsTable from './ItemsTable';
import ItemsList from './ItemsList';
import PaymentAndDescription from './PaymentAndDescription';
import AddPartyModal from './AddPartyModal';
import AddItemModal from './AddItemModal';
import { getTaxRate, calculateTotal } from '../../app/lib/utils';

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
  const [savedItems, setSavedItems] = useState([]);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newItemType, setNewItemType] = useState("Product");
  const [newItemName, setNewItemName] = useState("");
  const [newItemHSN, setNewItemHSN] = useState("");
  const [newItemSalePrice, setNewItemSalePrice] = useState("");
  const [newItemWholesalePrice, setNewItemWholesalePrice] = useState("");
  const [newItemPurchasePrice, setNewItemPurchasePrice] = useState("");
  const [newItemTaxRate, setNewItemTaxRate] = useState("NONE");
  const [newItemUnit, setNewItemUnit] = useState("NONE");
  const [showWholesalePrice, setShowWholesalePrice] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") !== "true") router.push("/login");
  }, [router]);

  useEffect(() => {
    const fetchParties = async () => {
      try {
        const res = await fetch("/api/parties");
        if (res.ok) setParties(await res.json());
      } catch (error) {
        console.error("Error fetching parties:", error);
      }
    };
    fetchParties();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("/api/items");
        if (res.ok) setSavedItems(await res.json());
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchItems();
  }, []);

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

  const handleAddItem = async () => {
    if (!newItemName.trim()) return alert("Item Name is required");
    const newItem = {
      type: newItemType,
      name: newItemName,
      hsn: newItemHSN,
      salePrice: parseFloat(newItemSalePrice) || 0,
      wholesalePrice: parseFloat(newItemWholesalePrice) || 0,
      purchasePrice: parseFloat(newItemPurchasePrice) || 0,
      taxRate: getTaxRate(newItemTaxRate) * 100,
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
        setShowAddItemModal(false);
      } else {
        alert("Error saving item");
      }
    } catch (error) {
      console.error("Error saving item:", error);
      alert("Error saving item");
    }
  };

  const handleSaveItemAndNew = async () => {
    if (!newItemName.trim()) return alert("Item Name is required");
    const newItem = {
      type: newItemType,
      name: newItemName,
      hsn: newItemHSN,
      salePrice: parseFloat(newItemSalePrice) || 0,
      wholesalePrice: parseFloat(newItemWholesalePrice) || 0,
      purchasePrice: parseFloat(newItemPurchasePrice) || 0,
      taxRate: getTaxRate(newItemTaxRate) * 100,
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
        setNewItemType("Product");
        setNewItemName("");
        setNewItemHSN("");
        setNewItemSalePrice("");
        setShowWholesalePrice(false);
        setNewItemWholesalePrice("");
        setNewItemPurchasePrice("");
        setNewItemTaxRate("NONE");
        setNewItemUnit("NONE");
      } else {
        alert("Error saving item");
      }
    } catch (error) {
      console.error("Error saving item:", error);
      alert("Error saving item");
    }
  };

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
    const totalTax = items.reduce(
      (acc, item) => acc + (parseFloat(item.price) || 0) * (parseFloat(item.qty) || 0) * getTaxRate(item.tax),
      0
    );
    const grandTotal = items.reduce((acc, item) => acc + calculateTotal(item), 0);
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
    router.push("/invoice/1");
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
        <InvoiceDetails
          invoiceNumber={invoiceNumber}
          setInvoiceNumber={setInvoiceNumber}
          invoiceDate={invoiceDate}
          setInvoiceDate={setInvoiceDate}
          selectedParty={selectedParty}
          setSelectedParty={setSelectedParty}
          parties={parties}
          phone={phone}
          setPhone={setPhone}
          billingAddress={billingAddress}
          setBillingAddress={setBillingAddress}
          stateOfSupply={stateOfSupply}
          setStateOfSupply={setStateOfSupply}
          onAddParty={() => setShowAddPartyModal(true)}
        />
        <div className="mb-8">
          <div className="hidden md:block">
            <ItemsTable
              items={items}
              setItems={setItems}
              savedItems={savedItems}
              onAddItem={() => setShowAddItemModal(true)}
            />
          </div>
          <div className="md:hidden">
            <ItemsList
              items={items}
              setItems={setItems}
              savedItems={savedItems}
              onAddItem={() => setShowAddItemModal(true)}
            />
          </div>
        </div>
        <PaymentAndDescription
          paymentType={paymentType}
          setPaymentType={setPaymentType}
          chequeRef={chequeRef}
          setChequeRef={setChequeRef}
          showDescription={showDescription}
          setShowDescription={setShowDescription}
          description={description}
          setDescription={setDescription}
          items={items}
          received={received}
          setReceived={setReceived}
          onShare={handleShare}
          onSave={handleSave}
        />
      </div>
      <AddPartyModal
        isOpen={showAddPartyModal}
        onClose={() => setShowAddPartyModal(false)}
        partyName={partyName}
        setPartyName={setPartyName}
        partyGSTIN={partyGSTIN}
        setPartyGSTIN={setPartyGSTIN}
        partyPhone={partyPhone}
        setPartyPhone={setPartyPhone}
        partyBillingAddress={partyBillingAddress}
        setPartyBillingAddress={setPartyBillingAddress}
        partyState={partyState}
        setPartyState={setPartyState}
        partyGSTType={partyGSTType}
        setPartyGSTType={setPartyGSTType}
        partyEmail={partyEmail}
        setPartyEmail={setPartyEmail}
        onSave={handleAddParty}
        onSaveAndNew={handleSavePartyAndNew}
      />
      <AddItemModal
        isOpen={showAddItemModal}
        onClose={() => setShowAddItemModal(false)}
        newItemType={newItemType}
        setNewItemType={setNewItemType}
        newItemName={newItemName}
        setNewItemName={setNewItemName}
        newItemHSN={newItemHSN}
        setNewItemHSN={setNewItemHSN}
        newItemSalePrice={newItemSalePrice}
        setNewItemSalePrice={setNewItemSalePrice}
        newItemWholesalePrice={newItemWholesalePrice}
        setNewItemWholesalePrice={setNewItemWholesalePrice}
        newItemPurchasePrice={newItemPurchasePrice}
        setNewItemPurchasePrice={setNewItemPurchasePrice}
        newItemTaxRate={newItemTaxRate}
        setNewItemTaxRate={setNewItemTaxRate}
        newItemUnit={newItemUnit}
        setNewItemUnit={setNewItemUnit}
        showWholesalePrice={showWholesalePrice}
        setShowWholesalePrice={setShowWholesalePrice}
        onSave={handleAddItem}
        onSaveAndNew={handleSaveItemAndNew}
      />
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
        .animate-slide-in { animation: slideIn 0.3s ease-in-out; }
      `}</style>
    </div>
  );
}