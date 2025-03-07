"use client";

import React from 'react';
import { FormItem, FormLabel } from '../components/ui/form';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { statesMap } from '../../app/lib/constants';

export default function InvoiceDetails({
  invoiceNumber,
  setInvoiceNumber,
  invoiceDate,
  setInvoiceDate,
  selectedParty,
  setSelectedParty,
  parties,
  phone,
  setPhone,
  billingAddress,
  setBillingAddress,
  stateOfSupply,
  setStateOfSupply,
  onAddParty,
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2 mb-8">
      <div className="space-y-4">
        <FormItem>
          <FormLabel className="text-sm font-medium text-gray-700">Customer *</FormLabel>
          <Select
            value={selectedParty?.id?.toString() || ""}
            onValueChange={(value) => {
              if (value === "add") {
                onAddParty();
              } else {
                const party = parties.find((p) => p.id?.toString() === value);
                setSelectedParty(party);
                setPhone(party?.phone || "");
                setBillingAddress(party?.billingAddress || "");
              }
            }}
          >
            <SelectTrigger className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 h-10 sm:h-12">
              <SelectValue placeholder="Select Party" />
            </SelectTrigger>
            <SelectContent side="top" className="z-50">
              <SelectItem key="add-party" value="add">+ Add Party</SelectItem>
              {parties && Array.isArray(parties) ? (
                parties
                  .filter(party => party.id)
                  .map(party => (
                    <SelectItem
                      key={party.id}
                      value={party.id.toString()}
                    >
                      {party.name}
                    </SelectItem>
                  ))
              ) : null}
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
            style={{ resize: "none" }}
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
              min="0"
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
  );
}