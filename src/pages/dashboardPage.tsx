import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNotebookStore } from '@/stores/useNotebookStore';
import { usePromiseStore } from '@/stores/usePromiseStore';
import { useSubStore } from '@/stores/useSubStore';
import { Link } from 'react-router-dom';
import { subscriptionService } from '@/services/subscriptionService';
import toast from 'react-hot-toast';

const stats = [
    { label: 'Notebooks', emoji: '📓', to: '/notebooks', color: '#7c3aed', bg: 'rgba(124,58,237,0.12)', border: 'rgba(124,58,237,0.25)', storeKey: 'notebooks' },
    { label: 'Promises', emoji: '🤝', to: '/promises', color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)', storeKey: 'promises' },
    { label: 'Subscriptions', emoji: '💳', to: '/subscriptions', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.25)', storeKey: 'subscriptions' },
];

export default function DashboardPage() {
    const user = useAuthStore((s) => s.user);
    const Subnotebooks = useNotebookStore((s) => s.pagination);
    const Subpromises = usePromiseStore((s) => s.pagination);
    const Subpagination = useSubStore((s) => s.pagination);

    const { getAll: getNB } = useNotebookStore();
    const { getAll: getPR } = usePromiseStore();
    const { getAll: getSB } = useSubStore();

    const [exporting, setExporting] = useState(false);

    useEffect(() => { getNB(); getPR(); getSB(); }, []);

    const counts: Record<string, number> = {
        notebooks: Subnotebooks.total,
        promises: Subpromises.total,
        subscriptions: Subpagination.total,
    };

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Chào buổi sáng' : hour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';

    const handleExportAndEmail = async () => {
        setExporting(true);
        try {
            await subscriptionService.exportAllAndEmail();
            toast.success('Đã gửi email thành công!');
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Có lỗi xảy ra khi gửi email.';
            toast.error(msg);
        } finally {
            setExporting(false);
        }
    };

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

            {/* Export Section */}
            <div style={{
                marginTop: 32,
                background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(59,130,246,0.08))',
                border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: 20,
                padding: '28px 32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 24,
                flexWrap: 'wrap',
            }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <span style={{ fontSize: '1.5rem' }}>📊</span>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                            Tổng hợp dữ liệu
                        </h2>
                    </div>
                    <p style={{ color: 'var(--text-2)', fontSize: '0.875rem', margin: 0 }}>
                        Tải xuống file Excel gồm 3 sheet:{' '}
                        <strong style={{ color: '#3b82f6' }}>Đăng ký dịch vụ</strong>,{' '}
                        <strong style={{ color: '#10b981' }}>Lời hứa</strong>,{' '}
                        <strong style={{ color: '#7c3aed' }}>Ghi chú</strong>{' '}
                        — gửi thẳng vào mail của bạn.
                    </p>
                </div>

                <button
                    id="btn-export-all-email"
                    onClick={handleExportAndEmail}
                    disabled={exporting}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '12px 28px',
                        borderRadius: 12,
                        border: 'none',
                        background: exporting
                            ? 'rgba(16,185,129,0.3)'
                            : 'linear-gradient(135deg, #10b981, #3b82f6)',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        cursor: exporting ? 'not-allowed' : 'pointer',
                        transition: 'all 0.25s',
                        whiteSpace: 'nowrap',
                        boxShadow: exporting ? 'none' : '0 4px 20px rgba(16,185,129,0.35)',
                        flexShrink: 0,
                    }}
                    onMouseEnter={e => {
                        if (!exporting) {
                            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                            (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(16,185,129,0.5)';
                        }
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                        (e.currentTarget as HTMLElement).style.boxShadow = exporting ? 'none' : '0 4px 20px rgba(16,185,129,0.35)';
                    }}
                >
                    {exporting ? (
                        <>
                            <span style={{
                                width: 18, height: 18,
                                border: '2.5px solid rgba(255,255,255,0.35)',
                                borderTopColor: '#fff',
                                borderRadius: '50%',
                                display: 'inline-block',
                                animation: 'spin 0.75s linear infinite',
                                flexShrink: 0,
                            }} />
                            Đang gửi...
                        </>
                    ) : (
                        <>
                            <span style={{ fontSize: '1.1rem' }}></span>
                            Xuất Excel &amp; Gửi Email
                        </>
                    )}
                </button>
            </div>

            {/* Spin keyframe */}
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
