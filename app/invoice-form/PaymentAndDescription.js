"use client";

import React from 'react';
import { Button } from '../components/ui/button';
import { FormItem, FormLabel } from '../components/ui/form';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { FileText } from 'lucide-react';
import { getTaxRate, calculateTotal } from '../../app/lib/utils';

export default function PaymentAndDescription({
  paymentType,
  setPaymentType,
  chequeRef,
  setChequeRef,
  showDescription,
  setShowDescription,
  description,
  setDescription,
  items,
  received,
  setReceived,
  onShare,
  onSave,
}) {
  const totalTax = items.reduce(
    (acc, item) => acc + (parseFloat(item.price) || 0) * (parseFloat(item.qty) || 0) * getTaxRate(item.tax),
    0
  );
  const grandTotal = items.reduce((acc, item) => acc + calculateTotal(item), 0);
  const totalQty = items.reduce((acc, item) => acc + (parseFloat(item.qty) || 0), 0);

  return (
    <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
      {/* Left Section: Payment Type and Description */}
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
            style={{ resize: "none" }}
          />
        )}
      </div>

      {/* Right Section: Summary and Buttons */}
      <div className="flex flex-col gap-6">
        {/* Summary Section */}
        <div className="space-y-4 min-w-[200px]">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Total Qty</span>
            <span className="text-sm text-gray-900">{totalQty}</span>
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
              onChange={(e) => setReceived(Math.max(0, Number(e.target.value)))}
              className="w-24 h-10 sm:h-12 text-right border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              min="0"
            />
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <span className="text-sm font-semibold text-gray-800">Balance</span>
            <span className="text-sm font-semibold text-gray-800">{(grandTotal - received).toFixed(2)}</span>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onShare}
            className="h-10 sm:h-12 px-6 border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-transform duration-200 hover:scale-105"
          >
            Share
          </Button>
          <Button
            onClick={onSave}
            className="h-10 sm:h-12 px-6 bg-indigo-600 hover:bg-indigo-700 text-white transition-transform duration-200 hover:scale-105"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}