import { create } from 'zustand';
import type { NotebookState, Pagination } from '@/types/store';
import type { CreateNotebookRequest, UpdateNotebookRequest } from '@/types/request';
import { notebookService } from '@/services/notebookService';
import type { NotebookFilters } from '@/services/notebookService';
import toast from 'react-hot-toast';

const DEFAULT_FILTERS: NotebookFilters = { search: '', category: '', page: 1, per_page: 8 };


export const useNotebookStore = create<NotebookState>()((set, get) => ({
    notebooks: [],
    currentNotebook: null,
    isLoading: false,
    error: null,
    filters: { ...DEFAULT_FILTERS },
    pagination: { page: 1, lastPage: 1, total: 0 } as Pagination,

    getAll: async (params) => {
        const merged = { ...get().filters, ...params };
        set({ isLoading: true, error: null });
        try {
            const { data, meta } = await notebookService.getAll(merged);
            set({
                notebooks: data,
                pagination: {
                    page: meta?.current_page ?? 1,
                    lastPage: meta?.last_page ?? 1,
                    total: meta?.total ?? data.length,
                },
            });
        } catch {
            set({ error: 'Không thể tải danh sách notebook' });
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
            const notebook = await notebookService.getById(id);
            return notebook;
        } catch (error) {
            console.log("CHI TIẾT LỖI: ", error.response?.data);
            set({ error: 'Không thể tải notebook' });
        } finally {
            set({ isLoading: false });
        }
    },

    create: async (data: CreateNotebookRequest) => {
        set({ isLoading: true, error: null });
        try {
            await notebookService.create(data);
            get().setPage(1);
            toast.success('Tạo notebook thành công!');
        } catch (error) {
            set({ error: 'Tạo notebook thất bại' });
            toast.error('Tạo notebook thất bại!');
        } finally {
            set({ isLoading: false });
        }
    },

    update: async (id: number, data: UpdateNotebookRequest) => {
        set({ isLoading: true, error: null });
        try {
            await notebookService.update(id, data);
            get().getAll();
            toast.success('Cập nhật thành công!');
        } catch (error) {
            set({ error: 'Cập nhật notebook thất bại' });
            toast.error('Cập nhật thất bại!');
        } finally {
            set({ isLoading: false });
        }
    },

    delete: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            await notebookService.delete(id);
            get().getAll();
            toast.success('Xoá thành công!');
        } catch (error) {
            set({ error: 'Xoá notebook thất bại' });
            toast.error('Xoá thất bại!');
        } finally {
            set({ isLoading: false });
        }
    },


}));
