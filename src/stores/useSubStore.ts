import { create } from 'zustand';
import type { SubscriptionState, Subscription } from '@/types/store';
import type { CreateSubscriptionRequest, UpdateSubscriptionRequest } from '@/types/request';
import { subscriptionService } from '@/services/subscriptionService';
import toast from 'react-hot-toast';

export const useSubStore = create<SubscriptionState>()((set) => ({
    subscriptions: [],
    currentSubscription: null,
    isLoading: false,
    error: null,

    getAll: async () => {
        set({ isLoading: true, error: null });
        try {
            const subscriptions = await subscriptionService.getAll();
            set({ subscriptions });
        } catch (error) {
            set({ error: 'Không thể tải danh sách subscription' });
        } finally {
            set({ isLoading: false });
        }
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
            const subscription = await subscriptionService.create(data);
            set((state) => ({ subscriptions: [subscription, ...state.subscriptions] }));
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
            const updated = await subscriptionService.update(id, data);
            set((state) => ({
                subscriptions: state.subscriptions.map((s) => (s.id === id ? updated : s)),
                currentSubscription: updated,
            }));
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
            set((state) => ({
                subscriptions: state.subscriptions.filter((s) => s.id !== id),
            }));
            toast.success('Xoá thành công!');
        } catch (error) {
            set({ error: 'Xoá subscription thất bại' });
            toast.error('Xoá thất bại!');
        } finally {
            set({ isLoading: false });
        }
    },
}));
