import React from 'react';

interface PaginationProps {
    page: number;
    lastPage: number;
    total: number;
    setPage: (page: number) => void;
}

export default function Pagination({ page, lastPage, total, setPage }: PaginationProps) {
    if (lastPage <= 1) return null;

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 32, marginBottom: 32 }}>
            <button 
                className="btn btn-secondary btn-sm" 
                disabled={page <= 1} 
                onClick={() => setPage(page - 1)}
            >
                ← Trước
            </button>
            
            <span style={{ fontSize: '0.875rem', color: 'var(--text)' }}>
                Trang {page} / {lastPage} (Tổng: {total})
            </span>
            
            <button 
                className="btn btn-secondary btn-sm" 
                disabled={page >= lastPage} 
                onClick={() => setPage(page + 1)}
            >
                Sau →
            </button>
        </div>
    );
}
