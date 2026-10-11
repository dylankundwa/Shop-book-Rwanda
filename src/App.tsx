/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Package, 
  Users, 
  ShoppingCart, 
  Settings as SettingsIcon, 
  HelpCircle,
  Store,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Minus,
  Trash2,
  Search,
  Check,
  Printer,
  Smartphone,
  Banknote,
  CreditCard,
  Phone,
  MessageSquare,
  Globe,
  Download,
  RotateCcw,
  Save,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  BookOpen,
  ChevronDown,
  ChevronUp,
  X,
  MoreVertical,
  Edit,
  RotateCcw as RefundIcon,
  Sun,
  Moon,
  LogOut,
  User,
  Lock
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

// --- TYPES ---
export type Category = 'General' | 'Beverages' | 'Food' | 'Household' | 'Personal Care' | 'Airtime & Services';

export interface Product {
  id: string;
  name: string;
  category: Category;
  buyingPrice: number;
  sellingPrice: number;
  stock: number;
  reorderLevel: number;
  unit: string;
}

export type TransactionType = 'sale_cash' | 'sale_momo' | 'sale_credit' | 'expense' | 'restock' | 'payment_received' | 'refund' | 'income';
export type ExpenseCategory = 'Rent' | 'Transport' | 'Salaries' | 'Utilities' | 'Stock Purchase' | 'Other';
export type IncomeCategory = 'Sales' | 'Service Fee' | 'Loan Received' | 'Other Income';

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  amount: number;
  description: string;
  category?: ExpenseCategory | IncomeCategory | Category;
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
  balance: number;
  creditLimit: number;
  lastActiveDate: string;
}

export interface ShopSettings {
  shopName: string;
  ownerName: string;
  phone: string;
  address: string;
  currency: 'RWF' | 'USD';
  exchangeRate: number;
  lowStockThreshold: number;
  theme: 'light' | 'dark';
  receiptFooter: string;
}

