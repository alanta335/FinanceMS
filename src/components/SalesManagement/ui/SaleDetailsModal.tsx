import React from "react";
import { Sale } from "../../../types";
import { formatCurrency, formatDate } from "../../../utils/calculations";

interface SaleDetailsModalProps {
  sale: Sale;
  onClose: () => void;
}

const SaleDetailsModal: React.FC<SaleDetailsModalProps> = ({
  sale,
  onClose,
}) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Sale Details</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Date:</span>
          <span className="font-medium">{formatDate(sale.date)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Customer:</span>
          <span className="font-medium">{sale.customerName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Phone:</span>
          <span className="font-medium">{sale.customerPhone}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Product:</span>
          <span className="font-medium">
            {sale.product.brand} {sale.product.model}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Category:</span>
          <span className="font-medium">{sale.product.category}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Serial Number:</span>
          <span className="font-medium">
            {sale.product.serialNumber || "N/A"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">IMEI:</span>
          <span className="font-medium">{sale.product.imei || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Quantity:</span>
          <span className="font-medium">{sale.quantity}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Unit Price:</span>
          <span className="font-medium">{formatCurrency(sale.unitPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Total Amount:</span>
          <span className="font-medium text-lg">
            {formatCurrency(sale.totalAmount)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Payment Method:</span>
          <span className="font-medium">
            {sale.paymentMethod.toUpperCase()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Sales Person:</span>
          <span className="font-medium">{sale.salesPerson}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Commission:</span>
          <span className="font-medium">{formatCurrency(sale.commission)}</span>
        </div>
        {sale.notes && (
          <div>
            <span className="text-gray-600">Notes:</span>
            <p className="mt-1 text-sm text-gray-900">{sale.notes}</p>
          </div>
        )}
      </div>
      <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

export default SaleDetailsModal;
