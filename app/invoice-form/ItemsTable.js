"use client";

import React from 'react';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Trash2 } from 'lucide-react';
import { units, taxRates } from '../../app/lib/constants';
import { calculateTotal } from '../../app/lib/utils';

export default function ItemsTable({
  items,
  setItems,
  savedItems,
  onAddItem,
}) {
  const handleItemSelect = (value, itemId) => {
    if (value === "add") {
      onAddItem();
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
                  price: selectedItem.salePrice.toString(),
                  tax: `IGST@${selectedItem.taxRate}%`, // Fixed syntax error
                  unit: selectedItem.unit || "NONE",
                }
              : item
          )
        );
      }
    }
  };

  return (
    <div className="shadow overflow-hidden border border-gray-200 rounded-lg">
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
          {items && Array.isArray(items) ? (
            items.map((item, index) => (
              <tr key={item.id || `item-${index}`} className="hover:bg-gray-100 transition-all duration-200">
                <td className="px-3 py-2 text-sm text-gray-900 flex items-center space-x-2">
                  <span>{index + 1}</span>
                  <button
                    onClick={() => setItems(items.filter((i) => i.id !== item.id))}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                    aria-label={`Delete item ${index + 1}`}
                  >
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
                        savedItems
                          .filter(savedItem => savedItem.id) // Ensure valid IDs
                          .map((savedItem) => (
                            <SelectItem
                              key={savedItem.id}
                              value={savedItem.id.toString()}
                            >
                              {savedItem.name}
                            </SelectItem>
                          ))
                      ) : null}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-3 py-2 text-sm">
                  <Input
                    value={item.hsn}
                    onChange={(e) => setItems(items.map((i) => (i.id === item.id ? { ...i, hsn: e.target.value } : i)))}
                    className="border-0 h-10 focus:ring-indigo-500"
                  />
                </td>
                <td className="px-3 py-2 text-sm">
                  <Input
                    type="number"
                    value={item.qty}
                    onChange={(e) => setItems(items.map((i) => (i.id === item.id ? { ...i, qty: Math.max(0, e.target.value) } : i)))}
                    className="border-0 h-10 w-16 focus:ring-indigo-500"
                    min="0"
                  />
                </td>
                <td className="px-3 py-2 text-sm">
                  <Select
                    value={item.unit}
                    onValueChange={(value) => setItems(items.map((i) => (i.id === item.id ? { ...i, unit: value } : i)))}
                  >
                    <SelectTrigger className="border-0 h-10 focus:ring-indigo-500">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent side="top" className="z-50">
                      {units && Array.isArray(units) ? (
                        units.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))
                      ) : null}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-3 py-2 text-sm">
                  <Input
                    type="number"
                    value={item.price}
                    onChange={(e) => setItems(items.map((i) => (i.id === item.id ? { ...i, price: Math.max(0, e.target.value) } : i)))}
                    className="border-0 h-10 focus:ring-indigo-500"
                    min="0"
                  />
                </td>
                <td className="px-3 py-2 text-sm">
                  <Select
                    value={item.tax}
                    onValueChange={(value) => setItems(items.map((i) => (i.id === item.id ? { ...i, tax: value } : i)))}
                  >
                    <SelectTrigger className="border-0 h-10 focus:ring-indigo-500">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent side="top" className="z-50">
                      {taxRates && Array.isArray(taxRates) ? (
                        taxRates.map((tax) => (
                          <SelectItem key={tax} value={tax}>
                            {tax}
                          </SelectItem>
                        ))
                      ) : null}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-3 py-2 text-sm text-gray-900">{calculateTotal(item).toFixed(2)}</td>
              </tr>
            ))
          ) : null}
        </tbody>
      </table>
    </div>
  );
}