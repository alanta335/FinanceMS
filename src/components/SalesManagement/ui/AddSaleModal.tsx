import React, { useCallback } from "react";
import { AddSaleModalProps, Product } from "./types";
import SaleProductFields from "./SaleProductFields";
import SaleCustomerFields from "./SaleCustomerFields";
import SaleDetailsFields from "./SaleDetailsFields";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

const AddSaleModal: React.FC<AddSaleModalProps> = ({
  newSale,
  setNewSale,
  onAdd,
  onCancel,
}) => {
  // Generic handler for product fields
  const handleProductChange = useCallback(
    (field: keyof Product, value: string | number) => {
      setNewSale({
        ...newSale,
        product: { ...newSale.product, [field]: value },
      });
    },
    [newSale, setNewSale]
  );

  // Generic handler for sale fields
  const handleSaleChange = useCallback(
    (field: keyof typeof newSale, value: string | number) => {
      setNewSale({ ...newSale, [field]: value });
    },
    [newSale, setNewSale]
  );

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <PlusCircleIcon className="h-6 w-6 text-blue-500" />
          Add New Sale
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SaleProductFields
            product={newSale.product}
            onChange={handleProductChange}
          />
          <SaleCustomerFields newSale={newSale} onChange={handleSaleChange} />
          <SaleDetailsFields newSale={newSale} onChange={handleSaleChange} />
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
};

export default AddSaleModal;
