import api from '@/lib/axios.ts';
import type { Subscription } from '@/types/store.ts';
import type { CreateSubscriptionRequest, UpdateSubscriptionRequest } from '@/types/request.ts';


export interface SubscriptionFilters {
    search?: string;
    status?: string;
    billingCycle?: number;
    page?: number;
    per_page?: number;
}


export const subscriptionService = {
    getAll: async (params?: SubscriptionFilters): Promise<{data: Subscription[]; meta: any}> => {
        const { data } = await api.get('/subscriptions', {params});
        return {data: data.data, meta: data.meta};

    },

    getById: async (id: number): Promise<Subscription> => {
        const { data } = await api.get(`/subscriptions/${id}`);
        return data.data;

    },

    create: async (credentials: CreateSubscriptionRequest): Promise<Subscription> => {
        const { data } = await api.post('/subscriptions', credentials);
        return data.data;

    },

    update: async (id: number, credentials: UpdateSubscriptionRequest): Promise<Subscription> => {
        const { data } = await api.put(`/subscriptions/${id}`, credentials);
        return data.data;

    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/subscriptions/${id}`);
    }


}


