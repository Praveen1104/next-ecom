'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '../../components/AuthForm';
import { signupUser } from '../../lib/api';

/**
 * User Signup Page
 * Uses Client-Side Rendering (CSR) for account creation.
 */
export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (formData) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Pass the entire form data to the signup API
      await signupUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });
      
      // On successful signup, redirect to login page
      // Alternatively, you could log them in directly here
      router.push('/login');
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm 
      type="signup" 
      onSubmit={handleSignup} 
      isLoading={isLoading} 
      error={error} 
    />
  );
}
