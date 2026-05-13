import { type ChangePasswordRequest, type LoginRequest, type RegisterRequest, type ResetPasswordRequest, type User } from './auth.ts';
import type { CreateNotebookRequest, UpdateNotebookRequest, CreatePromiseRequest, UpdatePromiseRequest, CreateSubscriptionRequest, UpdateSubscriptionRequest } from './request.ts';


export interface Notebook {
    id: number;
    user_id: number;
    title: string;
    content: string;
    category: string;
    createdAt: string;
}

export interface Subscription {
    id: number;
    user_id: number;
    service_name: string;
    price: number;
    status: 'active' | 'inactive' | 'cancelled';
    billing_cycle: string,
    next_billing_date: string,
    alert_message: string,
    is_red_alert: boolean,
    color_code: string,
    notes: string,
}


export interface PromiseItem {
    id: number;
    user_id: number;
    promiser_name: string;
    promise_content: string;
    date_made: string;
    status: 'pending' | 'completed' | 'cancelled';
    deadline?: string;
    importance_level: number;

}

export interface AuthState {
    token: string | null;
    user: User | null;
    isLoading: boolean;
    err: string | null;

    login: (credentials: LoginRequest) => Promise<void>;
    register: (credentials: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
    fetchMe: () => Promise<void>;
    refresh: () => Promise<void>;
    changePassword: (credentials: ChangePasswordRequest) => Promise<void>;
    resetPassword: (data: ResetPasswordRequest) => Promise<void>;

    setToken: (token: string) => void;
    setUser: (user: User) => void;
    clearState: () => void;
    clearError: () => void;
}

export interface NotebookState {
    notebooks: Notebook[];
    currentNotebook: Notebook | null;
    isLoading: boolean;
    error: string | null;

    getAll: () => Promise<void>;
    getById: (id: number) => Promise<void>;
    create: (data: CreateNotebookRequest) => Promise<void>;
    update: (id: number, data: UpdateNotebookRequest) => Promise<void>;
    delete: (id: number) => Promise<void>;


}

export interface PromiseState {
    promises: PromiseItem[];
    currentPromise: PromiseItem | null;
    isLoading: boolean;
    error: string | null;

    getAll: () => Promise<void>;
    getById: (id: number) => Promise<void>;
    create: (data: CreatePromiseRequest) => Promise<void>;
    update: (id: number, data: UpdatePromiseRequest) => Promise<void>;
    delete: (id: number) => Promise<void>;

}

export interface SubscriptionState {
    subscriptions: Subscription[];
    currentSubscription: Subscription | null;
    isLoading: boolean;
    error: string | null;

    getAll: () => Promise<void>;
    getById: (id: Number) => Promise<void>;
    create: (data: CreateSubscriptionRequest) => Promise<void>;
    update: (id: Number, data: UpdateSubscriptionRequest) => Promise<void>;
    delete: (id: number) => Promise<void>;
}










