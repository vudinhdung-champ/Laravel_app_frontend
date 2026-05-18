import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';

const links = [
    { to: '/dashboard',     emoji: '🏠', label: 'Dashboard' },
    { to: '/notebooks',     emoji: '📓', label: 'Notebooks' },
    { to: '/promises',      emoji: '🤝', label: 'Promises' },
    { to: '/subscriptions', emoji: '💳', label: 'Subscriptions' },
];

export default function Sidebar() {
    const { logout, user } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <aside style={{
            width: 'var(--sidebar-w)',
            minHeight: '100vh',
            background: '#131929',
            borderRight: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            padding: '0',
            position: 'sticky',
            top: 0,
            flexShrink: 0,
        }}>
            {/* Brand */}
            <div style={{
                padding: '24px 20px 20px',
                borderBottom: '1px solid var(--border)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18, flexShrink: 0,
                        boxShadow: '0 4px 12px rgba(124,58,237,0.4)',
                    }}>✦</div>
                    <span style={{ color: 'var(--text-h)', fontWeight: 700, fontSize: '1rem' }}>
                        My App
                    </span>
                </div>
            </div>

            {/* Nav links */}
            <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '10px 14px',
                            borderRadius: 10,
                            fontWeight: 500,
                            fontSize: '0.9rem',
                            color: isActive ? '#c4b5fd' : 'var(--text)',
                            background: isActive
                                ? 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(59,130,246,0.1))'
                                : 'transparent',
                            border: isActive ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
                            transition: 'all 0.2s',
                            textDecoration: 'none',
                        })}
                    >
                        <span style={{ fontSize: '1.1rem' }}>{link.emoji}</span>
                        {link.label}
                    </NavLink>
                ))}
            </nav>

            {/* User + Logout */}
            <div style={{
                padding: '14px 10px',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
            }}>
                {/* User info */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 14px',
                }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0,
                    }}>
                        {user?.username?.charAt(0).toUpperCase() ?? 'U'}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                        <div style={{ color: 'var(--text-2)', fontSize: '0.82rem', fontWeight: 600,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {user?.username ?? 'User'}
                        </div>
                        <div style={{ color: 'var(--text)', fontSize: '0.72rem',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {user?.email ?? ''}
                        </div>
                    </div>
                </div>

                <button onClick={handleLogout} className="btn btn-ghost btn-sm"
                    style={{ justifyContent: 'center' }}>
                    🚪 Đăng xuất
                </button>
            </div>
        </aside>
    );
}
