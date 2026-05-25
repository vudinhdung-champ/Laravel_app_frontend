import { PromiseStatus, SubscriptionStatus } from './constants.ts';


type PromiseStatusType = typeof PromiseStatus[keyof typeof PromiseStatus];

type SubscriptionStatusType = typeof SubscriptionStatus[keyof typeof SubscriptionStatus];
// Notebook requests //
export interface CreateNotebookRequest {
  title: string;
  content: string;
  category: string;
}

export interface UpdateNotebookRequest {
  title?: string;
  content?: string;
  category?: string;
}

// Promise request //

export interface CreatePromiseRequest {
  promiserName: string;
  promiseContent: string;
  dateMade: string;
  status: PromiseStatusType;
  deadline?: string;
  importanceLevel: number;
}

export interface UpdatePromiseRequest {
  promiserName?: string;
  promiseContent?: string;
  dateMade?: string;
  status?: PromiseStatusType;
  deadline?: string;
  importanceLevel?: number;
}

// Subscription request // 

export interface CreateSubscriptionRequest {
  serviceName: string;
  price: number;
  status: SubscriptionStatusType;
  billingCycle: string;
  nextBillingDate: string;
  notes: string;
}

export interface UpdateSubscriptionRequest {
  serviceName?: string;
  price?: number;
  status?: SubscriptionStatusType;
  billingCycle?: string;
  nextBillingDate?: string;
  notes?: string;
}

