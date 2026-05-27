import api from '@/lib/axios.ts';
import type { PromiseItem } from '@/types/store.ts';
import type { CreatePromiseRequest, UpdatePromiseRequest } from '@/types/request.ts';


export interface PromiseFilters {
    search?: string;
    status?: string;
    importance_level?: number;
    page?: number;
    per_page?: number;
}


export const promiseService = {
    getAll: async (params?: PromiseFilters): Promise<{data: PromiseItem[]; meta: any}> => {
        const { data } = await api.get('/promises', {params});
        return {data: data.data, meta: data.meta};

    },

    getById: async (id: number): Promise<PromiseItem> => {
        const { data } = await api.get(`/promises/${id}`);
        return data.data;

    },

    create: async (credentials: CreatePromiseRequest): Promise<PromiseItem> => {
        const { data } = await api.post('/promises', credentials);
        return data.data;

    },

    update: async (id: number, promise: UpdatePromiseRequest): Promise<PromiseItem> => {
        const { data } = await api.put(`/promises/${id}`, promise);
        return data.data;

    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/promises/${id}`);
    }

}