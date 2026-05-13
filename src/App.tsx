import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from '@/components/ProtectedRoute';

// Auth pages
import LoginPage from '@/pages/loginPage';
import RegisterPage from '@/pages/registerPage';

// App pages
import Layout from '@/components/layout';
import DashboardPage from '@/pages/dashboardPage';
import NotebooksPage from '@/pages/notebookPage';
import PromisesPage from '@/pages/promisePage';
import SubscriptionsPage from '@/pages/subscriptionPage';

export default function App() {
    return (
        <BrowserRouter>
            <Toaster position="top-right" />
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected routes */}
                <Route path="/" element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="notebooks" element={<NotebooksPage />} />
                    <Route path="promises" element={<PromisesPage />} />
                    <Route path="subscriptions" element={<SubscriptionsPage />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
