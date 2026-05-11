import api from '@/lib/axios.ts';
import type { Notebook } from '@/types/store.ts';
import type { CreateNotebookRequest, UpdateNotebookRequest } from '@/types/request';

export const notebookService = {
    getAll: async (): Promise<Notebook[]> => {
        const { data } = await api.get('/notebooks');
        return data;
    },

    getById: async (id: number): Promise<Notebook> => {
        const { data } = await api.get(`/notebooks/${id}`);
        return data;        

    },

    create: async(credentials: CreateNotebookRequest): Promise<Notebook> => {
        const { data } = await api.post('/notebooks', credentials);
        return data;

    },

    update: async (id: number, notebook: UpdateNotebookRequest): Promise<Notebook> => {
        const { data } = await api.put(`/notebooks/${id}`, notebook);
        return data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/notebooks/${id}`);

    }

}

