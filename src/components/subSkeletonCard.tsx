// ─── Khung xương nhấp nháy (Skeleton Loading) ──────────
export const SubSkeletonCard = () => (
    <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* Icon giả */}
                <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 10 }}></div>
                <div>
                    {/* Tên dịch vụ giả */}
                    <div className="skeleton" style={{ width: 120, height: 16, marginBottom: 6 }}></div>
                    {/* Badge giả */}
                    <div className="skeleton" style={{ width: 70, height: 16, borderRadius: 999 }}></div>
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                {/* Giá tiền giả */}
                <div className="skeleton" style={{ width: 80, height: 20 }}></div>
                {/* Chu kỳ giả */}
                <div className="skeleton" style={{ width: 50, height: 12 }}></div>
            </div>
        </div>

        {/* Khối ngày tháng giả */}
        <div className="skeleton" style={{ width: '100%', height: 32, borderRadius: 8, marginBottom: 12 }}></div>

        {/* Khối ghi chú giả */}
        <div className="skeleton" style={{ width: '80%', height: 12, marginBottom: 10 }}></div>

        <div className="divider" />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            {/* 2 Nút bấm giả */}
            <div className="skeleton" style={{ width: 50, height: 28, borderRadius: 6 }}></div>
            <div className="skeleton" style={{ width: 50, height: 28, borderRadius: 6 }}></div>
        </div>
    </div>
);