import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './sidebar';

const pageTitles: Record<string, string> = {
    '/dashboard':     '🏠 Dashboard',
    '/notebooks':     '📓 Notebooks',
    '/promises':      '🤝 Promises',
    '/subscriptions': '💳 Subscriptions',
};

export default function Layout() {
    const location = useLocation();
    const title = pageTitles[location.pathname] ?? 'My App';

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
            <Sidebar />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {/* Topbar */}
                <header style={{
                    height: 60,
                    borderBottom: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center',
                    padding: '0 28px',
                    background: 'rgba(15,23,42,0.8)',
                    backdropFilter: 'blur(8px)',
                    position: 'sticky', top: 0, zIndex: 10,
                }}>
                    <span style={{ color: 'var(--text-h)', fontWeight: 600, fontSize: '0.95rem' }}>
                        {title}
                    </span>
                </header>

                {/* Main content */}
                <main style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
