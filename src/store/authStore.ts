import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  clearError: () => void;
}

const getUserType = (username: string) => {
  if (username === 'standard_user') return 'standard';
  if (username === 'locked_out_user') return 'locked_out';
  if (username === 'problem_user') return 'problem';
  if (username === 'performance_glitch_user') return 'performance_glitch';
  if (username === 'error_user') return 'error';
  if (username === 'visual_user') return 'visual';
  return 'standard';
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  login: (username, password) => {
    // Clear any previous errors
    set({ error: null });

    // Check if username is valid
    const validUsernames = [
      'standard_user',
      'locked_out_user',
      'problem_user',
      'performance_glitch_user',
      'error_user',
      'visual_user'
    ];

    if (!validUsernames.includes(username)) {
      set({ error: 'Username is invalid' });
      return false;
    }

    // Check if password is correct
    if (password !== 'secret_sauce') {
      set({ error: 'Password is incorrect' });
      return false;
    }

    // Handle locked out user
    if (username === 'locked_out_user') {
      set({ error: 'User is locked out.' });
      return false;
    }

    // Set user and authentication state
    set({
      user: {
        username,
        type: getUserType(username)
      },
      isAuthenticated: true,
      error: null
    });
    
    return true;
  },
  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      error: null
    });
  },
  clearError: () => {
    set({ error: null });
  }
}));