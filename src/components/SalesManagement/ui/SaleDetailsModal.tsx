import React from "react";
import { Sale } from "../../../types";
import { formatCurrency, formatDate } from "../../../utils/calculations";
import { CalendarDaysIcon, UserIcon, DevicePhoneMobileIcon, TagIcon, HashtagIcon, QrCodeIcon, CubeIcon, CurrencyRupeeIcon, CreditCardIcon, UserGroupIcon, StarIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

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
          <span className="text-gray-600 flex items-center gap-1"><CalendarDaysIcon className="h-4 w-4 text-gray-400" /> Date:</span>
          <span className="font-medium">{formatDate(sale.date)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 flex items-center gap-1"><UserIcon className="h-4 w-4 text-gray-400" /> Customer:</span>
          <span className="font-medium">{sale.customerName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 flex items-center gap-1"><DevicePhoneMobileIcon className="h-4 w-4 text-gray-400" /> Phone:</span>
          <span className="font-medium">{sale.customerPhone}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 flex items-center gap-1"><TagIcon className="h-4 w-4 text-gray-400" /> Product:</span>
          <span className="font-medium">
            {sale.product.brand} {sale.product.model}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 flex items-center gap-1"><TagIcon className="h-4 w-4 text-gray-400" /> Category:</span>
          <span className="font-medium">{sale.product.category}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 flex items-center gap-1"><HashtagIcon className="h-4 w-4 text-gray-400" /> Serial Number:</span>
          <span className="font-medium">
            {sale.product.serialNumber || "N/A"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 flex items-center gap-1"><QrCodeIcon className="h-4 w-4 text-gray-400" /> IMEI:</span>
          <span className="font-medium">{sale.product.imei || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 flex items-center gap-1"><CubeIcon className="h-4 w-4 text-gray-400" /> Quantity:</span>
          <span className="font-medium">{sale.quantity}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 flex items-center gap-1"><CurrencyRupeeIcon className="h-4 w-4 text-gray-400" /> Unit Price:</span>
          <span className="font-medium">{formatCurrency(sale.unitPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 flex items-center gap-1"><CurrencyRupeeIcon className="h-4 w-4 text-yellow-500" /> Total Amount:</span>
          <span className="font-medium text-lg">
            {formatCurrency(sale.totalAmount)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 flex items-center gap-1"><CreditCardIcon className="h-4 w-4 text-gray-400" /> Payment Method:</span>
          <span className="font-medium">{sale.paymentMethod.toUpperCase()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 flex items-center gap-1"><UserGroupIcon className="h-4 w-4 text-gray-400" /> Sales Person:</span>
          <span className="font-medium">{sale.salesPerson}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 flex items-center gap-1"><StarIcon className="h-4 w-4 text-yellow-500" /> Commission:</span>
          <span className="font-medium">{formatCurrency(sale.commission)}</span>
        </div>
        {sale.notes && (
          <div>
            <span className="text-gray-600 flex items-center gap-1"><DocumentTextIcon className="h-4 w-4 text-gray-400" /> Notes:</span>
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
