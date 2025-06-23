import React from "react";

interface Product {
  name: string;
  category: string;
  brand: string;
  model: string;
  serialNumber: string;
  imei: string;
  warrantyPeriod: number;
}

interface NewSale {
  product: Product;
  quantity: number;
  unitPrice: number;
  paymentMethod: "cash" | "card" | "emi" | "upi";
  customerName: string;
  customerPhone: string;
  salesPerson: string;
  commission: number;
  notes: string;
}

interface AddSaleModalProps {
  newSale: NewSale;
  setNewSale: (sale: NewSale) => void;
  onAdd: () => void;
  onCancel: () => void;
}

const AddSaleModal: React.FC<AddSaleModalProps> = ({
  newSale,
  setNewSale,
  onAdd,
  onCancel,
}) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Sale</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name
          </label>
          <input
            type="text"
            value={newSale.product.name}
            onChange={(e) =>
              setNewSale({
                ...newSale,
                product: { ...newSale.product, name: e.target.value },
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={newSale.product.category}
            onChange={(e) =>
              setNewSale({
                ...newSale,
                product: { ...newSale.product, category: e.target.value },
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Category</option>
            <option value="smartphone">Smartphone</option>
            <option value="laptop">Laptop</option>
            <option value="tablet">Tablet</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>
        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Brand
          </label>
          <input
            type="text"
            value={newSale.product.brand}
            onChange={(e) =>
              setNewSale({
                ...newSale,
                product: { ...newSale.product, brand: e.target.value },
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {/* Model */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Model
          </label>
          <input
            type="text"
            value={newSale.product.model}
            onChange={(e) =>
              setNewSale({
                ...newSale,
                product: { ...newSale.product, model: e.target.value },
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {/* Serial Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Serial Number
          </label>
          <input
            type="text"
            value={newSale.product.serialNumber}
            onChange={(e) =>
              setNewSale({
                ...newSale,
                product: { ...newSale.product, serialNumber: e.target.value },
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {/* IMEI */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            IMEI (if applicable)
          </label>
          <input
            type="text"
            value={newSale.product.imei}
            onChange={(e) =>
              setNewSale({
                ...newSale,
                product: { ...newSale.product, imei: e.target.value },
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <input
            type="number"
            min="1"
            value={newSale.quantity}
            onChange={(e) =>
              setNewSale({ ...newSale, quantity: parseInt(e.target.value) })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {/* Unit Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Unit Price
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={newSale.unitPrice}
            onChange={(e) =>
              setNewSale({ ...newSale, unitPrice: parseFloat(e.target.value) })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {/* Customer Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer Name
          </label>
          <input
            type="text"
            value={newSale.customerName}
            onChange={(e) =>
              setNewSale({ ...newSale, customerName: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {/* Customer Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer Phone
          </label>
          <input
            type="tel"
            value={newSale.customerPhone}
            onChange={(e) =>
              setNewSale({ ...newSale, customerPhone: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Method
          </label>
          <select
            value={newSale.paymentMethod}
            onChange={(e) =>
              setNewSale({ ...newSale, paymentMethod: e.target.value as "cash" | "card" | "emi" | "upi" })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="emi">EMI</option>
            <option value="upi">UPI</option>
          </select>
        </div>
        {/* Sales Person */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sales Person
          </label>
          <input
            type="text"
            value={newSale.salesPerson}
            onChange={(e) =>
              setNewSale({ ...newSale, salesPerson: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {/* Commission */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Commission
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={newSale.commission}
            onChange={(e) =>
              setNewSale({ ...newSale, commission: parseFloat(e.target.value) })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="text-xs text-gray-400">
            Default is 5% of total, but you can edit.
          </span>
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          value={newSale.notes}
          onChange={(e) => setNewSale({ ...newSale, notes: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
        <div className="text-lg font-semibold text-gray-900">
          Total:{" "}
          {(newSale.quantity * newSale.unitPrice).toLocaleString(undefined, {
            style: "currency",
            currency: "INR",
          })}
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Sale
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default AddSaleModal;
