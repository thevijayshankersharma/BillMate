"use client";

import React from 'react';
import { Button } from '../components/ui/button';
import { FormItem, FormLabel } from '../components/ui/form';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { X } from 'lucide-react';
import { units, taxRates } from '../../app/lib/constants';
import { getTaxRate } from '@/app/lib/utils';

export default function AddItemModal({
  isOpen,
  onClose,
  newItemType,
  setNewItemType,
  newItemName,
  setNewItemName,
  newItemHSN,
  setNewItemHSN,
  newItemSalePrice,
  setNewItemSalePrice,
  newItemWholesalePrice,
  setNewItemWholesalePrice,
  newItemPurchasePrice,
  setNewItemPurchasePrice,
  newItemTaxRate,
  setNewItemTaxRate,
  newItemUnit,
  setNewItemUnit,
  showWholesalePrice,
  setShowWholesalePrice,
  onSave,
  onSaveAndNew,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300">
      <div className="bg-white p-6 w-full max-w-2xl rounded-xl shadow-2xl md:w-full animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Add Item</h3>
          <button onClick={onClose} aria-label="Close modal">
            <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
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
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">
              {newItemType === "Service" ? "Service Name *" : "Item Name *"}
            </FormLabel>
            <Input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder={`Enter ${newItemType === "Service" ? "service" : "item"} name`}
              className="h-10 sm:h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </FormItem>
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">
              {newItemType === "Service" ? "Service HSN" : "Item HSN"}
            </FormLabel>
            <Input
              type="text"
              value={newItemHSN}
              onChange={(e) => setNewItemHSN(e.target.value)}
              placeholder="Enter HSN code"
              className="h-10 sm:h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </FormItem>
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">Sale Price</FormLabel>
            <Input
              type="number"
              value={newItemSalePrice}
              onChange={(e) => setNewItemSalePrice(e.target.value)}
              placeholder="Enter sale price"
              className="h-10 sm:h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </FormItem>
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
          <FormItem className="col-span-2">
            <div className="flex items-center justify-between">
              <FormLabel className="text-sm font-medium text-gray-700">Wholesale Price</FormLabel>
              <button
                onClick={() => setShowWholesalePrice(!showWholesalePrice)}
                className="text-indigo-600 hover:text-indigo-700 text-sm"
              >
                {showWholesalePrice ? "Remove" : "Add Wholesale Price"}
              </button>
            </div>
            {showWholesalePrice && (
              <Input
                type="number"
                value={newItemWholesalePrice}
                onChange={(e) => setNewItemWholesalePrice(e.target.value)}
                placeholder="Enter wholesale price"
                className="h-10 sm:h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
            )}
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