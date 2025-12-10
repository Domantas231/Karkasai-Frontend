import { Navigate } from 'react-router-dom';
import appState from './appState';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: string;
    requireAuth?: boolean;
    redirectTo?: string;
}

/**
 * A wrapper component that protects routes based on authentication and role requirements.
 * 
 * @param children - The component to render if access is granted
 * @param requiredRole - Optional role required to access the route (e.g., 'Admin')
 * @param requireAuth - Whether authentication is required (default: true)
 * @param redirectTo - Where to redirect if access is denied (default: '/login' for auth, '/' for role)
 */
function ProtectedRoute({ 
    children, 
    requiredRole, 
    requireAuth = true,
    redirectTo 
}: ProtectedRouteProps) {
    const isLoggedIn = appState.userTitle !== "";
    
    // Check authentication
    if (requireAuth && !isLoggedIn) {
        return <Navigate to={redirectTo || '/login'} replace />;
    }
    
    // Check role if specified
    if (requiredRole && !appState.hasRole(requiredRole)) {
        return <Navigate to={redirectTo || '/'} replace />;
    }
    
    return <>{children}</>;
}

/**
 * Shortcut component for admin-only routes.
 */
function AdminRoute({ children, redirectTo = '/' }: { children: React.ReactNode; redirectTo?: string }) {
    return (
        <ProtectedRoute requiredRole="Admin" redirectTo={redirectTo}>
            {children}
        </ProtectedRoute>
    );
}

/**
 * Shortcut component for authenticated-only routes.
 */
function AuthRoute({ children, redirectTo = '/login' }: { children: React.ReactNode; redirectTo?: string }) {
    return (
        <ProtectedRoute requireAuth={true} redirectTo={redirectTo}>
            {children}
        </ProtectedRoute>
    );
}

export { ProtectedRoute, AdminRoute, AuthRoute };