import { type User } from './auth.ts';

export interface Notebook {
    id: number;
    user_id: number;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
}

export interface Subscription {
  id: number;
  user_id: number;
  title: string;
  price: number;
  status: 'active' | 'inactive' | 'cancelled';
  created_at: string;
  updated_at: string;
}


export interface PromiseItem {
  id: number;
  user_id: number;
  title: string;
  description: string;
  status: 'pending' | 'completed' | 'cancelled';
  deadline?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
    token: string | null;
    user: User | null;
    isLoading: boolean;
    error: string | null;
}

export interface NotebookState {
  notebooks: Notebook[];
  currentNotebook: Notebook | null;
  isLoading: boolean;
  error: string | null;
}

export interface PromiseState {
  promises: PromiseItem[];
  currentPromise: PromiseItem | null;
  isLoading: boolean;
  error: string | null;
}

export interface SubscriptionState {
  subscriptions: Subscription[];
  currentSubscription: Subscription | null;
  isLoading: boolean;
  error: string | null;
}










