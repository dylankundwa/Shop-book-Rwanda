export type Category = 'General' | 'Beverages' | 'Food' | 'Household' | 'Personal Care' | 'Airtime & Services';

export interface Product {
  id: string;
  name: string;
  category: Category;
  buyingPrice: number; // in RWF
  sellingPrice: number; // in RWF
  stock: number;
  reorderLevel: number;
  unit: string; // e.g. "pcs", "kg", "bottle", "packet"
  barcode?: string;
}

export type TransactionType = 'sale_cash' | 'sale_momo' | 'sale_credit' | 'expense' | 'restock' | 'payment_received';

export type ExpenseCategory = 'Rent' | 'Transport' | 'Salaries' | 'Utilities' | 'Stock Purchase' | 'Other';

export interface Transaction {
  id: string;
  date: string; // ISO string or YYYY-MM-DD HH:mm
  type: TransactionType;
  amount: number; // RWF
  description: string;
  category?: ExpenseCategory | Category;
  customerId?: string;
  customerName?: string;
  items?: { productId: string; name: string; quantity: number; price: number }[];
  paymentMethod?: 'Cash' | 'MoMo' | 'Credit';
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  notes: string;
  balance: number; // positive = owes money (credit debt)
  creditLimit: number;
  lastActiveDate: string;
}

export interface ShopSettings {
  shopName: string;
  ownerName: string;
  phone: string;
  address: string;
  currency: string;
  lowStockThreshold: number;
  language: 'en' | 'rw';
  theme: 'light' | 'dark' | 'system';
  receiptFooter: string;
}

export interface HelpArticle {
  id: string;
  question: { en: string; rw: string };
  answer: { en: string; rw: string };
  category: string;
}
