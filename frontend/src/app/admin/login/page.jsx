'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '../../../components/AuthForm';
import { loginAdmin } from '../../../lib/api';

/**
 * Admin Login Page
 * Uses Client-Side Rendering (CSR) for secure admin authentication.
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdminLogin = async (formData) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await loginAdmin(formData.email, formData.password);
      
      // Store the admin session token.
      // We use a different cookie name to distinguish from regular user sessions.
      document.cookie = `admin_token=${response.token}; path=/; max-age=86400; Secure; SameSite=Strict`;
      
      // Redirect to the admin dashboard
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Unauthorized. Please check your admin credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="pt-12 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Admin Access Only</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Please sign in with your administrative credentials.
        </p>
      </div>
      
      <AuthForm 
        type="admin" 
        onSubmit={handleAdminLogin} 
        isLoading={isLoading} 
        error={error} 
      />
    </div>
  );
}
