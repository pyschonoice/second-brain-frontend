// src/pages/Auth/SignIn.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthForm } from '../../components/forms/AuthForm';
import { signin } from '../../api/auth';
import { useAuth } from '../../hooks/useAuth';

const SignIn: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth(); // Get the login function from AuthContext

  const handleSignIn = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null); // Clear previous errors

    try {
      const response = await signin({ username, password });
      if (response.message == "Login successful.") {
        // If login is successful, call the login context function
        login(response.accessToken);

        // Redirect to dashboard after a short delay to show the success message
        setTimeout(() => {
          navigate('/');
        }, 1000); // Redirect after 1 second
      } else {
        // If login is not successful (but no network error), display the backend message
        setError(response.message || 'Sign in failed. Please try again.');
      }
    } catch (err: any) {
      // Catch network errors (like CORS, 502 Bad Gateway) or other unexpected errors
      console.error('Sign in error:', err);
      setError(err?.message || 'An unexpected error occurred during sign in.');
    } finally {
      setIsLoading(false); // Always stop loading, regardless of success or failure
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <div className="text-center">
        <AuthForm
          isSignUp={false}
          onSubmit={handleSignIn}
          isLoading={isLoading}
          error={error}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
