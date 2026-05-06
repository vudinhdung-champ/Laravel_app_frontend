// Notebook requests //
export interface CreateNotebookRequest {
  title: string;
  content: string;
}

export interface UpdateNotebookRequest {
  title?: string;
  content?: string;
}

// Promise request //

export interface CreatePromiseRequest {
  title: string;
  description: string;
  status: 'pending' | 'completed' | 'cancelled';
  deadline?: string;
}

export interface UpdatePromiseRequest {
  title?: string;
  description?: string;
  status?: 'pending' | 'completed' | 'cancelled';
  deadline?: string;
}

// Subscription request // 

export interface CreateSubscriptionRequest {
  title: string;
  price: number;
  status: 'active' | 'inactive' | 'cancelled';
}

export interface UpdateSubscriptionRequest {
  title?: string;
  price?: number;
  status?: 'active' | 'inactive' | 'cancelled';
}

