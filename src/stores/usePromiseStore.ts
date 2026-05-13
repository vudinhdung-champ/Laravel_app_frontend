import { create } from 'zustand';
import type { PromiseState, PromiseItem } from '@/types/store';
import type { CreatePromiseRequest, UpdatePromiseRequest } from '@/types/request';
import { promiseService } from '@/services/promiseService';
import toast from 'react-hot-toast';

export const usePromiseStore = create<PromiseState>()((set) => ({
    promises: [],
    currentPromise: null,
    isLoading: false,
    error: null,

    getAll: async () => {
        set({ isLoading: true, error: null });
        try {
            const promises = await promiseService.getAll();
            set({ promises });
        } catch (error) {
            set({ error: 'Không thể tải danh sách promise' });
        } finally {
            set({ isLoading: false });
        }
    },

    getById: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            const promise = await promiseService.getById(id);
            set({ currentPromise: promise });
        } catch (error) {
            set({ error: 'Không thể tải promise' });
        } finally {
            set({ isLoading: false });
        }
    },

    create: async (data: CreatePromiseRequest) => {
        set({ isLoading: true, error: null });
        try {
            const promise = await promiseService.create(data);
            set((state) => ({ promises: [promise, ...state.promises] }));
            toast.success('Tạo promise thành công!');
        } catch (error) {
            set({ error: 'Tạo promise thất bại' });
            toast.error('Tạo promise thất bại!');
        } finally {
            set({ isLoading: false });
        }
    },

    update: async (id: number, data: UpdatePromiseRequest) => {
        set({ isLoading: true, error: null });
        try {
            const updated = await promiseService.update(id, data);
            set((state) => ({
                promises: state.promises.map((p) => (p.id === id ? updated : p)),
                currentPromise: updated,
            }));
            toast.success('Cập nhật thành công!');
        } catch (error) {
            set({ error: 'Cập nhật promise thất bại' });
            toast.error('Cập nhật thất bại!');
        } finally {
            set({ isLoading: false });
        }
    },

    delete: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            await promiseService.delete(id);
            set((state) => ({
                promises: state.promises.filter((p) => p.id !== id),
            }));
            toast.success('Xoá thành công!');
        } catch (error) {
            set({ error: 'Xoá promise thất bại' });
            toast.error('Xoá thất bại!');
        } finally {
            set({ isLoading: false });
        }
    },
}));
