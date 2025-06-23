import React from "react";
import { NewSale } from "./types";
import {
  UserIcon,
  CurrencyRupeeIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/solid";

interface SaleDetailsFieldsProps {
  newSale: NewSale;
  onChange: (field: keyof NewSale, value: string | number) => void;
}

const SaleDetailsFields: React.FC<SaleDetailsFieldsProps> = ({
  newSale,
  onChange,
}) => (
  <>
    <div>
      <label className="flex items-center text-sm font-medium text-gray-700 mb-1 gap-1">
        Quantity
        <ShoppingBagIcon className="h-4 w-4 text-gray-400" />
      </label>
      <input
        type="number"
        min="1"
        value={newSale.quantity}
        onChange={(e) => onChange("quantity", parseInt(e.target.value) || 1)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
    <div>
      <label className="flex items-center text-sm font-medium text-gray-700 mb-1 gap-1">
        Unit Price
        <CurrencyRupeeIcon className="h-4 w-4 text-gray-400" />
      </label>
      <input
        type="number"
        min="0"
        step="0.01"
        value={newSale.unitPrice}
        onChange={(e) => onChange("unitPrice", parseFloat(e.target.value) || 0)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
    <div>
      <label className="flex items-center text-sm font-medium text-gray-700 mb-1 gap-1">
        Sales Person
        <UserIcon className="h-4 w-4 text-gray-400" />
      </label>
      <input
        type="text"
        value={newSale.salesPerson}
        onChange={(e) => onChange("salesPerson", e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
    <div>
      <label className="flex items-center text-sm font-medium text-gray-700 mb-1 gap-1">
        Commission
        <CurrencyRupeeIcon className="h-4 w-4 text-yellow-500" />
      </label>
      <input
        type="number"
        min="0"
        step="0.01"
        value={newSale.commission}
        onChange={(e) =>
          onChange("commission", parseFloat(e.target.value) || 0)
        }
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
    <div className="md:col-span-2 col-span-1">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Notes
      </label>
      <textarea
        value={newSale.notes}
        onChange={(e) => onChange("notes", e.target.value)}
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  </>
);

export default SaleDetailsFields;
