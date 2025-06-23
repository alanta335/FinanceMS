import React from "react";
import { Product } from "./types";
import {
  TagIcon,
  DevicePhoneMobileIcon,
  IdentificationIcon,
  HashtagIcon,
} from "@heroicons/react/24/outline";

interface SaleProductFieldsProps {
  product: Product;
  onChange: (field: keyof Product, value: string | number) => void;
}

const SaleProductFields: React.FC<SaleProductFieldsProps> = ({
  product,
  onChange,
}) => (
  <>
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
        {/* TagIcon for Product Name */}
        <TagIcon className="h-4 w-4 text-gray-400" /> Product Name
      </label>
      <input
        type="text"
        value={product.name}
        onChange={(e) => onChange("name", e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
        {/* TagIcon for Category (reuse TagIcon) */}
        <TagIcon className="h-4 w-4 text-gray-400" /> Category
      </label>
      <select
        value={product.category}
        onChange={(e) => onChange("category", e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Select Category</option>
        <option value="smartphone">Smartphone</option>
        <option value="laptop">Laptop</option>
        <option value="tablet">Tablet</option>
        <option value="accessories">Accessories</option>
      </select>
    </div>
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
        <DevicePhoneMobileIcon className="h-4 w-4 text-gray-400" /> Brand
      </label>
      <input
        type="text"
        value={product.brand}
        onChange={(e) => onChange("brand", e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
        <IdentificationIcon className="h-4 w-4 text-gray-400" /> Model
      </label>
      <input
        type="text"
        value={product.model}
        onChange={(e) => onChange("model", e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
        <HashtagIcon className="h-4 w-4 text-gray-400" /> Serial Number
      </label>
      <input
        type="text"
        value={product.serialNumber}
        onChange={(e) => onChange("serialNumber", e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
        {/* HashtagIcon for IMEI (if applicable) */}
        <HashtagIcon className="h-4 w-4 text-gray-400" /> IMEI (if applicable)
      </label>
      <input
        type="text"
        value={product.imei}
        onChange={(e) => onChange("imei", e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  </>
);

export default SaleProductFields;