export interface HelpArticle {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// --- TRANSLATIONS ---
const translations = {
  appName: "ShopBook Rwanda",
  dashboard: "Dashboard",
  cashFlow: "Cash Flow",
  inventory: "Inventory",
  creditMenu: "Credit Book",
  pos: "Sales (POS)",
  settings: "Settings",
  help: "Help Center",
  todaySales: "Today's Sales",
  weekSales: "This Week's Sales",
  outstandingCredit: "Outstanding Credit",
  lowStockItems: "Low Stock Items",
  salesTrend: "30-Day Sales Trend",
  recentTransactions: "Recent Transactions",
  lowStockAlert: "Low Stock Alerts",
  stockStatus: "Status",
  inStock: "In Stock",
  lowStock: "Low Stock",
  outOfStock: "Out of Stock",
  totalIn: "Total Income",
  totalOut: "Total Expenses",
  netBalance: "Net Balance",
  incomeVsExpenses: "Income vs Expenses (Monthly)",
  addProduct: "Add New Product",
  editProduct: "Edit Product",
  searchProducts: "Search products...",
  category: "Category",
  buyingPrice: "Buying Price",
  sellingPrice: "Selling Price",
  stockQty: "Stock Quantity",
  reorderLevel: "Reorder Level",
  unit: "Unit",
  actions: "Actions",
  inventoryValue: "Total Inventory Value",
  atCost: "At Cost",
  atRetail: "At Retail",
  restock: "Restock",
  recordSale: "Record Sale",
  customers: "Customers",
  addCustomer: "Add Customer",
  customerName: "Customer Name",
  phone: "Phone Number",
  balanceOwed: "Balance Owed",
  status: "Status",
  clear: "Clear",
  owing: "Owing",
  overdue: "Overdue",
  sendReminder: "Send WhatsApp / SMS Reminder",
  recordPayment: "Record Payment",
  cart: "Shopping Cart",
  checkout: "Complete Sale",
  discount: "Discount",
  paymentMethod: "Payment Method",
  cashLabel: "Cash",
  momoLabel: "Mobile Money (MoMo)",
  creditLabel: "Credit (Akabanki)",
  selectCustomer: "Select Customer",
  printReceipt: "Print Receipt",
  shopProfile: "Shop Profile",
  preferences: "Preferences",
  currencyLabel: "Currency",
  themeLabel: "Theme",
  light: "Light Mode",
  dark: "Dark Mode",
  exportData: "Export Data (CSV)",
  resetData: "Reset All Data",
  helpArticles: "Frequently Asked Questions",
  contactSupport: "Contact Support",
  saveChanges: "Save Changes",
  cancel: "Cancel",
  delete: "Delete",
  confirm: "Confirm",
  amount: "Amount",
  description: "Description",
  date: "Date",
  type: "Type",
  receiptTitle: "SALES RECEIPT",
  thankYou: "Murakoze cyane! Thank you for shopping with us.",
  onboardingTitle: "Murakaza neza kuri ShopBook Rwanda!",
  onboardingSubtitle: "Your digital notebook for tracking sales, debts, and stock easily.",
  getStarted: "Get Started",
  incomeTab: "Income",
  expenseTab: "Expense",
  edit: "Edit",
  refund: "Refund",
  logOut: "Log Out",
  signIn: "Sign In",
  signUp: "Sign Up",
  emailOrPhone: "Phone or Email",
  password: "Password",
  shopName: "Shop Name",
  ownerName: "Owner Name"
};

// --- MOCK DATA ---
const initialProducts: Product[] = [
  { id: 'p1', name: 'Kabuye Sugar (1kg)', category: 'Food', buyingPrice: 1400, sellingPrice: 1600, stock: 24, reorderLevel: 10, unit: 'packet' },
  { id: 'p2', name: 'Mt. Meru Cooking Oil (1L)', category: 'Food', buyingPrice: 2800, sellingPrice: 3200, stock: 8, reorderLevel: 5, unit: 'bottle' },
  { id: 'p3', name: 'Sina Gerard Urwibutso Bread', category: 'Food', buyingPrice: 1000, sellingPrice: 1200, stock: 4, reorderLevel: 10, unit: 'pcs' },
  { id: 'p4', name: 'Azania Wheat Flour (2kg)', category: 'Food', buyingPrice: 2400, sellingPrice: 2800, stock: 15, reorderLevel: 6, unit: 'packet' },
  { id: 'p5', name: 'Azahar Washing Soap (Bar)', category: 'Household', buyingPrice: 650, sellingPrice: 800, stock: 35, reorderLevel: 15, unit: 'pcs' },
  { id: 'p6', name: 'Inyange Mineral Water (0.5L)', category: 'Beverages', buyingPrice: 350, sellingPrice: 500, stock: 48, reorderLevel: 20, unit: 'bottle' },
  { id: 'p7', name: 'MTN / Airtel Scratch Card (500 RWF)', category: 'Airtime & Services', buyingPrice: 480, sellingPrice: 500, stock: 12, reorderLevel: 10, unit: 'pcs' },
  { id: 'p8', name: 'Rwandan Dry Beans (1kg)', category: 'Food', buyingPrice: 1300, sellingPrice: 1500, stock: 5, reorderLevel: 12, unit: 'kg' },
];

const initialCustomers: Customer[] = [
  { id: 'c1', name: 'Jean Claude Ndayisenga', phone: '+250 788 123 456', notes: 'Teacher at GS Musanze, pays end of month', balance: 14500, creditLimit: 30000, lastActiveDate: '2026-10-05' },
  { id: 'c2', name: 'Marie Claire Uwase', phone: '+250 722 987 654', notes: 'Market vendor, reliable weekly payments', balance: 6200, creditLimit: 20000, lastActiveDate: '2026-09-10' },
  { id: 'c3', name: 'Emmanuel Habimana', phone: '+250 790 456 789', notes: 'Moto taxi rider near taxi park', balance: 0, creditLimit: 10000, lastActiveDate: '2026-10-10' }
];

const initialTransactions: Transaction[] = [
  { id: 't1', date: '2026-10-11T09:30:00Z', type: 'sale_cash', amount: 3200, description: 'Cash Sale: Cooking Oil (1L)', category: 'Food', paymentMethod: 'Cash' },
  { id: 't2', date: '2026-10-11T10:15:00Z', type: 'sale_momo', amount: 1600, description: 'MoMo Sale: Sugar (1kg)', category: 'Food', paymentMethod: 'MoMo' },
  { id: 't3', date: '2026-10-10T14:20:00Z', type: 'sale_credit', amount: 4500, description: 'Credit Sale to Jean Claude Ndayisenga', customerId: 'c1', customerName: 'Jean Claude Ndayisenga', paymentMethod: 'Credit' },
  { id: 't4', date: '2026-10-09T08:00:00Z', type: 'expense', amount: 25000, description: 'Electricity & Water (REG / WASAC)', category: 'Utilities' },
  { id: 't5', date: '2026-10-08T11:00:00Z', type: 'restock', amount: 56000, description: 'Stock Purchase: Sugar & Flour', category: 'Stock Purchase' }
];

const initialSettings: ShopSettings = {
  shopName: 'Musanze Good Hope Mini-Market',
  ownerName: 'Claudine Mukamana',
  phone: '+250 788 555 888',
  address: 'Musanze Taxi Park Road, Rwanda',
  currency: 'RWF',
  exchangeRate: 1300,
  lowStockThreshold: 10,
  theme: 'light',
  receiptFooter: 'Murakoze cyane! Goods once sold are not returnable.'
};

const initialHelpArticles: HelpArticle[] = [
  {
    id: 'h1',
    question: 'How do I add a new product?',
    answer: 'Go to the Inventory tab, click "+ Add New Product" at the top right, fill in the details and click Save.',
    category: 'Inventory'
  },
  {
    id: 'h2',
    question: 'How do I record a credit sale?',
    answer: 'In Sales (POS), add items to cart, select "Credit" payment method, choose customer and complete sale.',
    category: 'Sales'
  },
  {
    id: 'h3',
    question: 'How do I send a payment reminder?',
    answer: 'Go to Credit Book, click "WhatsApp" next to the customer who owes money to open a pre-filled message.',
    category: 'Credit'
  },
  {
    id: 'h4',
    question: 'How do I back up my data?',
    answer: 'Go to Settings, scroll down and click "Export Data (CSV)" to download a spreadsheet backup.',
    category: 'Settings'
  }
];

export default function App() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('shopbook_auth') === 'true';
  });
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authInput, setAuthInput] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authShopName, setAuthShopName] = useState('');
  const [authOwnerName, setAuthOwnerName] = useState('');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authInput || !authPassword) return;
    if (authMode === 'signup' && (!authShopName || !authOwnerName)) return;

    if (authMode === 'signup') {
      setSettings(prev => ({ ...prev, shopName: authShopName, ownerName: authOwnerName, phone: authInput }));
    }

    setIsAuthenticated(true);
    localStorage.setItem('shopbook_auth', 'true');
  };

  const handleLogOut = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('shopbook_auth');
  };

  const [products, setProducts] = useState<Product[]>(() => {
    const s = localStorage.getItem('shopbook_products');
    return s ? JSON.parse(s) : initialProducts;
  });
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const s = localStorage.getItem('shopbook_transactions');
    return s ? JSON.parse(s) : initialTransactions;
  });
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const s = localStorage.getItem('shopbook_customers');
    return s ? JSON.parse(s) : initialCustomers;
  });
  const [settings, setSettings] = useState<ShopSettings>(() => {
    const s = localStorage.getItem('shopbook_settings');
    return s ? JSON.parse(s) : initialSettings;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('shopbook_seen_onboarding'));

  useEffect(() => { localStorage.setItem('shopbook_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('shopbook_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('shopbook_customers', JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem('shopbook_settings', JSON.stringify(settings)); }, [settings]);

  // Currency Formatter
  const formatMoney = (amountRWF: number) => {
    if (settings.currency === 'USD') {
      const usd = amountRWF / settings.exchangeRate;
      return '$' + usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return amountRWF.toLocaleString('en-US') + ' RWF';
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch { return iso; }
  };
  const isOverdue = (lastActive: string, balance: number) => {
    if (balance <= 0) return false;
    try {
      const diff = Math.abs(new Date().getTime() - new Date(lastActive).getTime());
      return Math.ceil(diff / (1000 * 60 * 60 * 24)) > 30;
    } catch { return false; }
  };

  // Modals state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [payingCustomer, setPayingCustomer] = useState<Customer | null>(null);
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [completedReceipt, setCompletedReceipt] = useState<any | null>(null);

  // Cash Flow states
  const [cfTab, setCfTab] = useState<'income' | 'expense'>('income');
  const [cfPeriod, setCfPeriod] = useState<'day' | 'week' | 'month'>('month');
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // POS Cart State
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [posDiscount, setPosDiscount] = useState('0');
  const [posPaymentMethod, setPosPaymentMethod] = useState<'Cash' | 'MoMo' | 'Credit'>('Cash');
  const [posCustomerId, setPosCustomerId] = useState(customers[0]?.id || '');
  const [posSearch, setPosSearch] = useState('');

  // Inventory Search & Filter
  const [invSearch, setInvSearch] = useState('');
  const [invCat, setInvCat] = useState('All');

  // Credit Search
  const [creditSearch, setCreditSearch] = useState('');

  // Calculations
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySales = transactions.filter(t => (t.type.startsWith('sale')) && t.date.startsWith(todayStr)).reduce((s, t) => s + t.amount, 0) || 48000;
  const weekSales = 345000;
  const totalOutstanding = customers.reduce((s, c) => s + c.balance, 0);
  const lowStockCount = products.filter(p => p.stock <= p.reorderLevel).length;

  const totalIncome = transactions.filter(t => !['expense', 'restock'].includes(t.type)).reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter(t => ['expense', 'restock'].includes(t.type)).reduce((s, t) => s + t.amount, 0);
  const netBalance = totalIncome - totalExpenses;

  // Handlers
  const handleSaveProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get('name') as string;
    const category = fd.get('category') as Category;
    const buyingPrice = Number(fd.get('buyingPrice'));
    const sellingPrice = Number(fd.get('sellingPrice'));
    const stock = Number(fd.get('stock'));
    const reorderLevel = Number(fd.get('reorderLevel'));
    const unit = fd.get('unit') as string;

    if (!name) return;

    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, name, category, buyingPrice, sellingPrice, stock, reorderLevel, unit } : p));
    } else {
      setProducts(prev => [{ id: 'p_' + Date.now(), name, category, buyingPrice, sellingPrice, stock, reorderLevel, unit }, ...prev]);
    }
    setShowAddProductModal(false);
    setEditingProduct(null);
  };

  const handleSaveExpense = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const amount = Number(fd.get('amount'));
    const description = fd.get('description') as string;
    const category = fd.get('category') as ExpenseCategory;
    const type = fd.get('type') as 'expense' | 'restock';

    if (!amount || !description) return;

    if (editingTx) {
      setTransactions(prev => prev.map(t => t.id === editingTx.id ? { ...t, amount, description, category, type } : t));
      setEditingTx(null);
    } else {
      const newTx: Transaction = {
        id: 'tx_' + Date.now(),
        date: new Date().toISOString(),
        type,
        amount,
        description,
        category,
        paymentMethod: 'Cash'
      };
      setTransactions(prev => [newTx, ...prev]);
    }
    setShowAddExpenseModal(false);
  };

  const handleSaveIncome = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const amount = Number(fd.get('amount'));
    const description = fd.get('description') as string;
    const category = fd.get('category') as IncomeCategory;
    const paymentMethod = fd.get('paymentMethod') as 'Cash' | 'MoMo';

    if (!amount || !description) return;

    const newTx: Transaction = {
      id: 'tx_' + Date.now(),
      date: new Date().toISOString(),
      type: 'income',
      amount,
      description,
      category,
      paymentMethod
    };
    setTransactions(prev => [newTx, ...prev]);
    setShowAddIncomeModal(false);
  };

  const handleDeleteTx = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleRefundTx = (tx: Transaction) => {
    if (window.confirm(`Are you sure you want to refund "${tx.description}"?`)) {
      const refundTx: Transaction = {
        id: 'tx_' + Date.now(),
        date: new Date().toISOString(),
        type: 'refund',
        amount: tx.amount,
        description: `Refund of ${tx.description}`,
        category: tx.category,
        paymentMethod: tx.paymentMethod
      };
      setTransactions(prev => [refundTx, ...prev]);
    }
  };

  const handleSaveCustomer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get('name') as string;
    const phone = fd.get('phone') as string;
    const notes = fd.get('notes') as string;
    const creditLimit = Number(fd.get('creditLimit')) || 20000;

    if (!name || !phone) return;

    const newCust: Customer = {
      id: 'c_' + Date.now(),
      name,
      phone,
      notes,
      balance: 0,
      creditLimit,
      lastActiveDate: new Date().toISOString().split('T')[0]
    };
    setCustomers(prev => [newCust, ...prev]);
    setShowAddCustomerModal(false);
  };

  const handleRecordPayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!payingCustomer) return;
    const fd = new FormData(e.currentTarget);
    const amount = Number(fd.get('amount'));
    if (!amount) return;

    setCustomers(prev => prev.map(c => c.id === payingCustomer.id ? { ...c, balance: Math.max(0, c.balance - amount), lastActiveDate: new Date().toISOString().split('T')[0] } : c));
    const newTx: Transaction = {
      id: 'tx_' + Date.now(),
      date: new Date().toISOString(),
      type: 'payment_received',
      amount,
      description: `Debt payment received from ${payingCustomer.name}`,
      customerId: payingCustomer.id,
      customerName: payingCustomer.name,
      paymentMethod: 'Cash'
    };
    setTransactions(prev => [newTx, ...prev]);
    setPayingCustomer(null);
  };

  const handleStockAdjust = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!adjustingProduct) return;
    const fd = new FormData(e.currentTarget);
    const qty = Number(fd.get('qty'));
    const type = fd.get('type') as 'in' | 'out';
    const note = fd.get('note') as string;

    const delta = type === 'in' ? qty : -qty;
    setProducts(prev => prev.map(p => p.id === adjustingProduct.id ? { ...p, stock: Math.max(0, p.stock + delta) } : p));

    const newTx: Transaction = {
      id: 'tx_' + Date.now(),
      date: new Date().toISOString(),
      type: type === 'in' ? 'restock' : 'expense',
      amount: Math.abs(delta) * adjustingProduct.buyingPrice,
      description: `${note || (type === 'in' ? 'Restock' : 'Adjustment')}: ${adjustingProduct.name} (${delta > 0 ? '+' : ''}${delta})`,
      category: 'Stock Purchase'
    };
    setTransactions(prev => [newTx, ...prev]);
    setAdjustingProduct(null);
  };

  const handlePOSCheckout = () => {
    if (cart.length === 0) return;
    const subtotal = cart.reduce((sum, item) => sum + (item.product.sellingPrice * item.quantity), 0);
    const discount = Number(posDiscount) || 0;
    const total = Math.max(0, subtotal - discount);

    let customerName = undefined;
    if (posPaymentMethod === 'Credit' && posCustomerId) {
      const c = customers.find(x => x.id === posCustomerId);
      customerName = c?.name;
    }

    const saleItems = cart.map(i => ({ productId: i.product.id, name: i.product.name, quantity: i.quantity, price: i.product.sellingPrice }));

    setProducts(prev => {
      const updated = [...prev];
      saleItems.forEach(item => {
        const idx = updated.findIndex(p => p.id === item.productId);
        if (idx !== -1) {
          updated[idx] = { ...updated[idx], stock: Math.max(0, updated[idx].stock - item.quantity) };
        }
      });
      return updated;
    });

    const txType = posPaymentMethod === 'Credit' ? 'sale_credit' : posPaymentMethod === 'MoMo' ? 'sale_momo' : 'sale_cash';
    const newTx: Transaction = {
      id: 'tx_' + Date.now(),
      date: new Date().toISOString(),
      type: txType,
      amount: total,
      description: `Sale (${posPaymentMethod}): ${saleItems.map(i => `${i.quantity}x ${i.name}`).join(', ')}`,
      category: 'Food',
      paymentMethod: posPaymentMethod,
      customerId: posPaymentMethod === 'Credit' ? posCustomerId : undefined,
      customerName,
      items: saleItems
    };
    setTransactions(prev => [newTx, ...prev]);

    if (posPaymentMethod === 'Credit' && posCustomerId) {
      setCustomers(prev => prev.map(c => c.id === posCustomerId ? { ...c, balance: c.balance + total, lastActiveDate: new Date().toISOString().split('T')[0] } : c));
    }

    setCompletedReceipt({
      items: saleItems,
      subtotal,
      discount,
      total,
      paymentMethod: posPaymentMethod,
      customerName,
      date: new Date().toLocaleString()
    });

    setCart([]);
    setPosDiscount('0');
  };

  const handleExportCSV = () => {
    const csv = [
      ['ShopBook Rwanda Export'],
      ['Shop:', settings.shopName],
      ['Owner:', settings.ownerName],
      [],
      ['PRODUCTS'],
      ['Name', 'Category', 'Buying', 'Selling', 'Stock'],
      ...products.map(p => [p.name, p.category, p.buyingPrice, p.sellingPrice, p.stock]),
      [],
      ['CUSTOMERS'],
      ['Name', 'Phone', 'Balance'],
      ...customers.map(c => [c.name, c.phone, c.balance]),
      [],
      ['TRANSACTIONS'],
      ['Date', 'Type', 'Amount', 'Description'],
      ...transactions.map(t => [t.date, t.type, t.amount, t.description])
    ].map(e => e.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shopbook_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleReset = () => {
    localStorage.clear();
    setProducts(initialProducts);
    setTransactions(initialTransactions);
    setCustomers(initialCustomers);
    setSettings(initialSettings);
  };

  const isDarkMode = settings.theme === 'dark';

  // --- AUTH SCREEN IF NOT SIGNED IN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8FAF9] flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-gray-100 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#16A34A] text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/20">
              <Store className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{translations.appName}</h1>
            <p className="text-xs text-gray-500">Digital notebook for small shops in Rwanda</p>
          </div>

          <div className="flex bg-gray-100 p-1 rounded-2xl">
            <button
              onClick={() => setAuthMode('signin')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${authMode === 'signin' ? 'bg-white text-[#16A34A] shadow-sm' : 'text-gray-500'}`}
            >
              {translations.signIn}
            </button>
            <button
              onClick={() => setAuthMode('signup')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${authMode === 'signup' ? 'bg-white text-[#16A34A] shadow-sm' : 'text-gray-500'}`}
            >
              {translations.signUp}
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">{translations.shopName}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Musanze Good Hope Mini-Market"
                    value={authShopName}
                    onChange={e => setAuthShopName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">{translations.ownerName}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Claudine Mukamana"
                    value={authOwnerName}
                    onChange={e => setAuthOwnerName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">{translations.emailOrPhone}</label>
              <input
                type="text"
                required
                placeholder="+250 788 123 456"
                value={authInput}
                onChange={e => setAuthInput(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">{translations.password}</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={authPassword}
                onChange={e => setAuthPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 text-sm transition-all"
            >
              {authMode === 'signin' ? translations.signIn : translations.signUp}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#111827] text-white' : 'bg-[#FFFFFF] text-[#111827]'} flex flex-col md:flex-row font-sans selection:bg-emerald-100 transition-colors duration-200`}>
      {/* DESKTOP SIDEBAR */}
      <aside className={`hidden md:flex w-64 flex-col fixed inset-y-0 ${isDarkMode ? 'bg-[#1F2937] border-r border-gray-800' : 'bg-[#FFFFFF] border-r border-[#E5E7EB]'} z-30`}>
        <div className={`flex items-center gap-3 px-6 h-20 ${isDarkMode ? 'border-b border-gray-800' : 'border-b border-[#E5E7EB]'}`}>
          <div className="w-10 h-10 rounded-2xl bg-[#16A34A] flex items-center justify-center text-white font-bold shadow-md shadow-emerald-600/20">
            <Store className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className={`font-bold text-sm truncate ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>{settings.shopName}</h1>
            <p className="text-xs text-[#16A34A] font-semibold">ShopBook Rwanda</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {[
            { id: 'dashboard', label: translations.dashboard, icon: LayoutDashboard },
            { id: 'pos', label: translations.pos, icon: ShoppingCart, badge: 'Fast' },
            { id: 'inventory', label: translations.inventory, icon: Package },
            { id: 'credit', label: translations.creditMenu, icon: Users },
            { id: 'cashFlow', label: translations.cashFlow, icon: ArrowLeftRight },
            { id: 'settings', label: translations.settings, icon: SettingsIcon },
            { id: 'help', label: translations.help, icon: HelpCircle },
          ].map(item => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                  active 
                    ? 'bg-[#16A34A] text-white shadow-md shadow-emerald-600/20 font-semibold' 
                    : isDarkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-[#6B7280] hover:bg-[#F8FAF9] hover:text-[#111827]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${active ? 'text-white' : isDarkMode ? 'text-gray-400' : 'text-[#6B7280]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-emerald-50 text-[#16A34A]'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className={`p-4 border-t ${isDarkMode ? 'border-gray-800 bg-gray-800/50' : 'border-[#E5E7EB] bg-[#F8FAF9]'} m-4 rounded-2xl`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#16A34A] font-bold flex items-center justify-center text-xs">
              RW
            </div>
            <div className="min-w-0">
              <p className={`text-xs font-bold truncate ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>Musanze Province</p>
              <p className="text-[11px] text-[#6B7280]">Currency: {settings.currency}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAV */}
      <nav aria-label="Mobile Navigation" className={`md:hidden fixed bottom-0 left-0 right-0 ${isDarkMode ? 'bg-[#1F2937] border-gray-800 text-white' : 'bg-[#FFFFFF] border-[#E5E7EB] text-[#111827]'} border-t z-40 px-2 py-2 flex justify-around shadow-lg`}>
        {[
          { id: 'dashboard', label: translations.dashboard, icon: LayoutDashboard },
          { id: 'pos', label: translations.pos, icon: ShoppingCart },
          { id: 'inventory', label: translations.inventory, icon: Package },
          { id: 'credit', label: translations.creditMenu, icon: Users },
          { id: 'cashFlow', label: translations.cashFlow, icon: ArrowLeftRight },
          { id: 'settings', label: translations.settings, icon: SettingsIcon },
        ].map(item => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-xl ${active ? 'text-[#16A34A] font-bold' : isDarkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-1 truncate max-w-[60px]">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* MAIN CONTENT AREA */}
      <div className={`flex-1 md:ml-64 flex flex-col min-h-screen ${isDarkMode ? 'bg-[#111827]' : 'bg-[#FFFFFF]'}`}>
        {/* TOP BAR */}
        <header className={`h-20 ${isDarkMode ? 'bg-[#1F2937] border-gray-800' : 'bg-[#FFFFFF] border-[#E5E7EB]'} border-b px-6 md:px-10 flex items-center justify-between sticky top-0 z-20`}>
          <div className="flex items-center gap-3">
            <div className="md:hidden w-8 h-8 rounded-xl bg-[#16A34A] text-white flex items-center justify-center font-bold">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h2 className={`text-lg font-bold capitalize ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>{activeTab === 'pos' ? translations.pos : activeTab}</h2>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>{settings.shopName} · {settings.ownerName}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('pos')}
              className="px-4 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold rounded-2xl text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{translations.recordSale}</span>
            </button>
          </div>
        </header>

        {/* VIEWPORT */}
        <main className={`flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto pb-24 md:pb-12 ${isDarkMode ? 'bg-[#111827]' : 'bg-[#FFFFFF]'}`}>
          {/* 1. DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="bg-gradient-to-r from-[#16A34A] to-[#15803D] rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold bg-white/20 px-3 py-1 rounded-full">
                    Musanze, Rwanda
                  </span>
                  <h2 className="text-3xl font-bold mt-2">Murakaza neza, {settings.ownerName}!</h2>
                  <p className="text-emerald-50 text-sm mt-1">Here is the real-time financial health and inventory overview of your shop.</p>
                </div>
                <button
                  onClick={() => setActiveTab('pos')}
                  className="px-6 py-3 bg-white text-[#16A34A] font-bold rounded-2xl text-sm shadow-lg hover:bg-emerald-50 transition-all flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{translations.recordSale}</span>
                </button>
              </div>

              {/* 4 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className={`${isDarkMode ? 'bg-[#1F2937] border-gray-800' : 'bg-[#FFFFFF] border-[#E5E7EB]'} p-6 rounded-2xl border shadow-sm flex flex-col justify-between`}>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>{translations.todaySales}</span>
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#16A34A] flex items-center justify-center">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className={`text-2xl font-bold tabular-nums ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>{formatMoney(todaySales)}</div>
                    <p className="text-xs text-[#16A34A] font-semibold mt-1">+18% vs yesterday</p>
                  </div>
                </div>

                <div className={`${isDarkMode ? 'bg-[#1F2937] border-gray-800' : 'bg-[#FFFFFF] border-[#E5E7EB]'} p-6 rounded-2xl border shadow-sm flex flex-col justify-between`}>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>{translations.weekSales}</span>
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#16A34A] flex items-center justify-center">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className={`text-2xl font-bold tabular-nums ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>{formatMoney(weekSales)}</div>
                    <p className="text-xs text-[#16A34A] font-semibold mt-1">Steady weekly volume</p>
                  </div>
                </div>

                <div className={`${isDarkMode ? 'bg-[#1F2937] border-gray-800' : 'bg-[#FFFFFF] border-[#E5E7EB]'} p-6 rounded-2xl border shadow-sm flex flex-col justify-between`}>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>{translations.outstandingCredit}</span>
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#D97706] flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-2xl font-bold text-[#D97706] tabular-nums">{formatMoney(totalOutstanding)}</div>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>{customers.filter(c => c.balance > 0).length} owing accounts</p>
                  </div>
                </div>

                <div className={`${isDarkMode ? 'bg-[#1F2937] border-gray-800' : 'bg-[#FFFFFF] border-[#E5E7EB]'} p-6 rounded-2xl border shadow-sm flex flex-col justify-between`}>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>{translations.lowStockItems}</span>
                    <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#DC2626] flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-2xl font-bold text-[#DC2626] tabular-nums">{lowStockCount} items</div>
                    <p className="text-xs text-[#DC2626] font-semibold mt-1">Needs restock</p>
                  </div>
                </div>
              </div>

              {/* Chart & Low Stock */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className={`${isDarkMode ? 'bg-[#1F2937] border-gray-800' : 'bg-[#FFFFFF] border-[#E5E7EB]'} lg:col-span-2 p-6 rounded-2xl border shadow-sm`}>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>{translations.salesTrend}</h3>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>Daily revenue tracking in {settings.currency}</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-[#16A34A]' : 'bg-[#F8FAF9] border-[#E5E7EB] text-[#16A34A]'}`}>
                      Live Data
                    </span>
                  </div>
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { day: 'Day 1', sales: 32000 },
                        { day: 'Day 5', sales: 45000 },
                        { day: 'Day 10', sales: 38000 },
                        { day: 'Day 15', sales: 62000 },
                        { day: 'Day 20', sales: 51000 },
                        { day: 'Day 25', sales: 74000 },
                        { day: 'Today', sales: todaySales },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#E5E7EB'} opacity={0.6} />
                        <XAxis dataKey="day" stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} fontSize={12} />
                        <YAxis stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} fontSize={12} tickFormatter={v => formatMoney(v)} />
                        <Tooltip formatter={(v: any) => [formatMoney(Number(v)), 'Sales']} />
                        <Line type="monotone" dataKey="sales" stroke="#16A34A" strokeWidth={3} dot={{ fill: '#16A34A', r: 5 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className={`${isDarkMode ? 'bg-[#1F2937] border-gray-800' : 'bg-[#FFFFFF] border-[#E5E7EB]'} p-6 rounded-2xl border shadow-sm flex flex-col justify-between`}>
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>{translations.lowStockAlert}</h3>
                      <span className="w-6 h-6 rounded-full bg-red-100 text-[#DC2626] text-xs font-bold flex items-center justify-center">
                        {products.filter(p => p.stock <= p.reorderLevel).length}
                      </span>
                    </div>
                    {products.filter(p => p.stock <= p.reorderLevel).length === 0 ? (
                      <p className={`text-sm py-8 text-center ${isDarkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>All product stocks are healthy!</p>
                    ) : (
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {products.filter(p => p.stock <= p.reorderLevel).map(p => (
                          <div key={p.id} className="p-3 bg-red-50/60 border border-red-100 rounded-xl flex justify-between items-center">
                            <div>
                              <p className="text-xs font-bold text-[#111827]">{p.name}</p>
                              <p className="text-[11px] text-[#DC2626]">Only {p.stock} {p.unit} left</p>
                            </div>
                            <button
                              onClick={() => setActiveTab('inventory')}
                              className="px-2.5 py-1 bg-[#DC2626] text-white rounded-lg text-xs font-semibold"
                            >
                              Restock
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setActiveTab('inventory')}
                    className={`mt-4 w-full py-2.5 rounded-xl text-xs font-bold border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-[#F8FAF9] border-[#E5E7EB] text-[#111827]'}`}
                  >
                    Manage Inventory →
                  </button>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className={`${isDarkMode ? 'bg-[#1F2937] border-gray-800' : 'bg-[#FFFFFF] border-[#E5E7EB]'} p-6 rounded-2xl border shadow-sm`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>{translations.recentTransactions}</h3>
                  <button onClick={() => setActiveTab('cashFlow')} className="text-xs font-bold text-[#16A34A] hover:underline">
                    View All →
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className={`border-b text-xs uppercase ${isDarkMode ? 'border-gray-800 text-gray-400' : 'border-[#E5E7EB] text-[#6B7280]'}`}>
                        <th className="py-3 px-4">{translations.description}</th>
                        <th className="py-3 px-4">{translations.type}</th>
                        <th className="py-3 px-4">{translations.date}</th>
                        <th className="py-3 px-4 text-right">{translations.amount}</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDarkMode ? 'divide-gray-800' : 'divide-[#E5E7EB]'}`}>
                      {transactions.slice(0, 5).map(tx => {
                        const inFlow = !['expense', 'restock'].includes(tx.type);
                        return (
                          <tr key={tx.id} className={isDarkMode ? 'hover:bg-gray-800/50' : 'hover:bg-[#F8FAF9]'}>
                            <td className={`py-3 px-4 font-semibold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${inFlow ? 'bg-emerald-50 text-[#16A34A]' : 'bg-red-50 text-[#DC2626]'}`}>
                                {inFlow ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                              </div>
                              <span>{tx.description}</span>
                            </td>
                            <td className={`py-3 px-4 text-xs capitalize ${isDarkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>{tx.type.replace('_', ' ')}</td>
                            <td className={`py-3 px-4 text-xs tabular-nums ${isDarkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>{formatDate(tx.date)}</td>
                            <td className={`py-3 px-4 text-right font-bold tabular-nums ${inFlow ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                              {inFlow ? '+' : '-'}{formatMoney(tx.amount)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 1. CASH FLOW PAGE (UPDATED WITH GREEN/RED ACTION TABS) */}
          {activeTab === 'cashFlow' && (
            <div className="space-y-6 animate-in fade-in">
              <div className={`${isDarkMode ? 'bg-[#1F2937] border-gray-800' : 'bg-[#FFFFFF] border-[#E5E7EB]'} p-6 rounded-2xl border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}>
                <div>
                  <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>{translations.cashFlow}</h2>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>Record money in and money out with detailed ledger</p>
                </div>
                
                {/* User Requested: Green accent tab for income, red accent tab for expense, plus day/week/month filter */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setShowAddIncomeModal(true)}
                    className="px-4 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Record Income</span>
                  </button>

                  <button
                    onClick={() => { setEditingTx(null); setShowAddExpenseModal(true); }}
                    className="px-4 py-2.5 bg-[#DC2626] hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-md shadow-red-600/20 flex items-center gap-1.5 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Record Expense</span>
                  </button>

                  <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl text-xs font-bold">
                    {(['day', 'week', 'month'] as const).map(p => (
                      <button
                        key={p}
                        onClick={() => setCfPeriod(p)}
                        className={`px-3 py-1.5 rounded-lg capitalize ${cfPeriod === p ? 'bg-white dark:bg-gray-700 shadow-sm text-[#16A34A]' : 'text-gray-500'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`${isDarkMode ? 'bg-[#1F2937] border-gray-800' : 'bg-[#FFFFFF] border-[#E5E7EB]'} p-6 rounded-2xl border shadow-sm flex items-center gap-4`}>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#16A34A] flex items-center justify-center font-bold">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>{translations.totalIn}</p>
                    <p className="text-2xl font-bold text-[#16A34A] tabular-nums mt-0.5">{formatMoney(totalIncome)}</p>
                  </div>
                </div>

                <div className={`${isDarkMode ? 'bg-[#1F2937] border-gray-800' : 'bg-[#FFFFFF] border-[#E5E7EB]'} p-6 rounded-2xl border shadow-sm flex items-center gap-4`}>
                  <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#DC2626] flex items-center justify-center font-bold">
                    <ArrowDownLeft className="w-6 h-6" />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>{translations.totalOut}</p>
                    <p className="text-2xl font-bold text-[#DC2626] tabular-nums mt-0.5">{formatMoney(totalExpenses)}</p>
                  </div>
                </div>

                <div className={`${isDarkMode ? 'bg-[#1F2937] border-gray-800' : 'bg-[#FFFFFF] border-[#E5E7EB]'} p-6 rounded-2xl border shadow-sm flex items-center gap-4`}>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#16A34A] flex items-center justify-center font-bold">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>{translations.netBalance}</p>
                    <p className={`text-2xl font-bold tabular-nums mt-0.5 ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>{formatMoney(netBalance)}</p>
                  </div>
                </div>
              </div>

              {/* Monthly Bar Chart */}
              <div className={`${isDarkMode ? 'bg-[#1F2937] border-gray-800' : 'bg-[#FFFFFF] border-[#E5E7EB]'} p-6 rounded-2xl border shadow-sm`}>
                <h3 className={`font-bold text-base mb-1 ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>{translations.incomeVsExpenses}</h3>
                <p className={`text-xs mb-6 ${isDarkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>Green for income, red for expenses</p>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { month: 'Jul', Income: 850000, Expenses: 620000 },
                      { month: 'Aug', Income: 920000, Expenses: 680000 },
                      { month: 'Sep', Income: 1100000, Expenses: 750000 },
                      { month: 'Oct', Income: totalIncome || 980000, Expenses: totalExpenses || 540000 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#E5E7EB'} opacity={0.6} />
                      <XAxis dataKey="month" stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} fontSize={12} />
                      <YAxis stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} fontSize={12} tickFormatter={v => formatMoney(v)} />
                      <Tooltip formatter={(v: any) => [formatMoney(Number(v)), '']} />
                      <Legend />
                      <Bar dataKey="Income" fill="#16A34A" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="Expenses" fill="#DC2626" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* TABS FOR CASH FLOW: Income & Expense */}
              <div className={`${isDarkMode ? 'bg-[#1F2937] border-gray-800' : 'bg-[#FFFFFF] border-[#E5E7EB]'} rounded-2xl border shadow-sm overflow-hidden`}>
                <div className={`flex border-b ${isDarkMode ? 'border-gray-800' : 'border-[#E5E7EB]'}`}>
                  <button
                    onClick={() => setCfTab('income')}
                    className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
                      cfTab === 'income' 
                        ? 'border-[#16A34A] text-[#16A34A] bg-emerald-50/20' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 text-[#16A34A]" />
                    <span>{translations.incomeTab} ({formatMoney(totalIncome)})</span>
                  </button>

                  <button
                    onClick={() => setCfTab('expense')}
                    className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
                      cfTab === 'expense' 
                        ? 'border-[#DC2626] text-[#DC2626] bg-red-50/20' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <ArrowDownLeft className="w-4 h-4 text-[#DC2626]" />
                    <span>{translations.expenseTab} ({formatMoney(totalExpenses)})</span>
                  </button>
                </div>

                {/* Ledger Inside Tab */}
                <div className="p-6">
                  {(() => {
                    const txs = transactions.filter(tx => {
                      const isInc = !['expense', 'restock'].includes(tx.type);
                      return cfTab === 'income' ? isInc : !isInc;
                    });

                    if (txs.length === 0) {
                      return (
                        <div className="py-12 text-center text-gray-400">
                          <p className="text-sm font-semibold">No {cfTab} transactions recorded in this period.</p>
                        </div>
                      );
                    }

                    return (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className={`border-b text-xs uppercase ${isDarkMode ? 'border-gray-800 text-gray-400' : 'border-[#E5E7EB] text-[#6B7280]'}`}>
                              <th className="py-3 px-4">{translations.date}</th>
                              <th className="py-3 px-4">{translations.description}</th>
                              <th className="py-3 px-4">{translations.category}</th>
                              <th className="py-3 px-4">{translations.paymentMethod}</th>
                              <th className="py-3 px-4 text-right">{translations.amount}</th>
                              <th className="py-3 px-4 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody className={`divide-y ${isDarkMode ? 'divide-gray-800' : 'divide-[#E5E7EB]'}`}>
                            {txs.map(tx => {
                              const isInc = !['expense', 'restock'].includes(tx.type);
                              return (
                                <tr key={tx.id} className={isDarkMode ? 'hover:bg-gray-800/50' : 'hover:bg-[#F8FAF9]'}>
                                  <td className={`py-3 px-4 text-xs tabular-nums ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{formatDate(tx.date)}</td>
                                  <td className={`py-3 px-4 font-semibold ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>{tx.description}</td>
                                  <td className="py-3 px-4 text-xs">
                                    <span className={`px-2.5 py-1 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-[#F8FAF9] border-[#E5E7EB] text-[#6B7280]'}`}>
                                      {tx.category || 'General'}
                                    </span>
                                  </td>
                                  <td className={`py-3 px-4 text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{tx.paymentMethod || 'Cash'}</td>
                                  <td className={`py-3 px-4 text-right font-bold tabular-nums ${isInc ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                                    {isInc ? '+' : '-'}{formatMoney(tx.amount)}
                                  </td>
                                  <td className="py-3 px-4 text-center relative">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenMenuId(openMenuId === tx.id ? null : tx.id);
                                      }}
                                      className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg inline-flex items-center"
                                    >
                                      <MoreVertical className="w-4 h-4 text-gray-500" />
                                    </button>

                                    {openMenuId === tx.id && (
                                      <div className={`absolute right-8 top-10 w-36 rounded-2xl shadow-xl border z-20 py-1 text-left ${isDarkMode ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
                                        <button
                                          onClick={() => {
                                            setEditingTx(tx);
                                            if (isInc) setShowAddIncomeModal(true);
                                            else setShowAddExpenseModal(true);
                                            setOpenMenuId(null);
                                          }}
                                          className="w-full px-4 py-2 text-xs flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                                        >
                                          <Edit className="w-3.5 h-3.5" /> Edit
                                        </button>
                                        <button
                                          onClick={() => {
                                            handleRefundTx(tx);
                                            setOpenMenuId(null);
                                          }}
                                          className="w-full px-4 py-2 text-xs flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-amber-600"
                                        >
                                          <RefundIcon className="w-3.5 h-3.5" /> Refund
                                        </button>
                                        <button
                                          onClick={() => {
                                            handleDeleteTx(tx.id);
                                            setOpenMenuId(null);
                                          }}
                                          className="w-full px-4 py-2 text-xs flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-red-600"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" /> Delete
                                        </button>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* 3. INVENTORY */}
          {activeTab === 'inventory' && (
            <div className="space-y-6 animate-in fade-in">
              <div className={`${isDarkMode ? 'bg-[#1F2937] border-gray-800' : 'bg-[#FFFFFF] border-[#E5E7EB]'} p-6 rounded-2xl border shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4`}>
                <div>
                  <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>{translations.inventory}</h2>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>Manage product catalog and stock quantities</p>
                </div>
                <button
                  onClick={() => { setEditingProduct(null); setShowAddProductModal(true); }}
                  className="px-4 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold rounded-2xl text-xs shadow-md shadow-emerald-600/20 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{translations.addProduct}</span>
                </button>
              </div>

              {/* Valuation Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className={`${isDarkMode ? 'bg-[#1F2937] border-gray-800' : 'bg-[#FFFFFF] border-[#E5E7EB]'} p-6 rounded-2xl border shadow-sm flex items-center gap-4`}>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#16A34A] flex items-center justify-center font-bold">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>{translations.inventoryValue} ({translations.atCost})</p>
                    <p className={`text-2xl font-bold tabular-nums mt-0.5 ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>
                      {formatMoney(products.reduce((s, p) => s + (p.buyingPrice * p.stock), 0))}
                    </p>
                  </div>
                </div>

                <div className={`${isDarkMode ? 'bg-[#1F2937] border-gray-800' : 'bg-[#FFFFFF] border-[#E5E7EB]'} p-6 rounded-2xl border shadow-sm flex items-center gap-4`}>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#16A34A] flex items-center justify-center font-bold">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>{translations.inventoryValue} ({translations.atRetail})</p>
                    <p className="text-2xl font-bold text-[#16A34A] tabular-nums mt-0.5">
                      {formatMoney(products.reduce((s, p) => s + (p.sellingPrice * p.stock), 0))}
                    </p>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className={`${isDarkMode ? 'bg-[#1F2937] border-gray-800' : 'bg-[#FFFFFF] border-[#E5E7EB]'} p-6 rounded-2xl border shadow-sm space-y-4`}>
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#6B7280]" />
                    <input
                      type="text"
                      placeholder={translations.searchProducts}
                      value={invSearch}
                      onChange={e => setInvSearch(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-[#F8FAF9] border-[#E5E7EB]'}`}
                    />
                  </div>
                  <div className="flex gap-2 overflow-x-auto w-full sm:w-auto">
                    {['All', 'Food', 'Beverages', 'Household', 'Personal Care', 'Airtime & Services'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setInvCat(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap ${invCat === cat ? 'bg-[#16A34A] text-white' : isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-[#F8FAF9] border border-[#E5E7EB] text-[#6B7280]'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className={`border-b text-xs uppercase ${isDarkMode ? 'border-gray-800 text-gray-400' : 'border-[#E5E7EB] text-[#6B7280]'}`}>
                        <th className="py-3 px-4">Product Name</th>
                        <th className="py-3 px-4">{translations.category}</th>
                        <th className="py-3 px-4">{translations.buyingPrice}</th>
                        <th className="py-3 px-4">{translations.sellingPrice}</th>
                        <th className="py-3 px-4">{translations.stockQty}</th>
                        <th className="py-3 px-4">{translations.stockStatus}</th>
                        <th className="py-3 px-4 text-right">{translations.actions}</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDarkMode ? 'divide-gray-800' : 'divide-[#E5E7EB]'}`}>
                      {products.filter(p => (invCat === 'All' || p.category === invCat) && p.name.toLowerCase().includes(invSearch.toLowerCase())).map(p => {
                        const out = p.stock === 0;
                        const low = p.stock > 0 && p.stock <= p.reorderLevel;
                        return (
                          <tr key={p.id} className={isDarkMode ? 'hover:bg-gray-800/50' : 'hover:bg-[#F8FAF9]'}>
                            <td className={`py-3 px-4 font-bold ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>
                              {p.name}
                              <span className="block text-xs font-normal text-gray-400">Unit: {p.unit}</span>
                            </td>
                            <td className="py-3 px-4 text-xs text-gray-400">
                              <span className={`px-2 py-0.5 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-[#F8FAF9] border-[#E5E7EB]'}`}>{p.category}</span>
                            </td>
                            <td className={`py-3 px-4 tabular-nums ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{formatMoney(p.buyingPrice)}</td>
                            <td className="py-3 px-4 font-bold text-[#16A34A] tabular-nums">{formatMoney(p.sellingPrice)}</td>
                            <td className={`py-3 px-4 font-bold tabular-nums ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>{p.stock} {p.unit}</td>
                            <td className="py-3 px-4">
                              {out ? (
                                <span className="px-2.5 py-1 bg-red-100 text-[#DC2626] rounded-full text-xs font-bold">Out</span>
                              ) : low ? (
                                <span className="px-2.5 py-1 bg-amber-100 text-[#D97706] rounded-full text-xs font-bold">Low</span>
                              ) : (
                                <span className="px-2.5 py-1 bg-emerald-100 text-[#16A34A] rounded-full text-xs font-bold">In stock</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right space-x-2">
                              <button onClick={() => setAdjustingProduct(p)} title="Adjust Stock" className="p-1.5 bg-emerald-50 text-[#16A34A] rounded-lg hover:bg-emerald-100">
                                <RefreshCw className="w-4 h-4" />
                              </button>
                              <button onClick={() => { setEditingProduct(p); setShowAddProductModal(true); }} title="Edit" className={`p-1.5 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-[#F8FAF9] border-[#E5E7EB]'}`}>
                                <Plus className="w-4 h-4" />
                              </button>
                              <button onClick={() => setProducts(prev => prev.filter(x => x.id !== p.id))} title="Delete" className="p-1.5 bg-red-50 text-[#DC2626] rounded-lg">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 4. CREDIT MANAGEMENT */}
          {activeTab === 'credit' && (
            <div className="space-y-6 animate-in fade-in">
              <div className={`${isDarkMode ? 'bg-[#1F2937] border-gray-800' : 'bg-[#FFFFFF] border-[#E5E7EB]'} p-6 rounded-2xl border shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4`}>
                <div>
                  <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>{translations.creditMenu}</h2>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>Customer credit accounts (Akabanki) and WhatsApp payment reminders</p>
                </div>
                <button
                  onClick={() => setShowAddCustomerModal(true)}
                  className="px-4 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold rounded-2xl text-xs shadow-md shadow-emerald-600/20 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{translations.addCustomer}</span>
                </button>
              </div>

              <div className="bg-gradient-to-r from-[#D97706] to-[#B45309] rounded-3xl p-6 text-white shadow-xl flex justify-between items-center">
                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold text-amber-100">Total Outstanding Debt</p>
                  <h3 className="text-3xl font-bold tabular-nums mt-1">{formatMoney(totalOutstanding)}</h3>
                  <p className="text-xs text-amber-100 mt-1">{customers.filter(c => c.balance > 0).length} active customer debts</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                  <CreditCard className="w-7 h-7 text-white" />
                </div>
              </div>

              <div className={`${isDarkMode ? 'bg-[#1F2937] border-gray-800' : 'bg-[#FFFFFF] border-[#E5E7EB]'} p-6 rounded-2xl border shadow-sm space-y-4`}>
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search customer name or phone..."
                    value={creditSearch}
                    onChange={e => setCreditSearch(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-[#F8FAF9] border-[#E5E7EB]'}`}
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className={`border-b text-xs uppercase ${isDarkMode ? 'border-gray-800 text-gray-400' : 'border-[#E5E7EB] text-[#6B7280]'}`}>
                        <th className="py-3 px-4">{translations.customerName}</th>
                        <th className="py-3 px-4">{translations.phone}</th>
                        <th className="py-3 px-4">{translations.balanceOwed}</th>
                        <th className="py-3 px-4">{translations.status}</th>
                        <th className="py-3 px-4 text-right">{translations.actions}</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDarkMode ? 'divide-gray-800' : 'divide-[#E5E7EB]'}`}>
                      {customers.filter(c => c.name.toLowerCase().includes(creditSearch.toLowerCase())).map(c => {
                        const owing = c.balance > 0;
                        const overdue = isOverdue(c.lastActiveDate, c.balance);
                        return (
                          <tr key={c.id} className={isDarkMode ? 'hover:bg-gray-800/50' : 'hover:bg-[#F8FAF9]'}>
                            <td className={`py-3 px-4 font-bold ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>
                              {c.name}
                              {c.notes && <span className="block text-xs font-normal text-gray-400">{c.notes}</span>}
                            </td>
                            <td className={`py-3 px-4 tabular-nums ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{c.phone}</td>
                            <td className={`py-3 px-4 font-bold tabular-nums ${owing ? 'text-[#D97706]' : isDarkMode ? 'text-white' : 'text-[#111827]'}`}>
                              {formatMoney(c.balance)}
                            </td>
                            <td className="py-3 px-4">
                              {c.balance === 0 ? (
                                <span className="px-2.5 py-1 bg-emerald-100 text-[#16A34A] rounded-full text-xs font-bold">Clear</span>
                              ) : overdue ? (
                                <span className="px-2.5 py-1 bg-red-100 text-[#DC2626] rounded-full text-xs font-bold">Overdue</span>
                              ) : (
                                <span className="px-2.5 py-1 bg-amber-100 text-[#D97706] rounded-full text-xs font-bold">Owing</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right space-x-2">
                              {owing && (
                                <>
                                  <button
                                    onClick={() => {
                                      const msg = `Muraho ${c.name}, tubaye tubibukije ko mufite umwenda w'amafaranga ${formatMoney(c.balance)} mu iduka rya Musanze Good Hope Mini-Market. Murakoze cyane!`;
                                      window.open(`https://wa.me/${c.phone.replace(/\s+/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
                                    }}
                                    className="px-3 py-1.5 bg-emerald-50 text-[#16A34A] rounded-xl text-xs font-bold inline-flex items-center gap-1 hover:bg-emerald-100"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    <span>WhatsApp</span>
                                  </button>
                                  <button
                                    onClick={() => setPayingCustomer(c)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-[#F8FAF9] border-[#E5E7EB] text-[#111827]'}`}
                                  >
                                    Record Payment
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 5. SALES (POS) */}
          {activeTab === 'pos' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
              <div className="lg:col-span-2 space-y-4">
                <div className={`${isDarkMode ? 'bg-[#1F2937] border-gray-800' : 'bg-[#FFFFFF] border-[#E5E7EB]'} p-6 rounded-2xl border shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4`}>
                  <div>
                    <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>{translations.pos}</h2>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>Tap products to add to cart</p>
                  </div>
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder={translations.searchProducts}
                      value={posSearch}
                      onChange={e => setPosSearch(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-[#F8FAF9] border-[#E5E7EB]'}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {products.filter(p => p.name.toLowerCase().includes(posSearch.toLowerCase())).map(p => {
                    const out = p.stock <= 0;
                    return (
                      <button
                        key={p.id}
                        disabled={out}
                        onClick={() => {
                          if (out) return;
                          setCart(prev => {
                            const ex = prev.find(i => i.product.id === p.id);
                            if (ex) {
                              if (ex.quantity >= p.stock) return prev;
                              return prev.map(i => i.product.id === p.id ? { ...i, quantity: i.quantity + 1 } : i);
                            }
                            return [...prev, { product: p, quantity: 1 }];
                          });
                        }}
                        className={`p-4 rounded-2xl border text-left flex flex-col justify-between ${out ? 'opacity-50' : ''} ${isDarkMode ? 'bg-[#1F2937] border-gray-800 hover:border-[#16A34A]' : 'bg-[#FFFFFF] border-[#E5E7EB] hover:border-[#16A34A]'} shadow-sm`}
                      >
                        <div>
                          <span className="text-[10px] font-bold text-[#16A34A] uppercase">{p.category}</span>
                          <h4 className={`font-bold text-sm mt-1 line-clamp-2 ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>{p.name}</h4>
                        </div>
                        <div className={`mt-4 pt-3 border-t flex justify-between items-center ${isDarkMode ? 'border-gray-800' : 'border-[#E5E7EB]'}`}>
                          <span className="font-bold text-[#16A34A] text-sm tabular-nums">{formatMoney(p.sellingPrice)}</span>
                          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>{p.stock} {p.unit}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cart Panel */}
              <div className={`${isDarkMode ? 'bg-[#1F2937] border-gray-800' : 'bg-[#FFFFFF] border-[#E5E7EB]'} p-6 rounded-2xl border shadow-sm flex flex-col justify-between h-fit sticky top-28`}>
                <div>
                  <div className={`flex justify-between items-center pb-4 border-b mb-4 ${isDarkMode ? 'border-gray-800' : 'border-[#E5E7EB]'}`}>
                    <h3 className={`font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>
                      <ShoppingCart className="w-5 h-5 text-[#16A34A]" />
                      <span>{translations.cart}</span>
                    </h3>
                    <span className="text-xs bg-emerald-50 text-[#16A34A] px-2.5 py-1 rounded-full font-bold">
                      {cart.length} items
                    </span>
                  </div>

                  {cart.length === 0 ? (
                    <div className="py-12 text-center text-gray-400">
                      <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p className="text-sm font-semibold">Cart is empty</p>
                      <p className="text-xs mt-1">Tap products to add items.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {cart.map(item => (
                        <div key={item.product.id} className={`flex justify-between items-center p-3 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-[#F8FAF9]'}`}>
                          <div className="min-w-0 flex-1 mr-2">
                            <p className={`text-xs font-bold truncate ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>{item.product.name}</p>
                            <p className="text-xs text-[#16A34A] font-bold tabular-nums">{formatMoney(item.product.sellingPrice)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setCart(prev => prev.map(i => i.product.id === item.product.id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i))}
                              className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-[#E5E7EB]'}`}
                            >-</button>
                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => setCart(prev => prev.map(i => i.product.id === item.product.id && i.quantity < i.product.stock ? { ...i, quantity: i.quantity + 1 } : i))}
                              className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-[#E5E7EB]'}`}
                            >+</button>
                            <button onClick={() => setCart(prev => prev.filter(i => i.product.id !== item.product.id))} className="text-[#DC2626] ml-1">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={`mt-6 pt-4 border-t space-y-4 ${isDarkMode ? 'border-gray-800' : 'border-[#E5E7EB]'}`}>
                  <div className="space-y-2 text-sm">
                    <div className={`flex justify-between ${isDarkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>
                      <span>Subtotal</span>
                      <span className="tabular-nums">{formatMoney(cart.reduce((s, i) => s + (i.product.sellingPrice * i.quantity), 0))}</span>
                    </div>
                    <div className={`flex items-center justify-between ${isDarkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>
                      <span>{translations.discount}</span>
                      <input
                        type="number"
                        min="0"
                        value={posDiscount}
                        onChange={e => setPosDiscount(e.target.value)}
                        className={`w-24 px-2 py-1 rounded-lg text-right text-xs tabular-nums border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-[#F8FAF9] border-[#E5E7EB]'}`}
                      />
                    </div>
                    <div className={`flex justify-between text-base font-bold pt-2 border-t ${isDarkMode ? 'border-gray-800 text-white' : 'border-[#E5E7EB] text-[#111827]'}`}>
                      <span>Total</span>
                      <span className="text-[#16A34A] tabular-nums">
                        {formatMoney(Math.max(0, cart.reduce((s, i) => s + (i.product.sellingPrice * i.quantity), 0) - (Number(posDiscount) || 0)))}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-bold mb-1.5 ${isDarkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>{translations.paymentMethod}</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'Cash', label: translations.cashLabel, icon: Banknote },
                        { id: 'MoMo', label: translations.momoLabel, icon: Smartphone },
                        { id: 'Credit', label: translations.creditLabel, icon: CreditCard },
                      ].map(m => {
                        const Icon = m.icon;
                        const sel = posPaymentMethod === m.id;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setPosPaymentMethod(m.id as any)}
                            className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border ${sel ? 'bg-emerald-50 border-[#16A34A] text-[#16A34A]' : isDarkMode ? 'border-gray-700 text-gray-400' : 'border-[#E5E7EB] text-[#6B7280]'}`}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{m.id}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {posPaymentMethod === 'Credit' && (
                    <div>
                      <label className={`block text-xs font-bold mb-1 ${isDarkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>{translations.selectCustomer}</label>
                      <select
                        value={posCustomerId}
                        onChange={e => setPosCustomerId(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-[#F8FAF9] border-[#E5E7EB]'}`}
                      >
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name} (Owes: {formatMoney(c.balance)})</option>)}
                      </select>
                    </div>
                  )}

                  <button
                    disabled={cart.length === 0}
                    onClick={handlePOSCheckout}
                    className={`w-full py-3.5 rounded-2xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 ${cart.length === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#16A34A] hover:bg-[#15803D] text-white shadow-emerald-600/20'}`}
                  >
                    <Check className="w-5 h-5" />
                    <span>{translations.checkout}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 6. SETTINGS (WITH LOG OUT TAB) */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-3xl animate-in fade-in">
              <div className={`${isDarkMode ? 'bg-[#1F2937] border-gray-800' : 'bg-[#FFFFFF] border-[#E5E7EB]'} p-6 rounded-2xl border shadow-sm`}>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>{translations.settings}</h2>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>Shop profile, appearance, currency preferences, and session</p>
              </div>

              {/* Shop Profile */}
              <div className={`${isDarkMode ? 'bg-[#1F2937] border-gray-800' : 'bg-[#FFFFFF] border-[#E5E7EB]'} p-6 rounded-2xl border shadow-sm space-y-4`}>
                <h3 className={`font-bold text-base border-b pb-2 ${isDarkMode ? 'border-gray-800 text-white' : 'border-[#E5E7EB] text-[#111827]'}`}>{translations.shopProfile}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-bold mb-1 ${isDarkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>Shop Name</label>
                    <input
                      type="text"
                      value={settings.shopName}
                      onChange={e => setSettings({ ...settings, shopName: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-[#F8FAF9] border-[#E5E7EB]'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-bold mb-1 ${isDarkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>Owner Name</label>
                    <input
                      type="text"
                      value={settings.ownerName}
                      onChange={e => setSettings({ ...settings, ownerName: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-[#F8FAF9] border-[#E5E7EB]'}`}
                    />
                  </div>
                </div>
              </div>

              {/* Preferences: Theme & Currency */}
              <div className={`${isDarkMode ? 'bg-[#1F2937] border-gray-800' : 'bg-[#FFFFFF] border-[#E5E7EB]'} p-6 rounded-2xl border shadow-sm space-y-4`}>
                <h3 className={`font-bold text-base border-b pb-2 ${isDarkMode ? 'border-gray-800 text-white' : 'border-[#E5E7EB] text-[#111827]'}`}>{translations.preferences}</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                  {/* Theme Toggle */}
                  <div>
                    <label className={`block text-xs font-bold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>{translations.themeLabel}</label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSettings({ ...settings, theme: 'light' })}
                        className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border ${!isDarkMode ? 'bg-emerald-50 border-[#16A34A] text-[#16A34A]' : 'bg-gray-800 border-gray-700 text-gray-400'}`}
                      >
                        <Sun className="w-4 h-4" />
                        <span>{translations.light}</span>
                      </button>
                      <button
                        onClick={() => setSettings({ ...settings, theme: 'dark' })}
                        className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border ${isDarkMode ? 'bg-emerald-50 border-[#16A34A] text-[#16A34A]' : 'bg-[#F8FAF9] border-[#E5E7EB] text-gray-600'}`}
                      >
                        <Moon className="w-4 h-4" />
                        <span>{translations.dark}</span>
                      </button>
                    </div>
                  </div>

                  {/* Currency Selector */}
                  <div>
                    <label className={`block text-xs font-bold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>{translations.currencyLabel}</label>
                    <select
                      value={settings.currency}
                      onChange={e => setSettings({ ...settings, currency: e.target.value as 'RWF' | 'USD' })}
                      className={`w-full px-3.5 py-3 rounded-xl text-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-[#F8FAF9] border-[#E5E7EB]'}`}
                    >
                      <option value="RWF">RWF (Rwandan Franc)</option>
                      <option value="USD">USD (US Dollar)</option>
                    </select>
                  </div>
                </div>

                {settings.currency === 'USD' && (
                  <div className="pt-2 animate-in fade-in">
                    <label className={`block text-xs font-bold mb-1 ${isDarkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>Exchange Rate (1 USD = ? RWF)</label>
                    <input
                      type="number"
                      value={settings.exchangeRate}
                      onChange={e => setSettings({ ...settings, exchangeRate: Number(e.target.value) || 1300 })}
                      className={`w-full sm:w-64 px-3.5 py-2.5 rounded-xl text-sm border tabular-nums ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-[#F8FAF9] border-[#E5E7EB]'}`}
                    />
                  </div>
                )}
              </div>

              {/* Data Management & Log Out */}
              <div className={`${isDarkMode ? 'bg-[#1F2937] border-gray-800' : 'bg-[#FFFFFF] border-[#E5E7EB]'} p-6 rounded-2xl border shadow-sm space-y-4`}>
                <h3 className={`font-bold text-base border-b pb-2 ${isDarkMode ? 'border-gray-800 text-white' : 'border-[#E5E7EB] text-[#111827]'}`}>Data & Session</h3>
                
                {/* User Requested: Log out tab in settings */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-2">
                  <div>
                    <p className="font-bold text-sm">Sign Out of Session</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>Log out from this device and return to sign in screen</p>
                  </div>
                  <button
                    onClick={handleLogOut}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{translations.logOut}</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-2 border-t border-gray-700">
                  <div>
                    <p className="font-bold text-sm">Export All Data</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>Download spreadsheet backup of products and sales</p>
                  </div>
                  <button onClick={handleExportCSV} className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-[#F8FAF9] border-[#E5E7EB]'}`}>
                    <Download className="w-4 h-4" />
                    <span>{translations.exportData}</span>
                  </button>
                </div>

                <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t ${isDarkMode ? 'border-gray-800' : 'border-[#E5E7EB]'}`}>
                  <div>
                    <p className="font-bold text-sm text-[#DC2626]">Reset All Data</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>Restore initial Musanze sample store data</p>
                  </div>
                  <button onClick={handleReset} className="px-4 py-2.5 bg-red-50 text-[#DC2626] rounded-xl text-xs font-bold flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    <span>{translations.resetData}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 7. HELP CENTER */}
          {activeTab === 'help' && (
            <div className="space-y-6 max-w-3xl animate-in fade-in">
              <div className={`${isDarkMode ? 'bg-[#1F2937] border-gray-800' : 'bg-[#FFFFFF] border-[#E5E7EB]'} p-6 rounded-2xl border shadow-sm`}>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>{translations.help}</h2>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>Simple answers and contact support</p>
              </div>

              <div className="space-y-3">
                {initialHelpArticles.map(art => (
                  <div key={art.id} className={`${isDarkMode ? 'bg-[#1F2937] border-gray-800' : 'bg-[#FFFFFF] border-[#E5E7EB]'} p-5 rounded-2xl border shadow-sm space-y-2`}>
                    <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>{art.question}</h3>
                    <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>{art.answer}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-[#16A34A] to-[#15803D] rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h3 className="text-lg font-bold">Need more help? Contact Support</h3>
                  <p className="text-xs text-emerald-100">Musanze support team available via phone or WhatsApp.</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.open('https://wa.me/250788555888', '_blank')}
                    className="px-4 py-2.5 bg-white text-[#16A34A] rounded-xl text-xs font-bold flex items-center gap-2 shadow"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </button>
                  <a
                    href="tel:+250788555888"
                    className="px-4 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* --- MODALS --- */}

      {/* Onboarding Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] text-gray-900 rounded-3xl max-w-md w-full p-8 shadow-2xl border border-[#E5E7EB] text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#16A34A] text-white flex items-center justify-center mx-auto shadow-xl">
              <Store className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{translations.onboardingTitle}</h2>
              <p className="text-xs text-[#6B7280] mt-2 leading-relaxed">{translations.onboardingSubtitle}</p>
            </div>
            <button
              onClick={() => { localStorage.setItem('shopbook_seen_onboarding', 'true'); setShowOnboarding(false); }}
              className="w-full py-3.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 text-sm"
            >
              {translations.getStarted}
            </button>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`${isDarkMode ? 'bg-[#1F2937] text-white' : 'bg-[#FFFFFF] text-gray-900'} rounded-3xl max-w-md w-full p-6 shadow-2xl border`}>
            <h3 className="text-lg font-bold mb-1">{editingProduct ? translations.editProduct : translations.addProduct}</h3>
            <p className="text-xs text-gray-400 mb-6">Enter product details for inventory.</p>
            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Product Name</label>
                <input name="name" defaultValue={editingProduct?.name} required placeholder="e.g. Sugar (1kg)" className={`w-full px-3.5 py-2.5 rounded-xl text-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#F8FAF9] border-[#E5E7EB]'}`} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">{translations.category}</label>
                  <select name="category" defaultValue={editingProduct?.category || 'Food'} className={`w-full px-3.5 py-2.5 rounded-xl text-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#F8FAF9] border-[#E5E7EB]'}`}>
                    {['Food', 'Beverages', 'Household', 'Personal Care', 'Airtime & Services', 'General'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">{translations.unit}</label>
                  <input name="unit" defaultValue={editingProduct?.unit || 'pcs'} required className={`w-full px-3.5 py-2.5 rounded-xl text-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#F8FAF9] border-[#E5E7EB]'}`} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">{translations.buyingPrice}</label>
                  <input name="buyingPrice" type="number" defaultValue={editingProduct?.buyingPrice} required className={`w-full px-3.5 py-2.5 rounded-xl text-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#F8FAF9] border-[#E5E7EB]'}`} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">{translations.sellingPrice}</label>
                  <input name="sellingPrice" type="number" defaultValue={editingProduct?.sellingPrice} required className={`w-full px-3.5 py-2.5 rounded-xl text-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#F8FAF9] border-[#E5E7EB]'}`} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">{translations.stockQty}</label>
                  <input name="stock" type="number" defaultValue={editingProduct?.stock} required className={`w-full px-3.5 py-2.5 rounded-xl text-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#F8FAF9] border-[#E5E7EB]'}`} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">{translations.reorderLevel}</label>
                  <input name="reorderLevel" type="number" defaultValue={editingProduct?.reorderLevel || 10} required className={`w-full px-3.5 py-2.5 rounded-xl text-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#F8FAF9] border-[#E5E7EB]'}`} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                <button type="button" onClick={() => setShowAddProductModal(false)} className="px-4 py-2 text-sm text-gray-400">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#16A34A] text-white font-bold rounded-xl text-sm">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Expense Modal */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`${isDarkMode ? 'bg-[#1F2937] text-white' : 'bg-[#FFFFFF] text-gray-900'} rounded-3xl max-w-md w-full p-6 shadow-2xl border`}>
            <h3 className="text-lg font-bold mb-1">{editingTx ? 'Edit Transaction' : 'Record Cash Outflow'}</h3>
            <p className="text-xs text-gray-400 mb-6">Record rent, transport, utilities, or stock purchases.</p>
            <form onSubmit={handleSaveExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Type</label>
                <select name="type" defaultValue={editingTx?.type || 'expense'} className={`w-full px-3.5 py-2.5 rounded-xl text-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#F8FAF9] border-[#E5E7EB]'}`}>
                  <option value="expense">Operating Expense</option>
                  <option value="restock">Stock Purchase</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">{translations.category}</label>
                <select name="category" defaultValue={editingTx?.category || 'Rent'} className={`w-full px-3.5 py-2.5 rounded-xl text-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#F8FAF9] border-[#E5E7EB]'}`}>
                  {['Rent', 'Transport', 'Salaries', 'Utilities', 'Stock Purchase', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">{translations.description}</label>
                <input name="description" defaultValue={editingTx?.description} required placeholder="e.g. Monthly electricity bill" className={`w-full px-3.5 py-2.5 rounded-xl text-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#F8FAF9] border-[#E5E7EB]'}`} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">{translations.amount} (RWF)</label>
                <input name="amount" type="number" defaultValue={editingTx?.amount} required placeholder="15000" className={`w-full px-3.5 py-2.5 rounded-xl text-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#F8FAF9] border-[#E5E7EB]'}`} />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                <button type="button" onClick={() => { setShowAddExpenseModal(false); setEditingTx(null); }} className="px-4 py-2 text-sm text-gray-400">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#DC2626] text-white font-bold rounded-xl text-sm">Confirm Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Income Modal */}
      {showAddIncomeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`${isDarkMode ? 'bg-[#1F2937] text-white' : 'bg-[#FFFFFF] text-gray-900'} rounded-3xl max-w-md w-full p-6 shadow-2xl border`}>
            <h3 className="text-lg font-bold mb-1">Record Income</h3>
            <p className="text-xs text-gray-400 mb-6">Record cash, MoMo, or other incoming funds.</p>
            <form onSubmit={handleSaveIncome} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">{translations.category}</label>
                <select name="category" className={`w-full px-3.5 py-2.5 rounded-xl text-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#F8FAF9] border-[#E5E7EB]'}`}>
                  {['Sales', 'Service Fee', 'Loan Received', 'Other Income'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">{translations.paymentMethod}</label>
                <select name="paymentMethod" className={`w-full px-3.5 py-2.5 rounded-xl text-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#F8FAF9] border-[#E5E7EB]'}`}>
                  <option value="Cash">Cash</option>
                  <option value="MoMo">Mobile Money (MoMo)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">{translations.description}</label>
                <input name="description" required placeholder="e.g. Additional service payment" className={`w-full px-3.5 py-2.5 rounded-xl text-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#F8FAF9] border-[#E5E7EB]'}`} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">{translations.amount} (RWF)</label>
                <input name="amount" type="number" required placeholder="10000" className={`w-full px-3.5 py-2.5 rounded-xl text-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#F8FAF9] border-[#E5E7EB]'}`} />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                <button type="button" onClick={() => setShowAddIncomeModal(false)} className="px-4 py-2 text-sm text-gray-400">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#16A34A] text-white font-bold rounded-xl text-sm">Confirm Income</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`${isDarkMode ? 'bg-[#1F2937] text-white' : 'bg-[#FFFFFF] text-gray-900'} rounded-3xl max-w-md w-full p-6 shadow-2xl border`}>
            <h3 className="text-lg font-bold mb-1">{translations.addCustomer}</h3>
            <p className="text-xs text-gray-400 mb-6">Register a customer for credit purchases.</p>
            <form onSubmit={handleSaveCustomer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">{translations.customerName}</label>
                <input name="name" required placeholder="e.g. Jean Claude" className={`w-full px-3.5 py-2.5 rounded-xl text-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#F8FAF9] border-[#E5E7EB]'}`} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">{translations.phone}</label>
                <input name="phone" required placeholder="+250 788 123 456" className={`w-full px-3.5 py-2.5 rounded-xl text-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#F8FAF9] border-[#E5E7EB]'}`} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Credit Limit (RWF)</label>
                <input name="creditLimit" type="number" defaultValue="20000" className={`w-full px-3.5 py-2.5 rounded-xl text-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#F8FAF9] border-[#E5E7EB]'}`} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Notes / Occupation</label>
                <input name="notes" placeholder="e.g. Teacher at GS Musanze" className={`w-full px-3.5 py-2.5 rounded-xl text-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#F8FAF9] border-[#E5E7EB]'}`} />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                <button type="button" onClick={() => setShowAddCustomerModal(false)} className="px-4 py-2 text-sm text-gray-400">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#16A34A] text-white font-bold rounded-xl text-sm">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {payingCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`${isDarkMode ? 'bg-[#1F2937] text-white' : 'bg-[#FFFFFF] text-gray-900'} rounded-3xl max-w-md w-full p-6 shadow-2xl border`}>
            <h3 className="text-lg font-bold mb-1">Record Payment: {payingCustomer.name}</h3>
            <p className="text-xs text-gray-400 mb-6">Current balance: {formatMoney(payingCustomer.balance)}</p>
            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Amount Paid (RWF)</label>
                <input name="amount" type="number" required max={payingCustomer.balance} placeholder="5000" className={`w-full px-3.5 py-2.5 rounded-xl text-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#F8FAF9] border-[#E5E7EB]'}`} />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                <button type="button" onClick={() => setPayingCustomer(null)} className="px-4 py-2 text-sm text-gray-400">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#16A34A] text-white font-bold rounded-xl text-sm">Confirm Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {adjustingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`${isDarkMode ? 'bg-[#1F2937] text-white' : 'bg-[#FFFFFF] text-gray-900'} rounded-3xl max-w-md w-full p-6 shadow-2xl border`}>
            <h3 className="text-lg font-bold mb-1">Adjust Stock: {adjustingProduct.name}</h3>
            <p className="text-xs text-gray-400 mb-6">Current: {adjustingProduct.stock} {adjustingProduct.unit}</p>
            <form onSubmit={handleStockAdjust} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Type</label>
                <select name="type" className={`w-full px-3.5 py-2.5 rounded-xl text-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#F8FAF9] border-[#E5E7EB]'}`}>
                  <option value="in">Stock In (Restock)</option>
                  <option value="out">Stock Out (Loss / Damage)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Quantity</label>
                <input name="qty" type="number" required min="1" placeholder="10" className={`w-full px-3.5 py-2.5 rounded-xl text-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#F8FAF9] border-[#E5E7EB]'}`} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Note</label>
                <input name="note" placeholder="e.g. Wholesale delivery" className={`w-full px-3.5 py-2.5 rounded-xl text-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#F8FAF9] border-[#E5E7EB]'}`} />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                <button type="button" onClick={() => setAdjustingProduct(null)} className="px-4 py-2 text-sm text-gray-400">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#16A34A] text-white font-bold rounded-xl text-sm">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Completed Receipt Modal */}
      {completedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] text-gray-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border space-y-6">
            <div className="text-center pb-4 border-b border-dashed border-gray-300">
              <h3 className="font-bold text-lg">{settings.shopName}</h3>
              <p className="text-xs text-gray-500">{settings.address}</p>
              <p className="text-[11px] text-[#16A34A] font-bold mt-1">=== {translations.receiptTitle} ===</p>
              <p className="text-xs text-gray-500 mt-1">{completedReceipt.date}</p>
            </div>
            {completedReceipt.customerName && (
              <div className="text-xs bg-[#F8FAF9] p-2.5 rounded-xl font-semibold">
                Customer: {completedReceipt.customerName}
              </div>
            )}
            <div className="space-y-2 text-xs max-h-40 overflow-y-auto">
              {completedReceipt.items.map((i: any, idx: number) => (
                <div key={idx} className="flex justify-between">
                  <span className="text-gray-600">{i.quantity}x {i.name}</span>
                  <span className="font-bold text-gray-900 tabular-nums">{formatMoney(i.price * i.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-dashed border-gray-300 space-y-1 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatMoney(completedReceipt.subtotal)}</span>
              </div>
              {completedReceipt.discount > 0 && (
                <div className="flex justify-between text-[#16A34A]">
                  <span>Discount</span>
                  <span className="tabular-nums">-{formatMoney(completedReceipt.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-900 text-sm pt-2 border-t border-gray-300">
                <span>TOTAL ({completedReceipt.paymentMethod})</span>
                <span className="text-[#16A34A] tabular-nums">{formatMoney(completedReceipt.total)}</span>
              </div>
            </div>
            <div className="text-center text-[11px] text-gray-500 italic">{translations.thankYou}</div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => window.print()} className="flex-1 py-2.5 bg-gray-100 border border-gray-300 text-gray-900 font-bold rounded-xl text-xs flex items-center justify-center gap-1">
                <Printer className="w-4 h-4" /> Print
              </button>
              <button onClick={() => setCompletedReceipt(null)} className="flex-1 py-2.5 bg-[#16A34A] text-white font-bold rounded-xl text-xs">
                New Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
