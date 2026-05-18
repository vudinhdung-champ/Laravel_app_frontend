import { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNotebookStore } from '@/stores/useNotebookStore';
import { usePromiseStore } from '@/stores/usePromiseStore';
import { useSubStore } from '@/stores/useSubStore';
import { Link } from 'react-router-dom';

const stats = [
    { label: 'Notebooks', emoji: '📓', to: '/notebooks', color: '#7c3aed', bg: 'rgba(124,58,237,0.12)', border: 'rgba(124,58,237,0.25)', storeKey: 'notebooks' },
    { label: 'Promises',  emoji: '🤝', to: '/promises',  color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)', storeKey: 'promises' },
    { label: 'Subscriptions', emoji: '💳', to: '/subscriptions', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.25)', storeKey: 'subscriptions' },
];

export default function DashboardPage() {
    const user = useAuthStore((s) => s.user);
    const notebooks = useNotebookStore((s) => s.notebooks);
    const promises  = usePromiseStore((s) => s.promises);
    const subscriptions = useSubStore((s) => s.subscriptions);

    const { getAll: getNB } = useNotebookStore();
    const { getAll: getPR } = usePromiseStore();
    const { getAll: getSB } = useSubStore();

    useEffect(() => { getNB(); getPR(); getSB(); }, []);

    const counts: Record<string, number> = {
        notebooks: notebooks.length,
        promises: promises.length,
        subscriptions: subscriptions.length,
    };

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Chào buổi sáng' : hour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';

    return (
        <div className="animate-fade">
            {/* Welcome banner */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(59,130,246,0.15))',
                border: '1px solid rgba(124,58,237,0.25)',
                borderRadius: 20, padding: '28px 32px',
                marginBottom: 28,
                position: 'relative', overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', top: -40, right: -40,
                    width: 200, height: 200, borderRadius: '50%',
                    background: 'rgba(124,58,237,0.15)', filter: 'blur(40px)',
                }} />
                <p style={{ color: '#a78bfa', fontWeight: 500, marginBottom: 6, fontSize: '0.9rem' }}>
                    {greeting} 👋
                </p>
                <h1 style={{ fontSize: '1.75rem', marginBottom: 4 }}>
                    {user?.username ?? 'User'}!
                </h1>
                <p style={{ color: 'var(--text)', fontSize: '0.9rem' }}>
                    Quản lý Notebooks, Promises và Subscriptions của bạn.
                </p>
            </div>

            {/* Stats cards */}
            <div className="grid-3">
                {stats.map((s) => (
                    <Link key={s.label} to={s.to} style={{ textDecoration: 'none' }}>
                        <div style={{
                            background: s.bg,
                            border: `1px solid ${s.border}`,
                            borderRadius: 16, padding: '24px',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            cursor: 'pointer',
                        }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                                (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 32px ${s.border}`;
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                                <span style={{ fontSize: '1.75rem' }}>{s.emoji}</span>
                                <span style={{
                                    fontSize: '2rem', fontWeight: 700, color: s.color,
                                }}>
                                    {counts[s.storeKey]}
                                </span>
                            </div>
                            <p style={{ color: 'var(--text-2)', fontWeight: 600, fontSize: '0.9rem' }}>{s.label}</p>
                            <p style={{ color: s.color, fontSize: '0.78rem', marginTop: 4 }}>Xem tất cả →</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
