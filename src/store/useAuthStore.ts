import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl?: string;
  createdAt: string;
}

interface StoredAccount {
  passwordHash: string;
  user: AuthUser;
}

interface AuthState {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  registeredUsers: Record<string, StoredAccount>; // Keyed by email.toLowerCase()

  register: (name: string, email: string, password: string, role?: string) => { success: boolean; error?: string };
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (updates: Partial<AuthUser>) => void;
}

// Simple deterministic string hash for local password storage security
const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'h_' + Math.abs(hash).toString(36);
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,
      registeredUsers: {},

      register: (name, email, password, role = 'Architect / Engineer') => {
        const cleanEmail = email.trim().toLowerCase();
        if (!cleanEmail || !password || !name) {
          return { success: false, error: 'All fields are required.' };
        }

        const { registeredUsers } = get();
        if (registeredUsers[cleanEmail]) {
          return { success: false, error: 'An account with this email already exists. Please log in.' };
        }

        const newUser: AuthUser = {
          id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          email: cleanEmail,
          name: name.trim(),
          role: role.trim() || 'Systems Designer',
          createdAt: new Date().toISOString(),
        };

        const newAccount: StoredAccount = {
          passwordHash: simpleHash(password),
          user: newUser,
        };

        set({
          registeredUsers: {
            ...registeredUsers,
            [cleanEmail]: newAccount,
          },
          currentUser: newUser,
          isAuthenticated: true,
        });

        return { success: true };
      },

      login: (email, password) => {
        const cleanEmail = email.trim().toLowerCase();
        if (!cleanEmail || !password) {
          return { success: false, error: 'Email and password are required.' };
        }

        const { registeredUsers } = get();
        const account = registeredUsers[cleanEmail];

        if (!account) {
          return { success: false, error: 'No account found with this email. Please sign up.' };
        }

        if (account.passwordHash !== simpleHash(password)) {
          return { success: false, error: 'Incorrect password. Please try again.' };
        }

        set({
          currentUser: account.user,
          isAuthenticated: true,
        });

        return { success: true };
      },

      logout: () => {
        set({
          currentUser: null,
          isAuthenticated: false,
        });
      },

      updateProfile: (updates) => {
        const { currentUser, registeredUsers } = get();
        if (!currentUser) return;

        const updatedUser = { ...currentUser, ...updates };
        const cleanEmail = currentUser.email;

        const updatedAccount = registeredUsers[cleanEmail]
          ? { ...registeredUsers[cleanEmail], user: updatedUser }
          : undefined;

        set({
          currentUser: updatedUser,
          registeredUsers: updatedAccount
            ? { ...registeredUsers, [cleanEmail]: updatedAccount }
            : registeredUsers,
        });
      },
    }),
    {
      name: 'momentum_os_auth_registry_v1',
    }
  )
);
