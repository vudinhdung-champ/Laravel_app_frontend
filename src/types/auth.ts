export interface User {
  id: number,
  name: string,
  email: string,
  displayName: string,
  createdAt?: string,
  updatedAt?: string

}

export interface LoginRequest {
  username: string,
  password: string

}

export interface RegisterRequest {
  username: string,
  email: string,
  password: string,
  password_confirmation?: string;

}

export interface ChangePasswordRequest {
  current_password: string,
  password: string,
  password_confirmation: string

}

export interface ResetPasswordRequest {
  email: string,
  token: string,
  password: string,
  password_confirmation: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LogoutResponse {
  message: string;
}

export interface RefreshResponse {
  token: string;
}



