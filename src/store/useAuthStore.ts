import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl?: string;
  createdAt: string;
}

interface AuthState {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  register: (name: string, email: string, password: string, role?: string) => Promise<{ success: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<AuthUser>) => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  currentUser: null,
  isAuthenticated: false,
  isLoading: true,

  initializeAuth: async () => {
    if (!isSupabaseConfigured) {
      set({ isLoading: false });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const user = session.user;
        const name = user.user_metadata?.name || user.email?.split('@')[0] || 'User';
        const role = user.user_metadata?.role || 'Systems Architect';
        
        set({
          currentUser: {
            id: user.id,
            email: user.email || '',
            name,
            role,
            createdAt: user.created_at || new Date().toISOString(),
          },
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ currentUser: null, isAuthenticated: false, isLoading: false });
      }

      supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const user = session.user;
          const name = user.user_metadata?.name || user.email?.split('@')[0] || 'User';
          const role = user.user_metadata?.role || 'Systems Architect';

          set({
            currentUser: {
              id: user.id,
              email: user.email || '',
              name,
              role,
              createdAt: user.created_at || new Date().toISOString(),
            },
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          set({ currentUser: null, isAuthenticated: false, isLoading: false });
        }
      });
    } catch {
      set({ isLoading: false });
    }
  },

  register: async (name, email, password, role = 'Architect / Engineer') => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password || !name) {
      return { success: false, error: 'All fields are required.' };
    }

    if (!isSupabaseConfigured) {
      // Fallback for unconfigured demo environment
      const newUser: AuthUser = {
        id: 'user_' + Date.now(),
        email: cleanEmail,
        name: name.trim(),
        role: role.trim() || 'Systems Designer',
        createdAt: new Date().toISOString(),
      };
      set({ currentUser: newUser, isAuthenticated: true });
      return { success: true };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            name: name.trim(),
            role: role.trim() || 'Systems Architect',
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const newUser: AuthUser = {
          id: data.user.id,
          email: cleanEmail,
          name: name.trim(),
          role: role.trim() || 'Systems Architect',
          createdAt: data.user.created_at || new Date().toISOString(),
        };
        set({ currentUser: newUser, isAuthenticated: true });
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'An error occurred during registration.' };
    }
  },

  login: async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      return { success: false, error: 'Email and password are required.' };
    }

    if (!isSupabaseConfigured) {
      // Fallback for demo mode
      const newUser: AuthUser = {
        id: 'user_demo',
        email: cleanEmail,
        name: cleanEmail.split('@')[0],
        role: 'Systems Architect',
        createdAt: new Date().toISOString(),
      };
      set({ currentUser: newUser, isAuthenticated: true });
      return { success: true };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const name = data.user.user_metadata?.name || cleanEmail.split('@')[0];
        const role = data.user.user_metadata?.role || 'Systems Architect';

        set({
          currentUser: {
            id: data.user.id,
            email: cleanEmail,
            name,
            role,
            createdAt: data.user.created_at || new Date().toISOString(),
          },
          isAuthenticated: true,
        });
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'An error occurred during sign in.' };
    }
  },

  logout: async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    set({ currentUser: null, isAuthenticated: false });
  },

  updateProfile: (updates) => {
    const { currentUser } = get();
    if (!currentUser) return;
    set({ currentUser: { ...currentUser, ...updates } });
  },
}));
