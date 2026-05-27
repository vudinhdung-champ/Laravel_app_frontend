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
    onView, // ✅ Đã thêm prop onView
}: {
    note: Notebook;
    onEdit: (n: Notebook) => void;
    onDelete: (id: number) => void;
    onView: (n: Notebook) => void; // ✅ Khai báo type
}) {
    const style = getCategoryStyle(note.category);
    return (
        <div
            onClick={() => onView(note)} // ✅ Bấm vào Card để xem chi tiết
            style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 16,
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                backdropFilter: 'blur(12px)',
                transition: 'transform 0.18s, box-shadow 0.18s, border-color 0.18s',
                cursor: 'pointer', // ✅ Đổi thành pointer để báo hiệu có thể click
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
                {/* ✅ Thêm e.stopPropagation() để chặn click lan ra Card */}
                <button className="btn btn-ghost btn-sm"
                    onClick={(e) => { e.stopPropagation(); onEdit(note); }}
                    style={{ fontSize: '0.78rem' }}>
                    ✏️ Sửa
                </button>
                <button className="btn btn-danger btn-sm"
                    onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
                    style={{ fontSize: '0.78rem' }}>
                    🗑️ Xoá
                </button>
            </div>
        </div>
    );
}

// ─── Note View Modal (Chỉ để xem) ─────────────────────
function NoteViewModal({
    note,
    onClose,
}: {
    note: Notebook;
    onClose: () => void;
}) {
    const style = getCategoryStyle(note.category);
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
                <div className="modal-header" style={{ paddingBottom: 16 }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-h)', margin: 0 }}>
                        {note.title}
                    </h2>
                    <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
                </div>

                <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            background: style.bg, color: style.text,
                            padding: '4px 12px', borderRadius: 999,
                            fontSize: '0.75rem', fontWeight: 600,
                        }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: style.dot, display: 'inline-block' }} />
                            {note.category}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text)' }}>
                            ⏳ Tạo lúc: {note.createdAt}
                        </span>
                    </div>

                    <div style={{
                        fontSize: '0.95rem',
                        color: 'var(--text)',
                        lineHeight: 1.8,
                        whiteSpace: 'pre-wrap' // Giữ nguyên khoảng trắng và xuống dòng
                    }}>
                        {note.content}
                    </div>
                </div>
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
                            <select
                                className="input"
                                value={values.category}
                                onChange={e => onChange({ ...values, category: e.target.value })}
                                required
                            >
                                <option value="" disabled hidden>-- Chọn thể loại --</option>
                                <option value="Công việc">Công việc</option>
                                <option value="Học tập">Học tập</option>
                                <option value="Cá nhân">Cá nhân</option>
                            </select>
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
    // ✅ Lấy thêm getById từ store ra
    const { notebooks, getAll, isLoading, create, update, delete: deleteNote, pagination, setPage, filters, setFilter, getById } = useNotebookStore();

    const [showCreate, setShowCreate] = useState(false);
    const [form, setForm] = useState<CreateNotebookRequest>({ title: '', content: '', category: '' });

    const [editNotebook, setEditNotebook] = useState<Notebook | null>(null);
    const [editForm, setEditForm] = useState<UpdateNotebookRequest>({ title: '', content: '', category: '' });

    // ✅ State lưu ghi chú đang xem
    const [viewNotebook, setViewNotebook] = useState<Notebook | null>(null);

    useEffect(() => { getAll(); }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        await create(form);
        setShowCreate(false);
        setForm({ title: '', content: '', category: '' });
    };

    // ✅ Sửa lại hàm Edit: Gọi API lấy full data
    const handleEditClick = async (n: Notebook) => {
        const fullNote = await getById(n.id);
        if (fullNote) {
            setEditNotebook(fullNote);
            setEditForm({ title: fullNote.title, content: fullNote.content, category: fullNote.category });
        }
    };

    // ✅ Hàm View: Gọi API lấy full data
    const handleViewClick = async (n: Notebook) => {
        const fullNote = await getById(n.id);
        if (fullNote) {
            setViewNotebook(fullNote);
        }
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
                                ? `${pagination.total} ghi chú của bạn`
                                : 'Chưa có ghi chú nào'}
                        </p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
                        + Ghi chú mới
                    </button>
                </div>

                <div style={{
                    marginTop: 20,
                    height: 1,
                    background: 'linear-gradient(90deg, rgba(124,58,237,0.4), transparent)',
                    marginBottom: 20,
                }} />

                {/* ── Filter Bar ── */}
                <div className="filter-bar">
                    <input
                        type="text"
                        className="input"
                        placeholder="🔍 Tìm kiếm tiêu đề..."
                        value={filters.search || ''}
                        onChange={(e) => setFilter('search', e.target.value)}
                        style={{ flex: 1, minWidth: 200 }}
                    />
                    <select
                        className="input"
                        value={filters.category || ''}
                        onChange={(e) => setFilter('category', e.target.value)}
                        style={{ width: 180 }}
                    >
                        <option value="">Tất cả danh mục</option>
                        <option value="Công việc">Công việc</option>
                        <option value="Học tập">Học tập</option>
                        <option value="Cá nhân">Cá nhân</option>
                    </select>
                </div>
            </div>

            {/* ── Modals ── */}
            {/* ✅ Modal Xem chi tiết */}
            {viewNotebook && (
                <NoteViewModal
                    note={viewNotebook}
                    onClose={() => setViewNotebook(null)}
                />
            )}

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
                                onView={handleViewClick} // ✅ Truyền hàm onView vào Card
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