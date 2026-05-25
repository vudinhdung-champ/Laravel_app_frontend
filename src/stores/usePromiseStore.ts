import { create } from 'zustand';
import type { PromiseState, PromiseItem, Pagination } from '@/types/store';
import type { CreatePromiseRequest, UpdatePromiseRequest } from '@/types/request';
import { promiseService } from '@/services/promiseService';
import type { PromiseFilters } from '@/services/promiseService';
import toast from 'react-hot-toast';

const DEFAULT_FILTERS: PromiseFilters = { search: '', status: '', page: 1, per_page: 6 };


export const usePromiseStore = create<PromiseState>()((set, get) => ({
    promises: [],
    currentPromise: null,
    isLoading: false,
    error: null,
    filters: { ...DEFAULT_FILTERS },
    pagination: { page: 1, lastPage: 1, total: 0 } as Pagination,

    getAll: async (params) => {
        const merged = { ...get().filters, ...params };
        set({ isLoading: true, error: null });
        try {
            const { data, meta } = await promiseService.getAll(merged);
            set({
                promises: data,
                pagination: {
                    page: meta?.current_page ?? 1,
                    lastPage: meta?.last_page ?? 1,
                    total: meta?.total ?? data.length,
                }
            });
        } catch (error) {
            set({ error: 'Không thể tải danh sách promise' });
        } finally {
            set({ isLoading: false });
        }
    },

    setFilter: (key, value) => {
        const newFilters = { ...get().filters, [key]: value, page: 1 };
        set({ filters: newFilters });
        get().getAll(newFilters);
    },

    resetFilters: () => {
        set({ filters: { ...DEFAULT_FILTERS } });
        get().getAll({ ...DEFAULT_FILTERS });
    },

    setPage: (page) => {
        const newFilters = { ...get().filters, page };
        set({ filters: newFilters });
        get().getAll(newFilters);
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
