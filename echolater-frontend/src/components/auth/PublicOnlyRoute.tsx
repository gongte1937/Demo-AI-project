import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';

interface PublicOnlyRouteProps {
  children: ReactNode;
}

export function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const { isAuthenticated, bootstrapped, initialize } = useAuthStore();

  useEffect(() => {
    if (!bootstrapped) {
      initialize();
    }
  }, [bootstrapped, initialize]);

  if (!bootstrapped) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/app/home" replace />;
  }

  return <>{children}</>;
}
