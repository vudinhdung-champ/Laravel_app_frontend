import { useEffect, useState } from "react";
import { useSubStore } from "@/stores/useSubStore";
import type { CreateSubscriptionRequest, UpdateSubscriptionRequest } from "@/types/request";
import type { Subscription } from "@/types/store";

export default function SubscriptionsPage() {
    const { subscriptions, getAll, isLoading, create, update, delete: deleteSub } = useSubStore();

    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState<CreateSubscriptionRequest>({
        service_name: '',
        price: 0,
        billing_cycle: '',
        next_billing_date: '',
        status: 'active',
        notes: '',
    });

    const [editSub, setEditSub] = useState<Subscription | null>(null);

    const [editForm, setEditForm] = useState<UpdateSubscriptionRequest>({
        service_name: '',
        price: 0,
        billing_cycle: '',
        next_billing_date: '',
        status: 'active',
        notes: '',
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
            service_name: '',
            price: 0,
            billing_cycle: '',
            next_billing_date: '',
            status: 'active',
            notes: '',
        });
    };

    // Hàm mở form sửa //
    const handleEditClick = (sub: Subscription) => {
        setEditSub(sub);
        setEditForm({
            service_name: sub.service_name,
            price: sub.price,
            billing_cycle: sub.billing_cycle,
            next_billing_date: sub.next_billing_date,
            status: sub.status,
            notes: sub.notes,
        });
    };

    // Hàm submit form sửa //
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editSub) return;
        await update(editSub.id, editForm);
        setEditSub(null);
    };

    if (isLoading) {
        return <p>Đang tải...</p>;
    }

    return (
        <div>
            <h1>Subscriptions</h1>
            <button onClick={() => setShowForm(true)}>Tạo mới</button>

            {/* Form tạo mới */}
            {showForm && (
                <form onSubmit={handleCreate}>
                    <input
                        placeholder="Tên dịch vụ"
                        value={form.service_name}
                        onChange={(e) => setForm({ ...form, service_name: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Giá tiền"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                        required
                    />
                    <input
                        placeholder="Chu kỳ (monthly, yearly...)"
                        value={form.billing_cycle}
                        onChange={(e) => setForm({ ...form, billing_cycle: e.target.value })}
                        required
                    />
                    <input
                        type="date"
                        placeholder="Ngày thanh toán tiếp theo"
                        value={form.next_billing_date}
                        onChange={(e) => setForm({ ...form, next_billing_date: e.target.value })}
                        required
                    />
                    <select
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value as 'active' | 'inactive' | 'cancelled' })}
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <input
                        placeholder="Ghi chú"
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    />
                    <button type="submit">Lưu</button>
                    <button type="button" onClick={() => setShowForm(false)}>Huỷ</button>
                </form>
            )}

            {/* Form sửa */}
            {editSub && (
                <form onSubmit={handleUpdate}>
                    <h3>Sửa Subscription #{editSub.id}</h3>
                    <input
                        placeholder="Tên dịch vụ"
                        value={editForm.service_name}
                        onChange={(e) => setEditForm({ ...editForm, service_name: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Giá tiền"
                        value={editForm.price}
                        onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                    />
                    <input
                        placeholder="Chu kỳ"
                        value={editForm.billing_cycle}
                        onChange={(e) => setEditForm({ ...editForm, billing_cycle: e.target.value })}
                    />
                    <input
                        type="date"
                        placeholder="Ngày thanh toán tiếp theo"
                        value={editForm.next_billing_date}
                        onChange={(e) => setEditForm({ ...editForm, next_billing_date: e.target.value })}
                    />
                    <select
                        value={editForm.status}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value as 'active' | 'inactive' | 'cancelled' })}
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <input
                        placeholder="Ghi chú"
                        value={editForm.notes}
                        onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                    />
                    <button type="submit">Lưu thay đổi</button>
                    <button type="button" onClick={() => setEditSub(null)}>Huỷ</button>
                </form>
            )}

            {/* Danh sách */}
            <ul>
                {subscriptions.map((s) => (
                    <li key={s.id}>
                        <strong>{s.service_name}</strong> — {s.price.toLocaleString('vi-VN')}đ
                        <p>Chu kỳ: {s.billing_cycle} | Ngày thu: {s.next_billing_date}</p>
                        <p>Trạng thái: {s.status}</p>
                        <button onClick={() => handleEditClick(s)}>Sửa</button>
                        <button onClick={() => deleteSub(s.id)}>Xoá</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
