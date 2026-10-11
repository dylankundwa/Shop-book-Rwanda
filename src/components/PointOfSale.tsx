import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Search, 
  Check, 
  Printer, 
  Smartphone, 
  Banknote, 
  CreditCard
} from 'lucide-react';
import { Product, Customer } from '../types';
import { formatRWF } from '../utils';
import { translations } from '../translations';

interface PointOfSaleProps {
  products: Product[];
  customers: Customer[];
  onCompleteSale: (saleData: {
    items: { productId: string; name: string; quantity: number; price: number }[];
    totalAmount: number;
    paymentMethod: 'Cash' | 'MoMo' | 'Credit';
    customerId?: string;
    customerName?: string;
    discount: number;
  }) => void;
  language: 'en' | 'rw';
}

interface CartItem {
  product: Product;
  quantity: number;
}

export const PointOfSale: React.FC<PointOfSaleProps> = ({ 
  products, 
  customers, 
  onCompleteSale, 
  language 
}) => {
  const t = translations[language];

  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState('0');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'MoMo' | 'Credit'>('Cash');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  
  // Completed sale receipt modal state
  const [completedReceipt, setCompletedReceipt] = useState<{
    items: { productId: string; name: string; quantity: number; price: number }[];
    subtotal: number;
    discount: number;
    total: number;
    paymentMethod: string;
    customerName?: string;
    date: string;
  } | null>(null);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          if (newQty > item.product.stock) return item;
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.product.sellingPrice * item.quantity), 0);
  const discountNum = Number(discount) || 0;
  const totalAmount = Math.max(0, subtotal - discountNum);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    let customerName = undefined;
    if (paymentMethod === 'Credit' && selectedCustomerId) {
      const cust = customers.find(c => c.id === selectedCustomerId);
      customerName = cust?.name;
    }

    const saleItems = cart.map(item => ({
      productId: item.product.id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.sellingPrice
    }));

    onCompleteSale({
      items: saleItems,
      totalAmount,
      paymentMethod,
      customerId: paymentMethod === 'Credit' ? selectedCustomerId : undefined,
      customerName,
      discount: discountNum
    });

    setCompletedReceipt({
      items: saleItems,
      subtotal,
      discount: discountNum,
      total: totalAmount,
      paymentMethod,
      customerName,
      date: new Date().toLocaleString()
    });

    // Clear cart
    setCart([]);
    setDiscount('0');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-20 md:pb-6">
      {/* Products Catalog (Left 2 cols) */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.pos}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Tap products to add to shopping cart.</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={t.searchProducts}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {filteredProducts.map(p => {
            const outOfStock = p.stock <= 0;
            return (
              <button
                key={p.id}
                disabled={outOfStock}
                onClick={() => addToCart(p)}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  outOfStock 
                    ? 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60 cursor-not-allowed'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-sm hover:shadow-md'
                }`}
              >
                <div>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{p.category}</span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-1 line-clamp-2">{p.name}</h4>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm tabular-nums">
                    {formatRWF(p.sellingPrice)}
                  </span>
                  <span className={`text-xs font-semibold ${outOfStock ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}`}>
                    {outOfStock ? 'Out' : `${p.stock} ${p.unit}`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cart & Checkout Panel (Right 1 col) */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between h-fit lg:sticky lg:top-6">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-emerald-600" />
              <span>{t.cart}</span>
            </h3>
            <span className="text-xs bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-full font-semibold">
              {cart.length} items
            </span>
          </div>

          {/* Cart Items List */}
          {cart.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">Cart is empty</p>
              <p className="text-xs mt-1">Tap products on the left to add them.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cart.map(item => (
                <div key={item.product.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="min-w-0 flex-1 mr-2">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{item.product.name}</p>
                    <p className="text-xs text-emerald-600 font-bold tabular-nums">{formatRWF(item.product.sellingPrice)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="w-7 h-7 bg-white dark:bg-slate-700 rounded-lg shadow-sm flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold w-5 text-center tabular-nums text-slate-900 dark:text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="w-7 h-7 bg-white dark:bg-slate-700 rounded-lg shadow-sm flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-500 hover:text-red-700 p-1 ml-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Checkout Calculations & Options */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatRWF(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span>{t.discount}</span>
              <input
                type="number"
                min="0"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-24 px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-right text-xs text-slate-900 dark:text-white tabular-nums"
              />
            </div>
            <div className="flex justify-between text-lg font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Total</span>
              <span className="text-emerald-600 dark:text-emerald-400 tabular-nums">{formatRWF(totalAmount)}</span>
            </div>
          </div>

          {/* Payment Method selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{t.paymentMethod}</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('Cash')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition-all ${
                  paymentMethod === 'Cash' 
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-sm' 
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Banknote className="w-4 h-4" />
                <span>{t.cashLabel}</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('MoMo')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition-all ${
                  paymentMethod === 'MoMo' 
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-sm' 
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>MoMo</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('Credit')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition-all ${
                  paymentMethod === 'Credit' 
                    ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 text-amber-700 dark:text-amber-300 shadow-sm' 
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Credit</span>
              </button>
            </div>
          </div>

          {/* Customer select if credit */}
          {paymentMethod === 'Credit' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">{t.selectCustomer}</label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} (Owes: {formatRWF(c.balance)})</option>
                ))}
              </select>
            </div>
          )}

          <button
            disabled={cart.length === 0}
            onClick={handleCheckout}
            className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 ${
              cart.length === 0 
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed' 
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
            }`}
          >
            <Check className="w-5 h-5" />
            <span>{t.checkout} ({formatRWF(totalAmount)})</span>
          </button>
        </div>
      </div>

      {/* Completed Sale Receipt Modal */}
      {completedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="text-center pb-4 border-b border-dashed border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Musanze Good Hope Mini-Market</h3>
              <p className="text-xs text-slate-500">Musanze Taxi Park Road, Rwanda</p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">=== {t.receiptTitle} ===</p>
              <p className="text-xs text-slate-400 mt-1">{completedReceipt.date}</p>
            </div>

            {completedReceipt.customerName && (
              <div className="text-xs bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Customer:</span> {completedReceipt.customerName}
              </div>
            )}

            <div className="space-y-2 text-xs max-h-48 overflow-y-auto">
              {completedReceipt.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-slate-700 dark:text-slate-300">{item.quantity}x {item.name}</span>
                  <span className="font-semibold text-slate-900 dark:text-white tabular-nums">{formatRWF(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-dashed border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatRWF(completedReceipt.subtotal)}</span>
              </div>
              {completedReceipt.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span className="tabular-nums">-{formatRWF(completedReceipt.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-slate-900 dark:text-white text-sm pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>TOTAL ({completedReceipt.paymentMethod})</span>
                <span className="text-emerald-600 tabular-nums">{formatRWF(completedReceipt.total)}</span>
              </div>
            </div>

            <div className="text-center pt-2 text-[11px] text-slate-400 italic">
              {t.thankYou}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
              <button
                onClick={() => setCompletedReceipt(null)}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition-colors"
              >
                New Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
