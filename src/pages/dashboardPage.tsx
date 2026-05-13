import { useAuthStore } from '@/stores/useAuthStore';

export default function DashboardPage() {
    const user = useAuthStore((state) => state.user);

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Chào mừng, {user?.name ?? 'người dùng'}!</p>
        </div>
    );
}
