import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IndianRupee, LogOut, Users, X, Eye, EyeOff, ChevronDown, ChevronUp, Plus, Minus } from 'lucide-react';
import useStore from '../lib/store';

interface EditUserForm {
  accountName: string;
  accountType: string;
  balance: number;
  accountNumber: string;
  bankAccount: string;
}

interface AddUserForm {
  userId: string;
  password: string;
  accountName: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  bankAccount: string;
  initialDeposit: number;
}

interface Transaction {
  description: string;
  amount: number;
  userId: string;
}

function AdminDashboard() {
  const navigate = useNavigate();
  const { users, logout, updateUser, deleteUser, addUser, transactions, addTransaction, updateTransaction, deleteTransaction } = useStore();
  const nonAdminUsers = users.filter(user => !user.isAdmin);

  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditUserForm>({
    accountName: '',
    accountType: '',
    balance: 0,
    accountNumber: '',
    bankAccount: '',
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [addForm, setAddForm] = useState<AddUserForm>({
    userId: '',
    password: '',
    accountName: '',
    accountNumber: '',
    accountType: '',
    balance: 0,
    bankAccount: '',
    initialDeposit: 0,
  });

  const [transactionForm, setTransactionForm] = useState<Transaction>({
    description: '',
    amount: 0,
    userId: '',
  });

  const [editingTransaction, setEditingTransaction] = useState<number | null>(null);
  const [editTransactionForm, setEditTransactionForm] = useState<Transaction>({
    description: '',
    amount: 0,
    userId: '',
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleEdit = (user: any) => {
    setEditingUser(user.userId);
    setEditForm({
      accountName: user.accountName || '',
      accountType: user.accountType || '',
      balance: user.balance || 0,
      accountNumber: user.accountNumber || '',
      bankAccount: user.bankAccount || '',
    });
  };

  const handleSaveEdit = (userId: string) => {
    updateUser(userId, editForm);
    setEditingUser(null);
  };

  const handleDelete = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newUser = {
        userId: addForm.userId,
        password: addForm.password,
        accountName: addForm.accountName,
        accountNumber: addForm.accountNumber,
        accountType: addForm.accountType,
        balance: addForm.initialDeposit, // Set initial balance from deposit
        bankAccount: addForm.bankAccount,
        isAdmin: false,
      };
      
      addUser(newUser);
      
      // Add initial deposit transaction if amount > 0
      if (addForm.initialDeposit > 0) {
        addTransaction({
          description: 'Initial Deposit',
          amount: addForm.initialDeposit,
          userId: addForm.userId,
        });
      }
      
      setShowAddModal(false);
      setAddForm({
        userId: '',
        password: '',
        accountName: '',
        accountNumber: '',
        accountType: '',
        balance: 0,
        bankAccount: '',
        initialDeposit: 0,
      });
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleAddTransaction = (userId: string, e: React.FormEvent) => {
    e.preventDefault();
    addTransaction({ ...transactionForm, userId });
    setTransactionForm({
      description: '',
      amount: 0,
      userId: '',
    });
  };

  const handleEditTransaction = (index: number, transaction: Transaction) => {
    setEditingTransaction(index);
    setEditTransactionForm(transaction);
  };

  const handleSaveTransaction = (index: number) => {
    updateTransaction(index, editTransactionForm);
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (index: number) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(index);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <IndianRupee className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold">Dhani-Finance Admin</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-5 h-5 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Users className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">Registered Users</h2>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add New User
              </button>
            </div>

            <div className="overflow-x-auto">
              {nonAdminUsers.map((user) => (
                <div key={user.userId} className="mb-8 border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-4">
                    <div className="grid grid-cols-7 gap-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.userId}
                      </div>
                      <div className="text-sm text-gray-500">
                        {editingUser === user.userId ? (
                          <input
                            type="text"
                            value={editForm.accountName}
                            onChange={(e) => setEditForm({ ...editForm, accountName: e.target.value })}
                            className="border rounded px-2 py-1 w-full"
                          />
                        ) : (
                          user.accountName
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {editingUser === user.userId ? (
                          <input
                            type="text"
                            value={editForm.accountNumber}
                            onChange={(e) => setEditForm({ ...editForm, accountNumber: e.target.value })}
                            className="border rounded px-2 py-1 w-full"
                          />
                        ) : (
                          user.accountNumber
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {editingUser === user.userId ? (
                          <input
                            type="text"
                            value={editForm.accountType}
                            onChange={(e) => setEditForm({ ...editForm, accountType: e.target.value })}
                            className="border rounded px-2 py-1 w-full"
                          />
                        ) : (
                          user.accountType
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {editingUser === user.userId ? (
                          <input
                            type="number"
                            value={editForm.balance}
                            onChange={(e) => setEditForm({ ...editForm, balance: Number(e.target.value) })}
                            className="border rounded px-2 py-1 w-full"
                          />
                        ) : (
                          `₹ ${user.balance?.toLocaleString()}`
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {editingUser === user.userId ? (
                          <input
                            type="text"
                            value={editForm.bankAccount}
                            onChange={(e) => setEditForm({ ...editForm, bankAccount: e.target.value })}
                            className="border rounded px-2 py-1 w-full"
                          />
                        ) : (
                          user.bankAccount
                        )}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center space-x-2">
                        {editingUser === user.userId ? (
                          <button
                            onClick={() => handleSaveEdit(user.userId)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(user.userId)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setExpandedUser(expandedUser === user.userId ? null : user.userId)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          {expandedUser === user.userId ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {expandedUser === user.userId && (
                    <div className="p-4 bg-white">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Transactions</h3>
                        <form onSubmit={(e) => handleAddTransaction(user.userId, e)} className="flex gap-4 mb-4">
                          <input
                            type="text"
                            value={transactionForm.description}
                            onChange={(e) => setTransactionForm({ ...transactionForm, description: e.target.value })}
                            placeholder="Transaction description"
                            className="flex-1 border rounded-md px-3 py-2"
                            required
                          />
                          <input
                            type="number"
                            value={transactionForm.amount}
                            onChange={(e) => setTransactionForm({ ...transactionForm, amount: Number(e.target.value) })}
                            placeholder="Amount"
                            className="w-32 border rounded-md px-3 py-2"
                            required
                          />
                          <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                          >
                            Add
                          </button>
                        </form>
                      </div>
                      
                      <div className="space-y-2">
                        {transactions
                          .filter(t => t.userId === user.userId)
                          .map((transaction, index) => (
                            <div key={index} className="flex justify-between items-center py-2 border-b">
                              {editingTransaction === index ? (
                                <div className="flex-1 flex gap-4">
                                  <input
                                    type="text"
                                    value={editTransactionForm.description}
                                    onChange={(e) => setEditTransactionForm({
                                      ...editTransactionForm,
                                      description: e.target.value
                                    })}
                                    className="flex-1 border rounded-md px-3 py-2"
                                  />
                                  <input
                                    type="number"
                                    value={editTransactionForm.amount}
                                    onChange={(e) => setEditTransactionForm({
                                      ...editTransactionForm,
                                      amount: Number(e.target.value)
                                    })}
                                    className="w-32 border rounded-md px-3 py-2"
                                  />
                                  <button
                                    onClick={() => handleSaveTransaction(index)}
                                    className="text-green-600 hover:text-green-900 px-4"
                                  >
                                    Save
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <span className="text-gray-900">{transaction.description}</span>
                                  <div className="flex items-center space-x-4">
                                    <span className={`font-medium ${
                                      transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'
                                    }`}>
                                      {transaction.amount > 0 ? '+ ' : ''}₹ {transaction.amount.toLocaleString()}
                                    </span>
                                    <button
                                      onClick={() => handleEditTransaction(index, transaction)}
                                      className="text-blue-600 hover:text-blue-900"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeleteTransaction(index)}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New User</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Mobile Number (User ID)</label>
                <input
                  type="text"
                  required
                  pattern="[0-9]{10}"
                  value={addForm.userId}
                  onChange={(e) => setAddForm({ ...addForm, userId: e.target.value })}
                  className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
                  placeholder="10-digit mobile number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={4}
                    value={addForm.password}
                    onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                    className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 pr-10"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Name</label>
                <input
                  type="text"
                  required
                  value={addForm.accountName}
                  onChange={(e) => setAddForm({ ...addForm, accountName: e.target.value })}
                  className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Number</label>
                <input
                  type="text"
                  required
                  value={addForm.accountNumber}
                  onChange={(e) => setAddForm({ ...addForm, accountNumber: e.target.value })}
                  className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Type</label>
                <input
                  type="text"
                  required
                  value={addForm.accountType}
                  onChange={(e) => setAddForm({ ...addForm, accountType: e.target.value })}
                  className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Initial Deposit</label>
                <input
                  type="number"
                  required
                  value={addForm.initialDeposit}
                  onChange={(e) => setAddForm({ ...addForm, initialDeposit: Number(e.target.value) })}
                  className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
                  placeholder="Enter initial deposit amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bank Account</label>
                <input
                  type="text"
                  required
                  value={addForm.bankAccount}
                  onChange={(e) => setAddForm({ ...addForm, bankAccount: e.target.value })}
                  className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add User
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;