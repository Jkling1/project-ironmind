'use client'

import { useState } from 'react'
import { UserData, Expense, ExpenseCategory } from '@/types'
import {
  getTotalExpenses,
  getPaidExpenses,
  getRemainingBudget,
  getSavingsProgress,
  getExpensesByCategory,
} from '@/lib/storage'
import { DollarSign, Plus, Trash2, Check, X, TrendingUp, TrendingDown } from 'lucide-react'

interface BudgetTrackerProps {
  userData: UserData
  onUpdateBudget: (budget: UserData['budget']) => void
}

const categoryColors: Record<ExpenseCategory, string> = {
  registration: 'text-neon-blue',
  gear: 'text-neon-purple',
  nutrition: 'text-neon-green',
  travel: 'text-neon-pink',
  coaching: 'text-yellow-400',
  medical: 'text-orange-400',
  other: 'text-gray-400',
}

const categoryLabels: Record<ExpenseCategory, string> = {
  registration: 'Registration',
  gear: 'Gear & Equipment',
  nutrition: 'Nutrition & Supplements',
  travel: 'Travel & Lodging',
  coaching: 'Coaching & Training',
  medical: 'Medical & Insurance',
  other: 'Other',
}

export default function BudgetTracker({ userData, onUpdateBudget }: BudgetTrackerProps) {
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [editingBudget, setEditingBudget] = useState(false)
  const [editingSavings, setEditingSavings] = useState(false)

  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    category: 'registration',
    name: '',
    amount: 0,
    isPaid: false,
    notes: '',
  })

  const [tempBudget, setTempBudget] = useState(userData.budget.totalBudget)
  const [tempSavings, setTempSavings] = useState(userData.budget.currentSavings)
  const [tempSavingsGoal, setTempSavingsGoal] = useState(userData.budget.savingsGoal)

  const totalExpenses = getTotalExpenses(userData)
  const paidExpenses = getPaidExpenses(userData)
  const remainingBudget = getRemainingBudget(userData)
  const savingsProgress = getSavingsProgress(userData)
  const expensesByCategory = getExpensesByCategory(userData)

  const handleAddExpense = () => {
    if (!newExpense.name || !newExpense.amount) return

    const expense: Expense = {
      id: `expense-${Date.now()}`,
      category: newExpense.category as ExpenseCategory,
      name: newExpense.name,
      amount: Number(newExpense.amount),
      date: new Date().toISOString(),
      isPaid: newExpense.isPaid || false,
      notes: newExpense.notes,
    }

    onUpdateBudget({
      ...userData.budget,
      expenses: [...userData.budget.expenses, expense],
    })

    setNewExpense({
      category: 'registration',
      name: '',
      amount: 0,
      isPaid: false,
      notes: '',
    })
    setShowAddExpense(false)
  }

  const handleDeleteExpense = (id: string) => {
    onUpdateBudget({
      ...userData.budget,
      expenses: userData.budget.expenses.filter(e => e.id !== id),
    })
  }

  const handleTogglePaid = (id: string) => {
    onUpdateBudget({
      ...userData.budget,
      expenses: userData.budget.expenses.map(e =>
        e.id === id ? { ...e, isPaid: !e.isPaid } : e
      ),
    })
  }

  const handleSaveBudget = () => {
    onUpdateBudget({
      ...userData.budget,
      totalBudget: Number(tempBudget),
    })
    setEditingBudget(false)
  }

  const handleSaveSavings = () => {
    onUpdateBudget({
      ...userData.budget,
      currentSavings: Number(tempSavings),
      savingsGoal: Number(tempSavingsGoal),
    })
    setEditingSavings(false)
  }

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      <div className="bg-dark-card border border-dark-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neon-blue text-glow-blue">
            Race Budget
          </h2>
          <DollarSign className="w-6 h-6 text-neon-blue" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-dark-bg rounded-lg p-4">
            <div className="text-sm text-gray-500 mb-1">Total Budget</div>
            {editingBudget ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={tempBudget}
                  onChange={(e) => setTempBudget(Number(e.target.value))}
                  className="w-full bg-dark-card border border-neon-blue rounded px-2 py-1 text-white"
                  autoFocus
                />
                <button onClick={handleSaveBudget} className="text-neon-green">
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setTempBudget(userData.budget.totalBudget)
                    setEditingBudget(false)
                  }}
                  className="text-red-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => setEditingBudget(true)}
                className="text-xl font-bold text-neon-blue cursor-pointer hover:text-glow-blue"
              >
                ${userData.budget.totalBudget.toLocaleString()}
              </div>
            )}
          </div>

          <div className="bg-dark-bg rounded-lg p-4">
            <div className="text-sm text-gray-500 mb-1">Total Expenses</div>
            <div className="text-xl font-bold text-neon-purple">
              ${totalExpenses.toLocaleString()}
            </div>
          </div>

          <div className="bg-dark-bg rounded-lg p-4">
            <div className="text-sm text-gray-500 mb-1">Paid</div>
            <div className="text-xl font-bold text-neon-green">
              ${paidExpenses.toLocaleString()}
            </div>
          </div>

          <div className="bg-dark-bg rounded-lg p-4">
            <div className="text-sm text-gray-500 mb-1">Remaining</div>
            <div
              className={`text-xl font-bold ${
                remainingBudget >= 0 ? 'text-neon-green' : 'text-red-400'
              }`}
            >
              ${remainingBudget.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Savings Goal */}
        <div className="pt-4 border-t border-dark-border">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Savings Goal</span>
            {editingSavings ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={tempSavings}
                  onChange={(e) => setTempSavings(Number(e.target.value))}
                  placeholder="Current"
                  className="w-24 bg-dark-card border border-neon-green rounded px-2 py-1 text-white text-sm"
                />
                <span className="text-gray-500">/</span>
                <input
                  type="number"
                  value={tempSavingsGoal}
                  onChange={(e) => setTempSavingsGoal(Number(e.target.value))}
                  placeholder="Goal"
                  className="w-24 bg-dark-card border border-neon-green rounded px-2 py-1 text-white text-sm"
                />
                <button onClick={handleSaveSavings} className="text-neon-green">
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setTempSavings(userData.budget.currentSavings)
                    setTempSavingsGoal(userData.budget.savingsGoal)
                    setEditingSavings(false)
                  }}
                  className="text-red-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <span
                onClick={() => setEditingSavings(true)}
                className="text-sm font-bold text-neon-green cursor-pointer hover:text-glow-green"
              >
                ${userData.budget.currentSavings.toLocaleString()} / $
                {userData.budget.savingsGoal.toLocaleString()} ({savingsProgress}%)
              </span>
            )}
          </div>
          <div className="w-full bg-dark-bg rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-neon-green to-neon-blue transition-all duration-500"
              style={{ width: `${Math.min(savingsProgress, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Expenses by Category */}
      <div className="bg-dark-card border border-dark-border rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-300 mb-4">Expenses by Category</h3>
        <div className="space-y-2">
          {expensesByCategory
            .filter(cat => cat.total > 0)
            .map(({ category, total }) => (
              <div key={category} className="flex items-center justify-between">
                <span className={`text-sm ${categoryColors[category as ExpenseCategory]}`}>
                  {categoryLabels[category as ExpenseCategory]}
                </span>
                <span className="text-sm font-bold text-white">
                  ${total.toLocaleString()}
                </span>
              </div>
            ))}
          {expensesByCategory.every(cat => cat.total === 0) && (
            <p className="text-sm text-gray-500 text-center py-4">
              No expenses yet. Add your first expense below!
            </p>
          )}
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-dark-card border border-dark-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-300">All Expenses</h3>
          <button
            onClick={() => setShowAddExpense(!showAddExpense)}
            className="flex items-center gap-2 bg-neon-blue/20 hover:bg-neon-blue/30 border border-neon-blue text-neon-blue px-4 py-2 rounded-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Expense
          </button>
        </div>

        {/* Add Expense Form */}
        {showAddExpense && (
          <div className="bg-dark-bg rounded-lg p-4 mb-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Category</label>
                <select
                  value={newExpense.category}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, category: e.target.value as ExpenseCategory })
                  }
                  className="w-full bg-dark-card border border-dark-border rounded px-3 py-2 text-white"
                >
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Amount</label>
                <input
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                  placeholder="0.00"
                  className="w-full bg-dark-card border border-dark-border rounded px-3 py-2 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Name</label>
              <input
                type="text"
                value={newExpense.name}
                onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                placeholder="e.g., Ironman Registration"
                className="w-full bg-dark-card border border-dark-border rounded px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Notes (optional)</label>
              <input
                type="text"
                value={newExpense.notes}
                onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
                placeholder="Any additional details"
                className="w-full bg-dark-card border border-dark-border rounded px-3 py-2 text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPaid"
                checked={newExpense.isPaid}
                onChange={(e) => setNewExpense({ ...newExpense, isPaid: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="isPaid" className="text-sm text-gray-400">
                Already paid
              </label>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddExpense}
                className="flex-1 bg-neon-green/20 hover:bg-neon-green/30 border border-neon-green text-neon-green font-bold py-2 rounded-lg transition-all"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddExpense(false)}
                className="flex-1 bg-dark-bg hover:bg-dark-border border border-dark-border text-gray-400 font-bold py-2 rounded-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Expenses List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {userData.budget.expenses.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No expenses tracked yet. Click "Add Expense" to get started!
            </p>
          ) : (
            userData.budget.expenses.map((expense) => (
              <div
                key={expense.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  expense.isPaid
                    ? 'bg-dark-bg/50 border-dark-border opacity-75'
                    : 'bg-dark-bg border-dark-border'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${expense.isPaid ? 'line-through' : ''}`}>
                      {expense.name}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        categoryColors[expense.category]
                      } bg-opacity-20`}
                    >
                      {categoryLabels[expense.category]}
                    </span>
                  </div>
                  {expense.notes && (
                    <p className="text-xs text-gray-500 mt-1">{expense.notes}</p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-bold text-white">${expense.amount.toLocaleString()}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTogglePaid(expense.id)}
                      className={`p-1 rounded transition-all ${
                        expense.isPaid
                          ? 'text-neon-green bg-neon-green/20'
                          : 'text-gray-500 hover:text-neon-green'
                      }`}
                      title={expense.isPaid ? 'Mark as unpaid' : 'Mark as paid'}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="p-1 text-red-400 hover:text-red-300 transition-colors"
                      title="Delete expense"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
