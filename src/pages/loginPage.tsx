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
        if (token) navigate('/dashboard');
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
        }}>
            {/* Glow orbs */}
            <div style={{
                position: 'fixed', top: '20%', left: '15%',
                width: 300, height: 300, borderRadius: '50%',
                background: 'rgba(124,58,237,0.15)', filter: 'blur(80px)', pointerEvents: 'none'
            }} />
            <div style={{
                position: 'fixed', bottom: '25%', right: '15%',
                width: 250, height: 250, borderRadius: '50%',
                background: 'rgba(59,130,246,0.12)', filter: 'blur(80px)', pointerEvents: 'none'
            }} />

            <div className="animate-slide" style={{
                width: '100%', maxWidth: 420,
                background: 'rgba(30,41,59,0.75)',
                border: '1px solid rgba(148,163,184,0.15)',
                borderRadius: 24, padding: '40px 36px',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{
                        width: 52, height: 52, borderRadius: 14,
                        background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 24, margin: '0 auto 14px',
                        boxShadow: '0 8px 24px rgba(124,58,237,0.4)',
                    }}>✦</div>
                    <h1 style={{ fontSize: '1.6rem', marginBottom: 6 }}>Chào mừng trở lại</h1>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text)' }}>Đăng nhập để tiếp tục</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div className="form-group">
                        <label className="form-label">Tên đăng nhập</label>
                        <input
                            className="input"
                            type="text"
                            placeholder="Nhập username..."
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Mật khẩu</label>
                        <input
                            className="input"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg" disabled={isLoading}
                        style={{ marginTop: 8, justifyContent: 'center' }}>
                        {isLoading ? <><span className="spinner" /> Đang đăng nhập...</> : 'Đăng nhập'}
                    </button>
                </form>

                <div style={{
                    marginTop: 24, paddingTop: 20,
                    borderTop: '1px solid var(--border)',
                    textAlign: 'center', fontSize: '0.875rem',
                }}>
                    <span style={{ color: 'var(--text)' }}>Chưa có tài khoản? </span>
                    <Link to="/register" style={{
                        color: '#a78bfa', fontWeight: 600,
                        transition: 'color 0.2s',
                    }}>Đăng ký ngay</Link>
                </div>
            </div>
        </div>
    );
}