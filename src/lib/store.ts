import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  addUser: (user: User) => void;
  updateUser: (userId: string, updatedUser: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  login: (userId: string, password: string) => boolean;
  logout: () => void;
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
    }),
    {
      name: 'dhani-finance-storage',
    }
  )
);

export default useStore;