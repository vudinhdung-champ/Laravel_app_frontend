import { create } from 'zustand';
import type { SubscriptionState, Pagination } from '@/types/store';
import type { CreateSubscriptionRequest, UpdateSubscriptionRequest } from '@/types/request';
import { subscriptionService } from '@/services/subscriptionService';
import type { SubscriptionFilters } from '@/services/subscriptionService';
import toast from 'react-hot-toast';

const DEFAULT_FILTERS: SubscriptionFilters = { search: '', status: '', page: 1, per_page: 6 };


export const useSubStore = create<SubscriptionState>()((set, get) => ({
    subscriptions: [],
    currentSubscription: null,
    isLoading: false,
    error: null,
    filters: { ...DEFAULT_FILTERS },
    pagination: { page: 1, lastPage: 1, total: 0 } as Pagination,
    totalMonthly: 0,
    totalYearly: 0,

    getAll: async (params) => {
        const merged = { ...get().filters, ...params };
        set({ isLoading: true, error: null });
        try {
            const { data, meta, totalCost } = await subscriptionService.getAll(merged);
            set({
                subscriptions: data,
                pagination: {
                    page: meta?.current_page ?? 1,
                    lastPage: meta?.last_page ?? 1,
                    total: meta?.total ?? data.length,
                },
                totalMonthly: totalCost.totalMonthly ?? 0,
                totalYearly: totalCost.totalYearly ?? 0,
            });
        } catch (error) {
            set({ error: 'Không thể tải danh sách subscription' });
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
            const subscription = await subscriptionService.getById(id);
            set({ currentSubscription: subscription });
        } catch (error) {
            set({ error: 'Không thể tải subscription' });
        } finally {
            set({ isLoading: false });
        }
    },

    create: async (data: CreateSubscriptionRequest) => {
        set({ isLoading: true, error: null });
        try {
            await subscriptionService.create(data);
            get().setPage(1);
            toast.success('Tạo subscription thành công!');
        } catch (error) {
            set({ error: 'Tạo subscription thất bại' });
            toast.error('Tạo subscription thất bại!');
        } finally {
            set({ isLoading: false });
        }
    },

    update: async (id: number, data: UpdateSubscriptionRequest) => {
        set({ isLoading: true, error: null });
        try {
            await subscriptionService.update(id, data);
            get().getAll();
            toast.success('Cập nhật thành công!');
        } catch (error) {
            set({ error: 'Cập nhật subscription thất bại' });
            toast.error('Cập nhật thất bại!');
        } finally {
            set({ isLoading: false });
        }
    },

    delete: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            await subscriptionService.delete(id);
            get().getAll();
            toast.success('Xoá thành công!');
        } catch (error) {
            set({ error: 'Xoá subscription thất bại' });
            toast.error('Xoá thất bại!');
        } finally {
            set({ isLoading: false });
        }
    },

}));


