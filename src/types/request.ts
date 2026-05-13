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
  promiser_name: string;
  promise_content: string;
  date_made: string;
  status: 'pending' | 'completed' | 'cancelled';
  deadline?: string;
  importance_level: number;
}

export interface UpdatePromiseRequest {
  promiser_name?: string;
  promise_content?: string;
  date_made?: string;
  status?: 'pending' | 'completed' | 'cancelled';
  deadline?: string;
  importance_level?: number;
}

// Subscription request // 

export interface CreateSubscriptionRequest {
  service_name: string;
  price: number;
  status: 'active' | 'inactive' | 'cancelled';
  billing_cycle: string;
  next_billing_date: string;
  notes: string;
}

export interface UpdateSubscriptionRequest {
  service_name?: string;
  price?: number;
  status?: 'active' | 'inactive' | 'cancelled';
  billing_cycle?: string;
  next_billing_date?: string;
  notes?: string;
}

