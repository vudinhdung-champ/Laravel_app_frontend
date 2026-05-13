import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';

const links = [
    { to: '/dashboard', label: '🏠 Dashboard' },
    { to: '/notebooks', label: '📓 Notebooks' },
    { to: '/promises', label: '🤝 Promises' },
    { to: '/subscriptions', label: '💳 Subscriptions' },
];

export default function Sidebar() {
    const { logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav style={{ width: 220, background: '#1e1e2e', padding: 16 }}>
            <h2 style={{ color: 'white' }}>My App</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {links.map((link) => (
                    <li key={link.to}>
                        <NavLink
                            to={link.to}
                            style={({ isActive }) => ({
                                color: isActive ? '#7c3aed' : 'white',
                                display: 'block',
                                padding: '8px 0',
                                textDecoration: 'none',
                            })}
                        >
                            {link.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
            <button onClick={handleLogout} style={{ marginTop: 'auto' }}>
                Đăng xuất
            </button>
        </nav>
    );
}
