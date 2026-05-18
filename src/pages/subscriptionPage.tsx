import { useEffect, useState } from "react";
import { useSubStore } from "@/stores/useSubStore";
import type { CreateSubscriptionRequest, UpdateSubscriptionRequest } from "@/types/request";
import type { Subscription } from "@/types/store";

const statusConfig: Record<string, { label: string; badge: string; color: string }> = {
    active:    { label: 'Đang hoạt động', badge: 'badge-success', color: '#10b981' },
    inactive:  { label: 'Tạm dừng',       badge: 'badge-warning', color: '#f59e0b' },
    cancelled: { label: 'Đã huỷ',          badge: 'badge-danger',  color: '#ef4444' },
};

const formatVND = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const emptyForm: CreateSubscriptionRequest = {
    service_name: '', price: 0, billing_cycle: '', next_billing_date: '', status: 'active', notes: '',
};

export default function SubscriptionsPage() {
    const { subscriptions, getAll, isLoading, create, update, delete: deleteSub } = useSubStore();

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
            service_name: s.service_name, price: s.price,
            billing_cycle: s.billing_cycle, next_billing_date: s.next_billing_date,
            status: s.status, notes: s.notes,
        });
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editSub) return;
        await update(editSub.id, editForm);
        setEditSub(null);
    };

    const SubForm = ({ values, onChange, onSubmit, onCancel, title }: any) => (
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
                            <input className="input" placeholder="Netflix, Spotify..." value={values.service_name}
                                onChange={e => onChange({ ...values, service_name: e.target.value })} required />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div className="form-group">
                                <label className="form-label">Giá tiền *</label>
                                <input className="input" type="number" placeholder="0" value={values.price}
                                    onChange={e => onChange({ ...values, price: Number(e.target.value) })} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Chu kỳ *</label>
                                <input className="input" placeholder="monthly, yearly..." value={values.billing_cycle}
                                    onChange={e => onChange({ ...values, billing_cycle: e.target.value })} required />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div className="form-group">
                                <label className="form-label">Ngày thu tiếp theo</label>
                                <input className="input" type="date" value={values.next_billing_date}
                                    onChange={e => onChange({ ...values, next_billing_date: e.target.value })} />
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

    return (
        <div className="animate-fade">
            <div className="page-header">
                <div>
                    <h1 className="page-title">💳 Subscriptions</h1>
                    <p className="page-subtitle">{subscriptions.length} dịch vụ đăng ký</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowCreate(true)}>+ Thêm dịch vụ</button>
            </div>

            {showCreate && (
                <SubForm values={form} onChange={setForm}
                    onSubmit={handleCreate} onCancel={() => setShowCreate(false)}
                    title="💳 Thêm Subscription" />
            )}

            {editSub && (
                <SubForm values={editForm} onChange={setEditForm}
                    onSubmit={handleUpdate} onCancel={() => setEditSub(null)}
                    title={`✏️ Sửa ${editSub.service_name}`} />
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
                                            <h3 style={{ fontSize: '1rem', marginBottom: 2 }}>{s.service_name}</h3>
                                            <span className={`badge ${sc.badge}`} style={{ fontSize: '0.7rem' }}>{sc.label}</span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: sc.color }}>
                                            {formatVND(s.price)}
                                        </div>
                                        <div style={{ fontSize: '0.72rem', color: 'var(--text)' }}>{s.billing_cycle}</div>
                                    </div>
                                </div>

                                {s.next_billing_date && (
                                    <div style={{
                                        background: 'var(--bg-2)', borderRadius: 8, padding: '8px 12px',
                                        marginBottom: 12, fontSize: '0.8rem', color: 'var(--text-2)',
                                        display: 'flex', alignItems: 'center', gap: 6,
                                    }}>
                                        📅 Thanh toán tiếp theo: <strong>{s.next_billing_date}</strong>
                                    </div>
                                )}

                                {s.notes && (
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text)', marginBottom: 10,
                                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
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
            )}
        </div>
    );
}
