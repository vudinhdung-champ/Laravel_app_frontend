import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

export default function LoginPage() {
    const [username, setUsername] = useState('');

    const [password, setPassword] = useState('');
    const { login, isLoading } = useAuthStore();

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await login({ username, password });

        const token = useAuthStore.getState().token;

        if (token) {
            navigate('/dashboard');
        }
    };

    return (
        <div>
            <h1>Đăng nhập</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Đang đăng nhập' : 'Đăng nhập'}
                </button>
            </form>

            <Link to="/register">
                Chưa có tài khoản? Đăng ký
            </Link>

            <Link to="/forgot-password">
                Quên mật khẩu?
            </Link>

        </div>
    )

}