import React from "react";
import { NewSale } from "./types";
import { UserIcon, DevicePhoneMobileIcon, CreditCardIcon } from "@heroicons/react/24/outline";

interface SaleCustomerFieldsProps {
  newSale: NewSale;
  onChange: (field: keyof NewSale, value: string | number) => void;
}

const SaleCustomerFields: React.FC<SaleCustomerFieldsProps> = ({ newSale, onChange }) => (
  <>
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
        <UserIcon className="h-4 w-4 text-gray-400" /> Customer Name
      </label>
      <input
        type="text"
        value={newSale.customerName}
        onChange={e => onChange("customerName", e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
        <DevicePhoneMobileIcon className="h-4 w-4 text-gray-400" /> Customer Phone
      </label>
      <input
        type="tel"
        value={newSale.customerPhone}
        onChange={e => onChange("customerPhone", e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
        <CreditCardIcon className="h-4 w-4 text-gray-400" /> Payment Method
      </label>
      <select
        value={newSale.paymentMethod}
        onChange={e => onChange("paymentMethod", e.target.value as NewSale["paymentMethod"])}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="cash">Cash</option>
        <option value="card">Card</option>
        <option value="emi">EMI</option>
        <option value="upi">UPI</option>
      </select>
    </div>
  </>
);

export default SaleCustomerFields;
