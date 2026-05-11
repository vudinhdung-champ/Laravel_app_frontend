import { create } from 'zustand';
import type { NotebookState, Notebook } from '@/types/store';
import type { CreateNotebookRequest, UpdateNotebookRequest } from '@/types/request';
import { notebookService } from '@/services/notebookService';
import toast from 'react-hot-toast';

export const useNotebookStore = create<NotebookState>()((set) => ({
    notebooks: [],
    currentNotebook: null,
    isLoading: false,
    error: null,

    getAll: async () => {
        set({ isLoading: true, error: null });
        try {
            const notebooks = await notebookService.getAll();
            set({ notebooks });
        } catch (error) {
            set({ error: 'Không thể tải danh sách notebook' });
        } finally {
            set({ isLoading: false });
        }
    },

    getById: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            const notebook = await notebookService.getById(id);
            set({ currentNotebook: notebook });
        } catch (error) {
            set({ error: 'Không thể tải notebook' });
        } finally {
            set({ isLoading: false });
        }
    },

    create: async (data: CreateNotebookRequest) => {
        set({ isLoading: true, error: null });
        try {
            const notebook = await notebookService.create(data);
            set((state) => ({ notebooks: [notebook, ...state.notebooks] }));
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
            const updated = await notebookService.update(id, data);
            set((state) => ({
                notebooks: state.notebooks.map((n) => (n.id === id ? updated : n)),
                currentNotebook: updated,
            }));
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
            set((state) => ({
                notebooks: state.notebooks.filter((n) => n.id !== id),
            }));
            toast.success('Xoá thành công!');
        } catch (error) {
            set({ error: 'Xoá notebook thất bại' });
            toast.error('Xoá thất bại!');
        } finally {
            set({ isLoading: false });
        }
    },


}));
