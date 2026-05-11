import { create } from 'zustand';
import type { AuthState } from '@/types/store';
import { authService } from '@/services/authService';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';


export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            user: null,
            isLoading: false,
            err: null,

            setToken: (token) => {
                set({ token });
                localStorage.setItem('token', token);
            },

            setUser: (user) => set({ user }),

            clearState: () => {
                set({ token: null, user: null, isLoading: false });
                localStorage.removeItem('token');
            },

            clearError: () => set({ err: null }),

            register: async (credentials) => {
                set({ isLoading: true, err: null });
                try {
                    await authService.register(credentials);
                    toast.success("Đăng ký thành công! Hãy đăng nhập!");
                } catch (error) {
                    console.log(error);
                    toast.error("Đăng ký thất bại!");
                } finally {
                    set({ isLoading: false });
                }
            },

            login: async (credentials) => {
                set({ isLoading: true });
                try {

                    localStorage.clear();

                    const response = await authService.login(credentials);

                    get().setToken(response.token);
                    await get().fetchMe();

                    toast.success("Đăng nhập thành công!");

                } catch (error) {
                    console.log(error);
                    toast.error("Đăng nhập thất bại");

                } finally {
                    set({ isLoading: false });

                }

            },

            logout: async () => {

                set({ isLoading: true, err: null });
                try {
                    await authService.logout();
                    toast.success("Logout thành công!");

                } catch (error) {
                    console.error("Lỗi không logout được");

                } finally {
                    get().clearState();
                }
            },

            fetchMe: async () => {
                set({ isLoading: true, err: null });
                try {
                    const user = await authService.fetchMe();
                    set({ user });

                } catch (error) {
                    get().clearState();
                }
            },

            refresh: async () => {
                try {
                    const response = await authService.refresh();
                    get().setToken(response.token);

                } catch (error) {
                    set({ token: null, user: null });

                }

            },

            changePassword: async (credentials) => {
                set({ isLoading: true, err: null });
                try {
                    await authService.changePassword(credentials);
                    set({ isLoading: false });

                } catch (error: any) {
                    const message = error.response?.data?.message || 'Change password failed';
                    set({ err: message, isLoading: false });
                    throw error;
                }
            },
            resetPassword: async (data) => {
                set({ isLoading: true, err: null });
                try {
                    await authService.resetPassword(data);
                    set({ isLoading: false });

                } catch (error: any) {
                    const message = error.response?.data?.message || 'Reset password failed';
                    set({ err: message, isLoading: false });
                    throw error;
                }
            },

        }),
        {
            name: "auth-storage",
            partialize: (state) => ({ user: state.user }),
        }
    )

);