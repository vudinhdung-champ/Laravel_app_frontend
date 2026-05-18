import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

export default function RegisterPage() {
    const [form, setForm] = useState({
        username: '', email: '', password: '', password_confirmation: ''
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
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
        }}>
            <div style={{
                position: 'fixed', top: '10%', right: '10%',
                width: 350, height: 350, borderRadius: '50%',
                background: 'rgba(59,130,246,0.12)', filter: 'blur(90px)', pointerEvents: 'none'
            }} />
            <div style={{
                position: 'fixed', bottom: '15%', left: '10%',
                width: 280, height: 280, borderRadius: '50%',
                background: 'rgba(124,58,237,0.12)', filter: 'blur(80px)', pointerEvents: 'none'
            }} />

            <div className="animate-slide" style={{
                width: '100%', maxWidth: 440,
                background: 'rgba(30,41,59,0.75)',
                border: '1px solid rgba(148,163,184,0.15)',
                borderRadius: 24, padding: '40px 36px',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
            }}>
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <div style={{
                        width: 52, height: 52, borderRadius: 14,
                        background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 24, margin: '0 auto 14px',
                        boxShadow: '0 8px 24px rgba(124,58,237,0.4)',
                    }}>✦</div>
                    <h1 style={{ fontSize: '1.6rem', marginBottom: 6 }}>Tạo tài khoản</h1>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text)' }}>Chỉ mất vài giây</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div className="form-group">
                        <label className="form-label">Tên đăng nhập</label>
                        <input className="input" type="text" name="username"
                            placeholder="username..." value={form.username} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input className="input" type="email" name="email"
                            placeholder="you@email.com" value={form.email} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Mật khẩu</label>
                        <input className="input" type="password" name="password"
                            placeholder="Ít nhất 8 ký tự" value={form.password} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Xác nhận mật khẩu</label>
                        <input className="input" type="password" name="password_confirmation"
                            placeholder="••••••••" value={form.password_confirmation} onChange={handleChange} required />
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg" disabled={isLoading}
                        style={{ marginTop: 8, justifyContent: 'center' }}>
                        {isLoading ? <><span className="spinner" /> Đang xử lý...</> : 'Đăng ký'}
                    </button>
                </form>

                <div style={{
                    marginTop: 24, paddingTop: 20,
                    borderTop: '1px solid var(--border)',
                    textAlign: 'center', fontSize: '0.875rem',
                }}>
                    <span style={{ color: 'var(--text)' }}>Đã có tài khoản? </span>
                    <Link to="/login" style={{ color: '#a78bfa', fontWeight: 600 }}>Đăng nhập</Link>
                </div>
            </div>
        </div>
    );
}