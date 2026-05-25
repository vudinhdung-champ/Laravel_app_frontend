import { type ChangePasswordRequest, type LoginRequest, type RegisterRequest, type ResetPasswordRequest, type User } from './auth.ts';
import type { CreateNotebookRequest, UpdateNotebookRequest, CreatePromiseRequest, UpdatePromiseRequest, CreateSubscriptionRequest, UpdateSubscriptionRequest } from './request.ts';
import { SubscriptionStatus, PromiseStatus } from './constants.ts';
import type { NotebookFilters } from '@/services/notebookService.ts';
import type { PromiseFilters } from '@/services/promiseService.ts';
import type { SubscriptionFilters } from '@/services/subscriptionService.ts';


type PromiseStatusType = typeof PromiseStatus[keyof typeof PromiseStatus];

type SubscriptionStatusType = typeof SubscriptionStatus[keyof typeof SubscriptionStatus];

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
    serviceName: string;
    price: number;
    status: SubscriptionStatusType,
    billingCycle: string,
    nextBillingDate: string,
    alertMessage: string,
    isRedAlert: boolean,
    colorCode: string,
    notes: string,
}


export interface PromiseItem {
    id: number;
    user_id: number;
    promiserName: string;
    promiseContent: string;
    dateMade: string;
    status: PromiseStatusType;
    deadline?: string;
    importanceLevel: number;

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

export interface Pagination {
    page: number;
    lastPage: number;
    total: number;
}

export interface NotebookState {
    notebooks: Notebook[];
    currentNotebook: Notebook | null;
    isLoading: boolean;
    error: string | null;
    filters: NotebookFilters;
    pagination: Pagination;

    getAll: (params?: NotebookFilters) => Promise<void>;
    setFilter: (key: keyof NotebookFilters, value: any) => void;
    resetFilters: () => void;
    setPage: (page: number) => void;
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
    filters: PromiseFilters;
    pagination: Pagination;

    getAll: (params?: PromiseFilters) => Promise<void>;
    setFilter: (key: keyof PromiseFilters, value: any) => void;
    resetFilters: () => void;
    setPage: (page: number) => void;
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
    filters: SubscriptionFilters;
    pagination: Pagination;

    getAll: (params?: SubscriptionFilters) => Promise<void>;
    setFilter: (key: keyof SubscriptionFilters, value: any) => void;
    resetFilters: () => void;
    setPage: (page: number) => void;
    getById: (id: Number) => Promise<void>;
    create: (data: CreateSubscriptionRequest) => Promise<void>;
    update: (id: Number, data: UpdateSubscriptionRequest) => Promise<void>;
    delete: (id: number) => Promise<void>;
}










