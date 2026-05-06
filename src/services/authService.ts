import api from '@/lib/axios.ts';
import type { LoginRequest, RegisterRequest, AuthResponse, ChangePasswordRequest, ResetPasswordRequest, RefreshResponse } from '@/types/auth.ts';

export const authService = {
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        const { data } = await api.post('/login', credentials);
        return data;

    },

    register: async (credentials: RegisterRequest): Promise<AuthResponse> => {
        const { data } = await api.post('/register', credentials);
        return data;

    },

    logout: async (): Promise<void> => {
        const { data } = await api.post('/logout');
        return data;

    },

    refresh: async (): Promise<RefreshResponse> => {
        const {data} = await api.post('/refresh');
        return data;

    },

    changePassword: async (credentials: ChangePasswordRequest): Promise<void> => {
        await api.post('/change_password', credentials);

    },

    resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
        await api.post('/reset_password', data);


    }

}