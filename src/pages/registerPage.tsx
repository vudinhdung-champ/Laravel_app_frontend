import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

export default function RegisterPage() {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        password_cofirmation: ''
    });

    const { register, isLoading } = useAuthStore();

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });

    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await register(form);
        navigate('/login');

    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Đăng ký tài khoản</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label>Tên tài khoản</label>
                    <input type="text" name="username" value={form.username} onChange={handleChange} />
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} />
                </div>
                <div>
                    <label>Mật khẩu</label>
                    <input type="password" name="password" value={form.password} onChange={handleChange} />
                </div>
                <div>
                    <label>Xác nhận mật khẩu</label>
                    <input type="password" name="password_cofirmation" value={form.password_cofirmation} onChange={handleChange} />
                </div>
                <button type="submit" disabled={isLoading}>{isLoading ? 'Đang xử lý...' : 'Đăng ký'}</button>
            </form>
            <p>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>

        </div>
    )

}