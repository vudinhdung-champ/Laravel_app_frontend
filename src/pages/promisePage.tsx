import { useEffect, useState } from "react";
import { usePromiseStore } from "@/stores/usePromiseStore";
import type { CreatePromiseRequest, UpdatePromiseRequest } from "@/types/request";
import type { PromiseItem } from "@/types/store";

type PromiseStatus = 'pending' | 'kept' | 'broken' | 'completed' | 'cancelled';

const statusConfig: Record<string, { label: string; badge: string }> = {
    pending: { label: 'Đang chờ', badge: 'badge-warning' },
    kept: { label: 'Đã thực hiện', badge: 'badge-success' },
    broken: { label: 'Đã vi phạm', badge: 'badge-danger' },
    completed: { label: 'Hoàn thành', badge: 'badge-success' },
    cancelled: { label: 'Đã huỷ', badge: 'badge-neutral' },
};

const importanceDots = (level: number) =>
    Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{
            display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
            background: i < level ? '#f59e0b' : 'var(--bg-3)',
            marginRight: 3,
        }} />
    ));

const PromiseForm = ({ values, onChange, onSubmit, onCancel, title, isLoading }: any) => (
    <div className="modal-overlay" onClick={onCancel}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
                <span className="modal-title">{title}</span>
                <button className="btn btn-ghost btn-sm" onClick={onCancel}>✕</button>
            </div>
            <form onSubmit={onSubmit}>
                <div className="modal-body">
                    <div className="form-group">
                        <label className="form-label">Người hứa *</label>
                        <input className="input" placeholder="Tên người hứa..." value={values.promiser_name}
                            onChange={e => onChange({ ...values, promiser_name: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Nội dung *</label>
                        <textarea className="input" placeholder="Nội dung lời hứa..." value={values.promise_content}
                            onChange={e => onChange({ ...values, promise_content: e.target.value })}
                            rows={3} style={{ resize: 'vertical' }} required />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div className="form-group">
                            <label className="form-label">Ngày hứa</label>
                            <input className="input" type="date" value={values.date_made}
                                onChange={e => onChange({ ...values, date_made: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Thời hạn</label>
                            <input className="input" type="date" value={values.deadline}
                                onChange={e => onChange({ ...values, deadline: e.target.value })} />
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div className="form-group">
                            <label className="form-label">Trạng thái</label>
                            <select className="input" value={values.status}
                                onChange={e => onChange({ ...values, status: e.target.value as PromiseStatus })}>
                                <option value="pending">Đang chờ</option>
                                <option value="kept">Đã thực hiện</option>
                                <option value="broken">Đã vi phạm</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Độ quan trọng (1–5)</label>
                            <input className="input" type="number" min={1} max={5} value={values.importance_level}
                                onChange={e => onChange({ ...values, importance_level: Number(e.target.value) })} />
                        </div>
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

export default function PromisesPage() {
    const { promises, getAll, isLoading, create, update, delete: deletePromise } = usePromiseStore();

    const [showCreate, setShowCreate] = useState(false);
    const [form, setForm] = useState<CreatePromiseRequest>({
        promiser_name: '', promise_content: '', date_made: '',
        deadline: '', status: 'pending', importance_level: 3,
    });

    const [editPromise, setEditPromise] = useState<PromiseItem | null>(null);
    const [editForm, setEditForm] = useState<UpdatePromiseRequest>({
        promiser_name: '', promise_content: '', date_made: '',
        deadline: '', status: 'pending', importance_level: 3,
    });

    useEffect(() => { getAll(); }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        await create(form);
        setShowCreate(false);
        setForm({ promiser_name: '', promise_content: '', date_made: '', deadline: '', status: 'pending', importance_level: 3 });
    };

    const handleEditClick = (p: PromiseItem) => {
        setEditPromise(p);
        setEditForm({
            promiser_name: p.promiser_name, promise_content: p.promise_content,
            date_made: p.date_made, deadline: p.deadline,
            status: p.status, importance_level: p.importance_level,
        });
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editPromise) return;
        await update(editPromise.id, editForm);
        setEditPromise(null);
    };

    return (
        <div className="animate-fade">
            <div className="page-header">
                <div>
                    <h1 className="page-title">🤝 Promises</h1>
                    <p className="page-subtitle">{promises.length} lời hứa</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowCreate(true)}>+ Tạo mới</button>
            </div>

            {showCreate && (
                <PromiseForm values={form} onChange={setForm}
                    onSubmit={handleCreate} onCancel={() => setShowCreate(false)}
                    title="🤝 Thêm lời hứa" isLoading={isLoading} />
            )}

            {editPromise && (
                <PromiseForm values={editForm} onChange={setEditForm}
                    onSubmit={handleUpdate} onCancel={() => setEditPromise(null)}
                    isLoading={isLoading}
                    title={`✏️ Sửa Promise #${editPromise.id}`} />
            )}

            {isLoading && promises.length === 0 ? (
                <div className="loading-screen" style={{ height: 300 }}>
                    <span className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
                    <p>Đang tải...</p>
                </div>
            ) : promises.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">🤝</span>
                    <h3>Chưa có lời hứa nào</h3>
                    <p>Bấm "Tạo mới" để ghi lại lời hứa đầu tiên.</p>
                </div>
            ) : (
                <div className="grid-2">
                    {promises.map((p) => {
                        const sc = statusConfig[p.status] ?? statusConfig['pending'];
                        return (
                            <div key={p.id} className="card animate-slide">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                    <span className={`badge ${sc.badge}`}>{sc.label}</span>
                                    <span style={{ color: 'var(--text)', fontSize: '0.75rem' }}>#{p.id}</span>
                                </div>
                                <h3 style={{ marginBottom: 6, fontSize: '0.95rem' }}>👤 {p.promiser_name}</h3>
                                <p style={{
                                    fontSize: '0.85rem', color: 'var(--text)', marginBottom: 10,
                                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                                }}>
                                    {p.promise_content}
                                </p>
                                <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: '0.78rem', color: 'var(--text)' }}>
                                    {p.date_made && <span>📅 {p.date_made}</span>}
                                    {p.deadline && <span>⏰ {p.deadline}</span>}
                                </div>
                                <div style={{ marginBottom: 12 }}>
                                    {importanceDots(p.importance_level)}
                                </div>
                                <div className="divider" />
                                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                    <button className="btn btn-ghost btn-sm" onClick={() => handleEditClick(p)}>✏️ Sửa</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => deletePromise(p.id)}>🗑️ Xoá</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}