import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Transaction {
  description: string;
  amount: number;
  userId: string;
}

interface User {
  userId: string;
  password?: string;
  isAdmin: boolean;
  accountName?: string;
  accountNumber?: string;
  accountType?: string;
  balance?: number;
  bankAccount?: string;
}

interface UserStore {
  users: User[];
  currentUser: User | null;
  transactions: Transaction[];
  addUser: (user: User) => void;
  updateUser: (userId: string, updatedUser: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  login: (userId: string, password: string) => boolean;
  logout: () => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (index: number, transaction: Transaction) => void;
  deleteTransaction: (index: number) => void;
  getTransactionsForUser: (userId: string) => Transaction[];
}

const useStore = create<UserStore>()(
  persist(
    (set, get) => ({
      users: [
        {
          userId: '9899654695',
          password: '4695',
          isAdmin: true,
          accountName: 'Admin',
        },
        {
          userId: '8285529684',
          password: '8285529684',
          isAdmin: false,
          accountName: 'Kos',
          accountNumber: '8277525333',
          accountType: 'Loan Account',
          balance: 500000,
          bankAccount: 'XXXXXXXXX0595',
        },
      ],
      transactions: [
        {
          description: 'Transfer to Saving Account',
          amount: 0,
          userId: '8285529684'
        },
        {
          description: 'Deposit',
          amount: 500000,
          userId: '8285529684'
        },
        {
          description: 'Loan Amount Paid',
          amount: 0,
          userId: '8285529684'
        },
        {
          description: 'ATM Withdrawal',
          amount: 0,
          userId: '8285529684'
        },
      ],
      currentUser: null,
      addUser: (user) => {
        const users = get().users;
        if (users.some((u) => u.userId === user.userId)) {
          throw new Error('User ID already exists');
        }
        set((state) => ({
          users: [...state.users, user],
        }));
      },
      updateUser: (userId, updatedUser) => {
        set((state) => ({
          users: state.users.map((user) =>
            user.userId === userId ? { ...user, ...updatedUser } : user
          ),
        }));
      },
      deleteUser: (userId) => {
        set((state) => ({
          users: state.users.filter((user) => user.userId !== userId),
          transactions: state.transactions.filter((t) => t.userId !== userId),
        }));
      },
      login: (userId, password) => {
        const user = get().users.find((u) => u.userId === userId);
        if (user && (user.password === password || (user.isAdmin && password === '4695'))) {
          set({ currentUser: user });
          return true;
        }
        return false;
      },
      logout: () => set({ currentUser: null }),
      addTransaction: (transaction) => {
        set((state) => ({
          transactions: [...state.transactions, transaction],
        }));
      },
      updateTransaction: (index, transaction) => {
        set((state) => ({
          transactions: state.transactions.map((t, i) =>
            i === index ? transaction : t
          ),
        }));
      },
      deleteTransaction: (index) => {
        set((state) => ({
          transactions: state.transactions.filter((_, i) => i !== index),
        }));
      },
      getTransactionsForUser: (userId) => {
        return get().transactions.filter((t) => t.userId === userId);
      },
    }),
    {
      name: 'dhani-finance-storage',
    }
  )
);

export default useStore;