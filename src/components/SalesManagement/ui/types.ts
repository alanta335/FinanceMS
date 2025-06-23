export interface Product {
    name: string;
    category: string;
    brand: string;
    model: string;
    serialNumber: string;
    imei: string;
    warrantyPeriod: number;
}

export interface NewSale {
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

export interface AddSaleModalProps {
    newSale: NewSale;
    setNewSale: (sale: NewSale) => void;
    onAdd: () => void;
    onCancel: () => void;
}
