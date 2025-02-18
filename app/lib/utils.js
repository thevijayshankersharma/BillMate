import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(...inputs));
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Arrays defined outside to prevent re-creation on each call
const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
const teens = [
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];
const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

// Convert function defined outside to avoid re-declaration
function convert(n) {
  if (n < 10) return units[n];
  if (n < 20) return teens[n - 10];
  if (n < 100)
    return tens[Math.floor(n / 10)] + (n % 10 ? " " + units[n % 10] : "");
  if (n < 1000)
    return (
      units[Math.floor(n / 100)] +
      " Hundred" +
      (n % 100 ? " " + convert(n % 100) : "")
    );
  if (n < 100000)
    return (
      convert(Math.floor(n / 1000)) +
      " Thousand" +
      (n % 1000 ? " " + convert(n % 1000) : "")
    );
  if (n < 10000000)
    return (
      convert(Math.floor(n / 100000)) +
      " Lakh" +
      (n % 100000 ? " " + convert(n % 100000) : "")
    );
  return (
    convert(Math.floor(n / 10000000)) +
    " Crore" +
    (n % 10000000 ? " " + convert(n % 10000000) : "")
  );
}

export function numberToWords(num) {
  return convert(num);
}
