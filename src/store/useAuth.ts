import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  memberSince?: string;
  isAdmin?: boolean;
}

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isInitialized: boolean;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<UserProfile>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updatedProfile: { name: string; phone: string }) => Promise<void>;
}

interface MockUserRecord {
  profile: UserProfile;
  passwordHash: string; // simple plain text password for mock
}

const DEFAULT_MOCK_USER: MockUserRecord = {
  profile: {
    id: 'mock-amit',
    name: 'Amit Sharma',
    email: 'amit.sharma@example.com',
    phone: '+91 98765 98765',
    memberSince: 'January 2026',
    isAdmin: true,
  },
  passwordHash: 'password123',
};

// Helper to get mock users from localStorage safely on client side
const getMockUsers = (): MockUserRecord[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('rainbow-mock-users');
  if (!stored) {
    const defaultList = [DEFAULT_MOCK_USER];
    localStorage.setItem('rainbow-mock-users', JSON.stringify(defaultList));
    return defaultList;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return [DEFAULT_MOCK_USER];
  }
};

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isInitialized: false,

  initialize: async () => {
    if (get().isInitialized) return;
    set({ isLoading: true });

    if (isSupabaseConfigured) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          // Fetch additional profile data
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin, phone')
            .eq('id', session.user.id)
            .maybeSingle();

          set({
            user: {
              id: session.user.id,
              name: session.user.user_metadata?.full_name || session.user.email || '',
              email: session.user.email || '',
              phone: profile?.phone || session.user.user_metadata?.phone || '',
              memberSince: new Date(session.user.created_at).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              }),
              isAdmin: profile?.is_admin || false,
            },
          });
        }

        // Set up subscription
        supabase.auth.onAuthStateChange(async (_event, session) => {
          if (session && session.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('is_admin, phone')
              .eq('id', session.user.id)
              .maybeSingle();

            set({
              user: {
                id: session.user.id,
                name: session.user.user_metadata?.full_name || session.user.email || '',
                email: session.user.email || '',
                phone: profile?.phone || session.user.user_metadata?.phone || '',
                memberSince: new Date(session.user.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                }),
                isAdmin: profile?.is_admin || false,
              },
              isLoading: false,
            });
          } else {
            set({ user: null, isLoading: false });
          }
        });
      } catch (error) {
        console.error('Error initializing Supabase auth:', error);
      } finally {
        set({ isInitialized: true, isLoading: false });
      }
    } else {
      // Mock flow
      if (typeof window !== 'undefined') {
        // Seed default mock user if necessary
        getMockUsers();
        
        const sessionStr = localStorage.getItem('rainbow-auth-session');
        if (sessionStr) {
          try {
            const user = JSON.parse(sessionStr);
            set({ user });
          } catch {
            localStorage.removeItem('rainbow-auth-session');
          }
        }
      }
      set({ isInitialized: true, isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      if (isSupabaseConfigured) {
        const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        if (!authData.user) throw new Error('No user returned from authentication.');

        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin, phone')
          .eq('id', authData.user.id)
          .maybeSingle();

        const loggedInUser: UserProfile = {
          id: authData.user.id,
          name: authData.user.user_metadata?.full_name || authData.user.email || '',
          email: authData.user.email || '',
          phone: profile?.phone || authData.user.user_metadata?.phone || '',
          memberSince: new Date(authData.user.created_at).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          }),
          isAdmin: profile?.is_admin || false,
        };

        set({ user: loggedInUser });
        return loggedInUser;
      } else {
        // Mock flow login validation
        await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate networking delay
        const users = getMockUsers();
        const found = users.find(
          (u) => u.profile.email.toLowerCase() === email.toLowerCase() && u.passwordHash === password
        );
        
        if (!found) {
          throw new Error('Invalid email or password. Hint: Use amit.sharma@example.com / password123');
        }

        localStorage.setItem('rainbow-auth-session', JSON.stringify(found.profile));
        set({ user: found.profile });
        return found.profile;
      }
    } finally {
      set({ isLoading: false });
    }
  },

  signup: async (name, email, password) => {
    set({ isLoading: true });
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
      } else {
        // Mock flow signup validation
        await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate networking delay
        const users = getMockUsers();
        const exists = users.some((u) => u.profile.email.toLowerCase() === email.toLowerCase());
        if (exists) {
          throw new Error('An account with this email already exists.');
        }

        const newUser: UserProfile = {
          id: Math.random().toString(36).substring(2, 9),
          name,
          email,
          phone: '',
          memberSince: new Date().toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          }),
        };

        const newRecord: MockUserRecord = {
          profile: newUser,
          passwordHash: password,
        };

        localStorage.setItem('rainbow-mock-users', JSON.stringify([...users, newRecord]));
        localStorage.setItem('rainbow-auth-session', JSON.stringify(newUser));
        set({ user: newUser });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      } else {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('rainbow-auth-session');
        }
      }
      set({ user: null });
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (updatedProfile) => {
    const currentUser = get().user;
    if (!currentUser) throw new Error('No user is currently logged in.');

    set({ isLoading: true });
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.updateUser({
          data: {
            full_name: updatedProfile.name,
            phone: updatedProfile.phone,
          },
        });
        if (error) throw error;

        set({
          user: {
            ...currentUser,
            name: updatedProfile.name,
            phone: updatedProfile.phone,
          },
        });
      } else {
        // Mock profile update
        await new Promise((resolve) => setTimeout(resolve, 600));
        const updatedUser: UserProfile = {
          ...currentUser,
          name: updatedProfile.name,
          phone: updatedProfile.phone,
        };

        // Update database lists
        const users = getMockUsers();
        const updatedUsers = users.map((u) => {
          if (u.profile.id === currentUser.id) {
            return {
              ...u,
              profile: updatedUser,
            };
          }
          return u;
        });

        if (typeof window !== 'undefined') {
          localStorage.setItem('rainbow-mock-users', JSON.stringify(updatedUsers));
          localStorage.setItem('rainbow-auth-session', JSON.stringify(updatedUser));
        }

        set({ user: updatedUser });
      }
    } finally {
      set({ isLoading: false });
    }
  },
}));
