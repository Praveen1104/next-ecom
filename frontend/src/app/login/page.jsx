'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '../../components/AuthForm';
import { loginUser } from '../../lib/api';

/**
 * User Login Page
 * Uses Client-Side Rendering (CSR) to handle form submission and state.
 */
export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (formData) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await loginUser(formData.email, formData.password);
      
      // Assuming the backend returns a token in the response body.
      // In a real application, you would save this token securely (e.g., HTTP-only cookie).
      // Here, we simulate setting a cookie using document.cookie for simplicity in CSR.
      // A better approach is handling it via a Next.js Server Action or API Route.
      document.cookie = `session_token=${response.data.accessToken}; path=/; max-age=86400; Secure; SameSite=Strict`;
      
      // Redirect to profile or home page on success
      router.push('/profile');
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm 
      type="login" 
      onSubmit={handleLogin} 
      isLoading={isLoading} 
      error={error} 
    />
  );
}
