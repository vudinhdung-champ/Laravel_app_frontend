import { useEffect, useState } from "react";
import { useNotebookStore } from "@/stores/useNotebookStore";
import type { CreateNotebookRequest, UpdateNotebookRequest } from "@/types/request";
import type { Notebook } from "@/types/store";
import Pagination from "@/components/Pagination";

// ─── Màu sắc theo category ───────────────────────────
const categoryColor: Record<string, { bg: string; text: string; dot: string }> = {
    default: { bg: 'rgba(124,58,237,0.12)', text: '#a78bfa', dot: '#7c3aed' },
};
function getCategoryStyle(cat: string) {
    return categoryColor[cat] ?? categoryColor['default'];
}

// ─── Note Card ────────────────────────────────────────
function NoteCard({
    note,
    onEdit,
    onDelete,
}: {
    note: Notebook;
    onEdit: (n: Notebook) => void;
    onDelete: (id: number) => void;
}) {
    const style = getCategoryStyle(note.category);
    return (
        <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            backdropFilter: 'blur(12px)',
            transition: 'transform 0.18s, box-shadow 0.18s, border-color 0.18s',
            cursor: 'default',
        }}
            onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(-3px)';
                el.style.boxShadow = '0 12px 32px rgba(0,0,0,0.35)';
                el.style.borderColor = 'rgba(148,163,184,0.25)';
            }}
            onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = 'none';
                el.style.borderColor = 'var(--border)';
            }}
        >
            {/* Category badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    background: style.bg, color: style.text,
                    padding: '3px 10px', borderRadius: 999,
                    fontSize: '0.72rem', fontWeight: 600,
                }}>
                    <span style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: style.dot, display: 'inline-block',
                    }} />
                    {note.category}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text)' }}>
                    {note.createdAt}
                </span>
            </div>

            {/* Title */}
            <h3 style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--text-h)',
                lineHeight: 1.4,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
            }}>
                {note.title}
            </h3>

            {/* Content — truncate dài */}
            <p style={{
                fontSize: '0.855rem',
                color: 'var(--text)',
                lineHeight: 1.6,
                flex: 1,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
            }}>
                {note.content}
            </p>

            {/* Actions */}
            <div style={{
                display: 'flex', gap: 8, justifyContent: 'flex-end',
                paddingTop: 10,
                borderTop: '1px solid var(--border)',
                marginTop: 4,
            }}>
                <button className="btn btn-ghost btn-sm" onClick={() => onEdit(note)}
                    style={{ fontSize: '0.78rem' }}>
                    ✏️ Sửa
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => onDelete(note.id)}
                    style={{ fontSize: '0.78rem' }}>
                    🗑️ Xoá
                </button>
            </div>
        </div>
    );
}

// ─── Note Form Modal ──────────────────────────────────
function NoteFormModal({
    title,
    values,
    onChange,
    onSubmit,
    onCancel,
    isLoading,
}: {
    title: string;
    values: CreateNotebookRequest;
    onChange: (v: CreateNotebookRequest) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    isLoading: boolean;
}) {
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <span className="modal-title">{title}</span>
                    <button className="btn btn-ghost btn-sm" onClick={onCancel}>✕</button>
                </div>
                <form onSubmit={onSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="form-label">Tiêu đề *</label>
                            <input className="input" placeholder="Tiêu đề ghi chú..."
                                value={values.title}
                                onChange={e => onChange({ ...values, title: e.target.value })}
                                required autoFocus />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Thể loại *</label>
                            <input className="input" placeholder="Học tập, Công việc, Cá nhân..."
                                value={values.category}
                                onChange={e => onChange({ ...values, category: e.target.value })}
                                required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Nội dung *</label>
                            <textarea className="input"
                                placeholder="Viết ghi chú của bạn tại đây..."
                                value={values.content}
                                onChange={e => onChange({ ...values, content: e.target.value })}
                                rows={6}
                                style={{ resize: 'vertical', lineHeight: 1.7 }}
                                required />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onCancel}>Huỷ</button>
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? <><span className="spinner" /> Đang lưu...</> : '💾 Lưu'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────
export default function NotebooksPage() {
    const { notebooks, getAll, isLoading, create, update, delete: deleteNote, pagination, setPage } = useNotebookStore();

    const [showCreate, setShowCreate] = useState(false);
    const [form, setForm] = useState<CreateNotebookRequest>({ title: '', content: '', category: '' });

    const [editNotebook, setEditNotebook] = useState<Notebook | null>(null);
    const [editForm, setEditForm] = useState<UpdateNotebookRequest>({ title: '', content: '', category: '' });

    useEffect(() => { getAll(); }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        await create(form);
        setShowCreate(false);
        setForm({ title: '', content: '', category: '' });
    };

    const handleEditClick = (n: Notebook) => {
        setEditNotebook(n);
        setEditForm({ title: n.title, content: n.content, category: n.category });
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editNotebook) return;
        await update(editNotebook.id, editForm);
        setEditNotebook(null);
    };

    return (
        <div className="animate-fade">

            {/* ── Header ── */}
            <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-h)', marginBottom: 4 }}>
                            📓 Notebooks
                        </h1>
                        <p style={{ color: 'var(--text)', fontSize: '0.875rem' }}>
                            {notebooks.length > 0
                                ? `${notebooks.length} ghi chú của bạn`
                                : 'Chưa có ghi chú nào'}
                        </p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
                        + Ghi chú mới
                    </button>
                </div>

                {/* Divider dưới header */}
                <div style={{
                    marginTop: 20,
                    height: 1,
                    background: 'linear-gradient(90deg, rgba(124,58,237,0.4), transparent)',
                }} />
            </div>

            {/* ── Modals ── */}
            {showCreate && (
                <NoteFormModal
                    title="✏️ Ghi chú mới"
                    values={form}
                    onChange={setForm}
                    onSubmit={handleCreate}
                    onCancel={() => setShowCreate(false)}
                    isLoading={isLoading}
                />
            )}

            {editNotebook && (
                <NoteFormModal
                    title={`✏️ Sửa: ${editNotebook.title}`}
                    values={editForm as CreateNotebookRequest}
                    onChange={setEditForm}
                    onSubmit={handleUpdate}
                    onCancel={() => setEditNotebook(null)}
                    isLoading={isLoading}
                />
            )}

            {/* ── Content ── */}
            {isLoading && notebooks.length === 0 ? (
                <div className="loading-screen" style={{ height: 300 }}>
                    <span className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
                    <p>Đang tải ghi chú...</p>
                </div>
            ) : notebooks.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">📓</span>
                    <h3>Chưa có ghi chú nào</h3>
                    <p>Bấm <strong style={{ color: '#a78bfa' }}>Ghi chú mới</strong> để bắt đầu.</p>
                    <button className="btn btn-primary" style={{ marginTop: 8 }}
                        onClick={() => setShowCreate(true)}>
                        + Tạo ghi chú đầu tiên
                    </button>
                </div>
            ) : (
                <>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: 16,
                    }}>
                        {notebooks.map((n) => (
                            <NoteCard
                                key={n.id}
                                note={n}
                                onEdit={handleEditClick}
                                onDelete={deleteNote}
                            />
                        ))}
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