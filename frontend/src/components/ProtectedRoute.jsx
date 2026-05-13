'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../lib/store/useAuthStore';

/**
 * ProtectedRoute Component
 * 
 * High-order component to protect routes based on authentication and role.
 * 
 * @param {React.ReactNode} children - The content to render if authorized
 * @param {Array<string>} allowedRoles - List of roles permitted to access this route
 */
export default function ProtectedRoute({ children, allowedRoles = [] }) {
    const { user, isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        // 1. Check if user is authenticated
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        // 2. Check if user has required role
        if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
            router.push('/'); // Redirect to home if unauthorized
            return;
        }
    }, [isAuthenticated, user, allowedRoles, router]);

    // Show nothing while checking (can add a loader here)
    if (!isAuthenticated || (allowedRoles.length > 0 && !allowedRoles.includes(user?.role))) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return <>{children}</>;
}
