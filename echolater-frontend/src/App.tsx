import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Toaster } from '@/components/ui/toaster';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PublicOnlyRoute } from '@/components/auth/PublicOnlyRoute';
import { useAuthStore } from '@/stores/useAuthStore';

// Lazy load pages
const HomePage = lazy(() => import('@/pages/home'));
const RecordPage = lazy(() => import('@/pages/record'));
const DetailPage = lazy(() => import('@/pages/detail'));
const SearchPage = lazy(() => import('@/pages/search'));
const SettingsPage = lazy(() => import('@/pages/settings'));
const LoginPage = lazy(() => import('@/pages/login'));
const RegisterPage = lazy(() => import('@/pages/register'));
const ResetPasswordPage = lazy(() => import('@/pages/reset-password'));
const NotFoundPage = lazy(() => import('@/pages/not-found'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-full min-h-[200px]">
      <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

function RootRedirect() {
  const { isAuthenticated, bootstrapped, initialize } = useAuthStore();
  useEffect(() => {
    if (!bootstrapped) initialize();
  }, [bootstrapped, initialize]);
  if (!bootstrapped) return <PageLoader />;
  return <Navigate to={isAuthenticated ? '/app/home' : '/login'} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<RootRedirect />} />

          <Route
            path="/login"
            element={(
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            )}
          />
          <Route
            path="/register"
            element={(
              <PublicOnlyRoute>
                <RegisterPage />
              </PublicOnlyRoute>
            )}
          />
          <Route
            path="/reset-password"
            element={(
              <PublicOnlyRoute>
                <ResetPasswordPage />
              </PublicOnlyRoute>
            )}
          />

          {/* App shell with layout */}
          <Route
            path="/app"
            element={(
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            )}
          >
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<HomePage />} />
            <Route path="record" element={<RecordPage />} />
            <Route path="detail/:id" element={<DetailPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Toaster />
    </BrowserRouter>
  );
}
