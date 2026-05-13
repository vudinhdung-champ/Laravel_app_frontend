import { useEffect, useState } from "react";
import { useNotebookStore } from "@/stores/useNotebookStore";
import type { CreateNotebookRequest, UpdateNotebookRequest } from "@/types/request";
import type { Notebook } from "@/types/store";

export default function NotebooksPage() {
    const { notebooks, getAll, isLoading, create, update, delete: deleteNote } = useNotebookStore();

    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState<CreateNotebookRequest>({
        title: '',
        content: '',
        category: '',
    });

    const [editNotebook, setEditNotebook] = useState<Notebook | null>(null);

    const [editForm, setEditForm] = useState<UpdateNotebookRequest>({
        title: '',
        content: '',
        category: '',
    });

    useEffect(() => {
        getAll();
    }, []);

    // Hàm xử lý tạo mới //
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        await create(form);
        setShowForm(false);
        setForm({
            title: '',
            content: '',
            category: ''
        });
    };

    // Hàm xử lý form update //
    const handleEditClick = (notebook: Notebook) => {
        setEditNotebook(notebook);
        setEditForm({
            title: notebook.title,
            content: notebook.content,
            category: notebook.category,
        });

    }
    // Hàm khi submit form sửa //

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editNotebook) return;

        await update(editNotebook.id, editForm);
        setEditNotebook(null);
    };


    if (isLoading) {
        return <p>Đang tải...</p>;
    }

    return (
        <div>
            <h1>Notebooks</h1>
            <button onClick={() => setShowForm(true)}>Tạo mới</button>
            {showForm && (
                <form onSubmit={handleCreate}>
                    <input placeholder="Tiêu đề" value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })} required
                    />
                    <input placeholder="Thể loại" value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })} required
                    />

                    <input placeholder="Nội dung" value={form.content}
                        onChange={(e) => setForm({ ...form, content: e.target.value })} required
                    />
                    <button type="submit">Lưu</button>
                    <button type="button" onClick={() => setShowForm(false)}>Huỷ</button>
                </form>
            )}

            {editNotebook && (
                <form onSubmit={handleUpdate}>
                    <h3>Sửa Notebook # {editNotebook.id}</h3>
                    <input
                        placeholder="Tiêu đề" value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    />
                    <input
                        placeholder="Thể loại"
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    />
                    <input
                        placeholder="Nội dung"
                        value={editForm.content}
                        onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                        required
                    />
                    <button type="submit">Lưu</button>
                    <button type="button" onClick={() => setEditNotebook(null)}>Huỷ</button>
                </form>
            )}

            <ul>
                {notebooks.map((n) => (
                    <li key={n.id}>
                        <strong>{n.title}</strong> - {n.category}
                        <p>{n.content}</p>
                        <button onClick={() => handleEditClick(n)}>Sửa</button>
                        <button onClick={() => deleteNote(n.id)}>Xoá</button>
                    </li>
                ))}
            </ul>
        </div>
    )

}