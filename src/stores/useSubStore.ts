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
    isFetchingNextPage: false,

    getAll: async (params, isLoadMore = false) => {
        const merged = { ...get().filters, ...params };
        if (isLoadMore) {
            set({ isFetchingNextPage: true, error: null });
        } else {
            set({ isLoading: true, error: null });
        }
        try {
            const { data, meta, totalCost } = await subscriptionService.getAll(merged);
            console.log("TOTAL COST: ", totalCost);
            set({
                subscriptions: isLoadMore ? [...get().subscriptions, ...data] : data,
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
            set({ isLoading: false, isFetchingNextPage: false });
        }
    },


    loadMore: () => {
        const { pagination, isFetchingNextPage, isLoading } = get();
        if (isLoading || isFetchingNextPage || pagination.page >= pagination.lastPage) {
            return;
        }

        const nextPage = pagination.page + 1;
        const newFilters = { ...get().filters, page: nextPage };
        set({ filters: newFilters });
        get().getAll(newFilters, true);

    },

    setFilter: (key, value) => {
        const newFilters = { ...get().filters, [key]: value, page: 1 };
        set({ filters: newFilters });
        get().getAll(newFilters, false);
    },

    resetFilters: () => {
        set({ filters: { ...DEFAULT_FILTERS } });
        get().getAll({ ...DEFAULT_FILTERS }, false);
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
            const reserFilters = { ...get().filters, page: 1 };
            set({ filters: reserFilters })
            get().getAll(reserFilters, false);
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
            const reserFilters = { ...get().filters, page: 1 };
            set({ filters: reserFilters })
            get().getAll(reserFilters, false);
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
            const reserFilters = { ...get().filters, page: 1 };
            set({ filters: reserFilters })
            get().getAll(reserFilters, false);
            toast.success('Xoá thành công!');
        } catch (error) {
            set({ error: 'Xoá subscription thất bại' });
            toast.error('Xoá thất bại!');
        } finally {
            set({ isLoading: false });
        }
    },

}));


