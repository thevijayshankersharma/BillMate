"use client";

import React from 'react';
import { Button } from '../components/ui/button';
import { FormItem, FormLabel } from '../components/ui/form';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { X } from 'lucide-react';
import { statesMap } from '../../app/lib/constants';
import { parseGSTIN } from '../../app/lib/utils';

export default function AddPartyModal({
  isOpen,
  onClose,
  partyName,
  setPartyName,
  partyGSTIN,
  setPartyGSTIN,
  partyPhone,
  setPartyPhone,
  partyBillingAddress,
  setPartyBillingAddress,
  partyState,
  setPartyState,
  partyGSTType,
  setPartyGSTType,
  partyEmail,
  setPartyEmail,
  onSave,
  onSaveAndNew,
}) {
  if (!isOpen) return null;

  const handleGSTINChange = (e) => {
    const gstin = e.target.value;
    setPartyGSTIN(gstin);
    const { state, gstType } = parseGSTIN(gstin);
    setPartyState(state);
    setPartyGSTType(gstType);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300">
      <div className="bg-white p-6 w-full max-w-md sm:max-w-lg rounded-xl shadow-2xl md:w-full animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Add Party</h3>
          <button onClick={onClose} aria-label="Close modal">
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
              style={{ resize: "none" }}
            />
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
            onClick={onClose}
            className="h-10 sm:h-12 px-6 transition-transform duration-200 hover:scale-105"
          >
            Cancel
          </Button>
          <Button
            onClick={onSaveAndNew}
            className="h-10 sm:h-12 px-6 bg-indigo-600 hover:bg-indigo-700 transition-transform duration-200 hover:scale-105"
          >
            Save & New
          </Button>
          <Button
            onClick={onSave}
            className="h-10 sm:h-12 px-6 bg-indigo-600 hover:bg-indigo-700 transition-transform duration-200 hover:scale-105"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}