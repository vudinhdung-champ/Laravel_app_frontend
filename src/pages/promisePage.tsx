import { useEffect, useState } from "react";
import { usePromiseStore } from "@/stores/usePromiseStore";
import type { CreatePromiseRequest, UpdatePromiseRequest } from "@/types/request";
import type { PromiseItem } from "@/types/store";

export default function PromisesPage() {
    const { promises, getAll, isLoading, create, update, delete: deleteNote } = usePromiseStore();

    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState<CreatePromiseRequest>({
        promiser_name: '',
        promise_content: '',
        date_made: '',
        deadline: '',
        status: 'pending',
        importance_level: 0
    });

    const [editPromise, setEditPromise] = useState<PromiseItem | null>(null);

    const [editForm, setEditForm] = useState<UpdatePromiseRequest>({
        promiser_name: '',
        promise_content: '',
        date_made: '',
        deadline: '',
        status: 'pending',
        importance_level: 0
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
            promiser_name: '',
            promise_content: '',
            date_made: '',
            deadline: '',
            status: 'pending',
            importance_level: 0
        });
    };

    // Hàm xử lý form update //
    const handleEditClick = (promise: PromiseItem) => {
        setEditPromise(promise);
        setEditForm({
            promiser_name: promise.promiser_name,
            promise_content: promise.promise_content,
            date_made: promise.date_made,
            deadline: promise.deadline,
            status: promise.status,
            importance_level: promise.importance_level
        });

    }
    // Hàm khi submit form sửa //

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editPromise) return;

        await update(editPromise.id, editForm);
        setEditPromise(null);
    };


    if (isLoading) {
        return <p>Đang tải...</p>;
    }

    return (
        <div>
            <h1>Promises</h1>
            <button onClick={() => setShowForm(true)}>Tạo mới</button>
            {showForm && (
                <form onSubmit={handleCreate}>
                    <input placeholder="Người hứa" value={form.promiser_name}
                        onChange={(e) => setForm({ ...form, promiser_name: e.target.value })} required
                    />
                    <input placeholder="Nội dung" value={form.promise_content}
                        onChange={(e) => setForm({ ...form, promise_content: e.target.value })} required
                    />
                    <input placeholder="Ngày hứa" value={form.date_made}
                        onChange={(e) => setForm({ ...form, date_made: e.target.value })} required
                    />
                    <input placeholder="Thời hạn" value={form.deadline}
                        onChange={(e) => setForm({ ...form, deadline: e.target.value })} required
                    />
                    <input type="text" placeholder="Trạng thái" value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value as "pending" | "completed" | "cancelled" })} required
                    />
                    <input type="number" placeholder="Độ quan trọng" value={form.importance_level}
                        onChange={(e) => setForm({ ...form, importance_level: Number(e.target.value) })} required
                    />
                    <button type="submit">Lưu</button>
                    <button type="button" onClick={() => setShowForm(false)}>Huỷ</button>
                </form>
            )}

            {editPromise && (
                <form onSubmit={handleUpdate}>
                    <h3>Sửa Promise # {editPromise.id}</h3>
                    <input
                        placeholder="Người hứa" value={editForm.promiser_name}
                        onChange={(e) => setEditForm({ ...editForm, promiser_name: e.target.value })}
                    />
                    <input
                        placeholder="Nội dung"
                        value={editForm.promise_content}
                        onChange={(e) => setEditForm({ ...editForm, promise_content: e.target.value })}
                    />
                    <input
                        placeholder="Ngày hứa"
                        value={editForm.date_made}
                        onChange={(e) => setEditForm({ ...editForm, date_made: e.target.value })}
                        required
                    />
                    <input placeholder="Thời hạn" value={editForm.deadline}
                        onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })} required
                    />
                    <input type="text" placeholder="Trạng thái" value={editForm.status}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value as "pending" | "completed" | "cancelled" })} required
                    />
                    <input type="number" placeholder="Độ quan trọng" value={editForm.importance_level}
                        onChange={(e) => setEditForm({ ...editForm, importance_level: Number(e.target.value) })} required
                    />
                    <button type="submit">Lưu</button>
                    <button type="button" onClick={() => setEditPromise(null)}>Huỷ</button>
                </form>
            )}

            <ul>
                {promises.map((n) => (
                    <li key={n.id}>
                        <strong>{n.promiser_name}</strong> - {n.promise_content}
                        <p>{n.date_made}</p>
                        <p>{n.status}</p>
                        <p>{n.importance_level}</p>
                        <button onClick={() => handleEditClick(n)}>Sửa</button>
                        <button onClick={() => deleteNote(n.id)}>Xoá</button>
                    </li>
                ))}
            </ul>
        </div>
    )

}