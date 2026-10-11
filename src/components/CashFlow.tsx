import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Filter, 
  Wallet, 
  TrendingUp, 
  TrendingDown,
  Calendar
} from 'lucide-react';
import { Transaction, ExpenseCategory } from '../types';
import { formatRWF, formatDate } from '../utils';
import { translations } from '../translations';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

interface CashFlowProps {
  transactions: Transaction[];
  onAddTransaction: (tx: Omit<Transaction, 'id' | 'date'>) => void;
  language: 'en' | 'rw';
}

export const CashFlow: React.FC<CashFlowProps> = ({ transactions, onAddTransaction, language }) => {
  const t = translations[language];

  const [filterType, setFilterType] = useState<'all' | 'in' | 'out'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for new manual transaction / expense
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'expense' | 'restock'>('expense');
  const [category, setCategory] = useState<ExpenseCategory>('Rent');

  const totalIn = transactions
    .filter(tx => tx.type !== 'expense' && tx.type !== 'restock')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalOut = transactions
    .filter(tx => tx.type === 'expense' || tx.type === 'restock')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const netBalance = totalIn - totalOut;

  const filteredTransactions = transactions.filter(tx => {
    const isOut = tx.type === 'expense' || tx.type === 'restock';
    if (filterType === 'in') return !isOut;
    if (filterType === 'out') return isOut;
    return true;
  });

  // Monthly comparison chart data
  const chartData = [
    { month: 'Jul', Income: 850000, Expenses: 620000 },
    { month: 'Aug', Income: 920000, Expenses: 680000 },
    { month: 'Sep', Income: 1100000, Expenses: 750000 },
    { month: 'Oct', Income: totalIn || 980000, Expenses: totalOut || 540000 },
  ];

  const handleSubmitExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    onAddTransaction({
      type,
      amount: Number(amount),
      description,
      category,
      paymentMethod: 'Cash'
    });

    setAmount('');
    setDescription('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{t.cashFlow}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Track money coming in and going out of your shop.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm shadow-md transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Record Expense / Outflow</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total In */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.totalIn}</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums mt-0.5">{formatRWF(totalIn)}</p>
          </div>
        </div>

        {/* Total Out */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.totalOut}</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400 tabular-nums mt-0.5">{formatRWF(totalOut)}</p>
          </div>
        </div>

        {/* Net Balance */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.netBalance}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">{formatRWF(netBalance)}</p>
          </div>
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">{t.incomeVsExpenses}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Compare monthly revenue against operational expenses and restocks.</p>
        
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} tickFormatter={(val) => `${val / 1000}k`} />
              <Tooltip 
                formatter={(val: any) => [formatRWF(Number(val) || 0), '']}
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', border: 'none' }}
              />
              <Legend />
              <Bar dataKey="Income" fill="#059669" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Expenses" fill="#dc2626" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transactions Table with Filter */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Transaction Ledger</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">All recorded cash inflows and outflows</p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filterType === 'all' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('in')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filterType === 'in' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Money In
            </button>
            <button
              onClick={() => setFilterType('out')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filterType === 'out' ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Money Out
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">{t.description}</th>
                <th className="py-3 px-4">{t.category}</th>
                <th className="py-3 px-4">{t.date}</th>
                <th className="py-3 px-4 text-right">{t.amount}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {filteredTransactions.map(tx => {
                const isOut = tx.type === 'expense' || tx.type === 'restock';
                return (
                  <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        !isOut ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400'
                      }`}>
                        {!isOut ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{tx.description}</p>
                        <p className="text-xs text-slate-500 capitalize">{tx.type.replace('_', ' ')} {tx.paymentMethod ? `· ${tx.paymentMethod}` : ''}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 text-xs font-medium">
                      <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                        {tx.category || 'General'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-xs tabular-nums">
                      {formatDate(tx.date)}
                    </td>
                    <td className={`py-3.5 px-4 text-right font-bold tabular-nums ${
                      !isOut ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {!isOut ? '+' : '-'}{formatRWF(tx.amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense / Outflow Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Record Cash Outflow</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Record shop rent, transport, utility bills, or stock purchases.</p>

            <form onSubmit={handleSubmitExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Transaction Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="expense">Operating Expense</option>
                  <option value="restock">Stock Purchase (Restock)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Rent">Rent</option>
                  <option value="Transport">Transport</option>
                  <option value="Salaries">Salaries</option>
                  <option value="Utilities">Utilities (REG/WASAC)</option>
                  <option value="Stock Purchase">Stock Purchase</option>
                  <option value="Other">Other Expense</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Monthly electricity bill"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">{t.amount} (RWF)</label>
                <input
                  type="number"
                  required
                  min="100"
                  placeholder="e.g., 15000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-colors"
                >
                  {t.confirm}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
