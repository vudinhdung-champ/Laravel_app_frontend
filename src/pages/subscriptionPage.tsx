import { useEffect, useState } from "react";
import { useSubStore } from "@/stores/useSubStore";
import type { CreateSubscriptionRequest, UpdateSubscriptionRequest } from "@/types/request";
import type { Subscription } from "@/types/store";
import Pagination from "@/components/Pagination";

const statusConfig: Record<string, { label: string; badge: string; color: string }> = {
    active: { label: 'Đang hoạt động', badge: 'badge-success', color: '#10b981' },
    inactive: { label: 'Tạm dừng', badge: 'badge-warning', color: '#f59e0b' },
    cancelled: { label: 'Đã huỷ', badge: 'badge-danger', color: '#ef4444' },
};

const formatThousandVND = (amount: number) =>
    Math.round(amount).toLocaleString('vi-VN') + '.000đ';

const emptyForm: CreateSubscriptionRequest = {
    serviceName: '', price: 0, billingCycle: '', nextBillingDate: '', status: 'active', notes: '',
};


const SubForm = ({ values, onChange, onSubmit, onCancel, title, isLoading }: any) => (
    <div className="modal-overlay" onClick={onCancel}>
        <div className="modal" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
                <span className="modal-title">{title}</span>
                <button className="btn btn-ghost btn-sm" onClick={onCancel}>✕</button>
            </div>
            <form onSubmit={onSubmit}>
                <div className="modal-body">
                    <div className="form-group">
                        <label className="form-label">Tên dịch vụ *</label>
                        <input className="input" placeholder="Netflix, Spotify..." value={values.serviceName}
                            onChange={e => onChange({ ...values, serviceName: e.target.value })} required />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div className="form-group">
                            <label className="form-label">Giá tiền (đơn vị nghìn đồng) *</label>
                            <input className="input" type="number" placeholder="0.000đ" value={values.price}
                                onChange={e => onChange({ ...values, price: Number(e.target.value) })} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Chu kỳ *</label>
                            <input className="input" placeholder="monthly, yearly..." value={values.billingCycle}
                                onChange={e => onChange({ ...values, billingCycle: e.target.value })} required />
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div className="form-group">
                            <label className="form-label">Ngày thu tiếp theo</label>
                            <input className="input" type="date" value={values.nextBillingDate}
                                onChange={e => onChange({ ...values, nextBillingDate: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Trạng thái</label>
                            <select className="input" value={values.status}
                                onChange={e => onChange({ ...values, status: e.target.value })}>
                                <option value="active">Đang hoạt động</option>
                                <option value="inactive">Tạm dừng</option>
                                <option value="cancelled">Đã huỷ</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Ghi chú</label>
                        <textarea className="input" placeholder="Ghi chú thêm..." value={values.notes}
                            onChange={e => onChange({ ...values, notes: e.target.value })}
                            rows={2} style={{ resize: 'vertical' }} />
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>Huỷ</button>
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? <><span className="spinner" /> Đang lưu...</> : 'Lưu'}
                    </button>
                </div>
            </form>
        </div>
    </div>
);

export default function SubscriptionsPage() {
    const {
        subscriptions, getAll, isLoading, create, update, delete: deleteSub,
        pagination, setPage, filters, setFilter,
        totalMonthly, totalYearly
    } = useSubStore();

    const [showCreate, setShowCreate] = useState(false);
    const [form, setForm] = useState<CreateSubscriptionRequest>({ ...emptyForm });

    const [editSub, setEditSub] = useState<Subscription | null>(null);
    const [editForm, setEditForm] = useState<UpdateSubscriptionRequest>({ ...emptyForm });

    useEffect(() => { getAll(); }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        await create(form);
        setShowCreate(false);
        setForm({ ...emptyForm });
    };

    const handleEditClick = (s: Subscription) => {
        setEditSub(s);
        setEditForm({
            serviceName: s.serviceName, price: s.price,
            billingCycle: s.billingCycle, nextBillingDate: s.nextBillingDate,
            status: s.status, notes: s.notes,
        });
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editSub) return;
        await update(editSub.id, editForm);
        setEditSub(null);
    };

    return (
        <div className="animate-fade">
            <div className="page-header" style={{ marginBottom: 20 }}>
                <div>
                    <h1 className="page-title">💳 Subscriptions</h1>
                    <p className="page-subtitle">{pagination.total} dịch vụ đăng ký</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowCreate(true)}>+ Thêm dịch vụ</button>
            </div>

            <div style={{
                display: 'flex', gap: 16, marginBottom: 24,
                background: 'var(--surface)', padding: 16,
                borderRadius: 16, border: '1px solid var(--border)'
            }}>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text)', marginBottom: 4 }}>Tổng chi phí (Tháng)</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ef4444' }}>
                        {formatThousandVND(totalMonthly)}
                    </div>
                </div>
                <div style={{ width: 1, background: 'var(--border)' }} />
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text)', marginBottom: 4 }}>Tổng chi phí (Năm)</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b' }}>
                        {formatThousandVND(totalYearly)}
                    </div>
                </div>
            </div>

            {/* ── Filter Bar ── */}
            <div className="filter-bar">
                <input
                    type="text"
                    className="input"
                    placeholder="🔍 Tìm kiếm dịch vụ..."
                    value={filters.search || ''}
                    onChange={(e) => setFilter('search', e.target.value)}
                    style={{ flex: 1, minWidth: 200 }}
                />
                <select
                    className="input"
                    value={filters.status || ''}
                    onChange={(e) => setFilter('status', e.target.value)}
                    style={{ width: 160 }}
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="active">Đang hoạt động</option>
                    <option value="inactive">Tạm dừng</option>
                    <option value="cancelled">Đã huỷ</option>
                </select>
                <select
                    className="input"
                    value={filters.billing_cycle || ''}
                    onChange={(e) => setFilter('billing_cycle', e.target.value)}
                    style={{ width: 160 }}
                >
                    <option value="">Tất cả chu kỳ</option>
                    <option value="monthly">Hàng tháng</option>
                    <option value="yearly">Hàng năm</option>
                    <option value="weekly">Hàng tuần</option>
                </select>
            </div>

            {showCreate && (
                <SubForm values={form} onChange={setForm}
                    onSubmit={handleCreate} onCancel={() => setShowCreate(false)}
                    title="💳 Thêm Subscription" isLoading={isLoading} />
            )}

            {editSub && (
                <SubForm values={editForm} onChange={setEditForm}
                    onSubmit={handleUpdate} onCancel={() => setEditSub(null)}
                    title={`✏️ Sửa ${editSub.serviceName}`} isLoading={isLoading} />
            )}

            {isLoading && subscriptions.length === 0 ? (
                <div className="loading-screen" style={{ height: 300 }}>
                    <span className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
                    <p>Đang tải...</p>
                </div>
            ) : subscriptions.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">💳</span>
                    <h3>Chưa có subscription nào</h3>
                    <p>Bấm "Thêm dịch vụ" để theo dõi chi phí đăng ký.</p>
                </div>
            ) : (
                <>
                    <div className="grid-2">
                        {subscriptions.map((s) => {
                            const sc = statusConfig[s.status] ?? statusConfig['active'];
                            return (
                                <div key={s.id} className="card animate-slide">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{
                                                width: 40, height: 40, borderRadius: 10,
                                                background: `linear-gradient(135deg, ${sc.color}33, ${sc.color}11)`,
                                                border: `1px solid ${sc.color}44`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '1.2rem',
                                            }}>💳</div>
                                            <div>
                                                <h3 style={{ fontSize: '1rem', marginBottom: 2 }}>{s.serviceName}</h3>
                                                <span className={`badge ${sc.badge}`} style={{ fontSize: '0.7rem' }}>{sc.label}</span>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: sc.color }}>
                                                {formatThousandVND(s.price)}
                                            </div>
                                            <div style={{ fontSize: '0.72rem', color: 'var(--text)' }}>{s.billingCycle}</div>
                                        </div>
                                    </div>

                                    {s.nextBillingDate && (
                                        <div style={{
                                            background: 'var(--bg-2)', borderRadius: 8, padding: '8px 12px',
                                            marginBottom: 12, fontSize: '0.8rem', color: 'var(--text-2)',
                                            display: 'flex', alignItems: 'center', gap: 6,
                                        }}>
                                            📅 Thanh toán tiếp theo: <strong>{s.nextBillingDate}</strong>
                                        </div>
                                    )}

                                    {s.notes && (
                                        <p style={{
                                            fontSize: '0.8rem', color: 'var(--text)', marginBottom: 10,
                                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                                        }}>
                                            {s.notes}
                                        </p>
                                    )}

                                    <div className="divider" />
                                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                        <button className="btn btn-ghost btn-sm" onClick={() => handleEditClick(s)}>✏️ Sửa</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => deleteSub(s.id)}>🗑️ Xoá</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <Pagination
                        page={pagination.page}
                        lastPage={pagination.lastPage}
                        total={pagination.total}
                        setPage={setPage}
                    />
                </>
            )}
        </div>
    );
}