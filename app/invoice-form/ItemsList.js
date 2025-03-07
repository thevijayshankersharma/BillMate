"use client";

import React from 'react';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Trash2 } from 'lucide-react';
import { units, taxRates } from '../../app/lib/constants'; // Adjust path as needed
import { calculateTotal } from '../../app/lib/utils'; // Adjust path as needed

export default function ItemsList({ items, setItems, savedItems, onAddItem }) {
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
                  tax: `IGST@${selectedItem.taxRate}%`,
                  unit: selectedItem.unit || "NONE",
                }
              : item
          )
        );
      }
    }
  };

  return (
    <div className="md:hidden space-y-4">
      {items.map((item, index) => (
        <div
          key={item.id || `item-${index}`}
          className="border rounded-xl p-4 bg-white shadow-md transition-all duration-300 animate-slide-in"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-gray-700">Item {index + 1}</span>
            <button
              onClick={() => setItems(items.filter((i) => i.id !== item.id))}
              className="text-red-500 hover:text-red-700 transition-colors duration-200"
              aria-label={`Delete item ${index + 1}`}
            >
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
                    savedItems
                      .filter((savedItem) => savedItem.id != null)
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
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">HSN Code</label>
              <Input
                value={item.hsn}
                onChange={(e) =>
                  setItems(
                    items.map((i) =>
                      i.id === item.id ? { ...i, hsn: e.target.value } : i
                    )
                  )
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
                    setItems(
                      items.map((i) =>
                        i.id === item.id
                          ? { ...i, qty: Math.max(0, e.target.value) }
                          : i
                      )
                    )
                  }
                  className="h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  min="0"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Unit</label>
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
              <Input
                type="number"
                value={item.price}
                onChange={(e) =>
                  setItems(
                    items.map((i) =>
                      i.id === item.id
                        ? { ...i, price: Math.max(0, e.target.value) }
                        : i
                    )
                  )
                }
                className="h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                min="0"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Tax</label>
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
              <span className="text-sm font-semibold text-gray-900">
                {calculateTotal(item).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}