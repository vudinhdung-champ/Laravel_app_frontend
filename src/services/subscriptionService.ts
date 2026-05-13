import api from '@/lib/axios.ts';
import type { Subscription } from '@/types/store.ts';
import type { CreateSubscriptionRequest, UpdateSubscriptionRequest } from '@/types/request.ts';


export const subscriptionService = {
    getAll: async(): Promise<Subscription[]> => {
        const { data } = await api.get('/subscriptions');
        return data;

    },

    getById: async(id: number): Promise<Subscription> => {
        const { data } = await api.get(`/subscriptions/${id}`);
        return data;

    },

    create: async(credentials: CreateSubscriptionRequest): Promise<Subscription> => {
        const { data } = await api.post('/subscriptions', credentials);
        return data;

    },

    update: async (id: number, credentials: UpdateSubscriptionRequest): Promise<Subscription> => {
        const { data } = await api.put(`/subscriptions/${id}`, credentials);
        return data;

    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/subscriptions/${id}`);
    }


}


