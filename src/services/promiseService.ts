import api from '@/lib/axios.ts';
import type { PromiseItem } from '@/types/store.ts';
import type { CreatePromiseRequest, UpdatePromiseRequest } from '@/types/request.ts';


export const promiseService = {
    getAll: async(): Promise<PromiseItem[]> => {
        const { data } = await api.get('/promises');
        return data;

    },

    getById: async(id: number): Promise<PromiseItem> => {
        const { data } = await api.get(`/promises/${id}`);
        return data;

    },

    create: async(credentials: CreatePromiseRequest): Promise<PromiseItem> => {
        const { data } = await api.post('/promises', credentials);
        return data;

    },

    update: async (id: number, promise: UpdatePromiseRequest): Promise<PromiseItem> => {
        const { data } = await api.put(`/promises/${id}`, promise);
        return data;

    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/promises/${id}`);
    }

}