// src/components/forms/AuthForm.tsx
import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export interface AuthFormProps {
  isSignUp: boolean;
  onSubmit: (username: string, password: string) => void;
  isLoading: boolean;
  error: string | null;
}

export const AuthForm: React.FC<AuthFormProps> = ({ isSignUp, onSubmit, isLoading, error }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordMismatchError, setPasswordMismatchError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMismatchError(null); // Clear previous mismatch error

    if (isSignUp && password !== confirmPassword) {
      setPasswordMismatchError('Passwords do not match.');
      return;
    }

    onSubmit(username, password);
  };

  return (
    <form onSubmit={handleSubmit} className="min-w-sm px-10 pt-6 rounded-lg shadow-xl bg-card text-card-foreground border border-border flex-col justify-center items-center">
      <h2 className="text-2xl font-bold text-center mb-6">
        {isSignUp ? 'Create an account' : 'Sign In'}
      </h2>

      {/* Display error message */}
      {error && (
        <div className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive border border-destructive/50 text-sm text-center">
          {error}
        </div>
      )}
      
      {/* Display password mismatch error for sign-up */}
      {passwordMismatchError && isSignUp && (
        <div className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive border border-destructive/50 text-sm text-center">
          {passwordMismatchError}
        </div>
      )}

      <div className="space-y-8">
        <Input
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
        {isSignUp && (
          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
            error={passwordMismatchError}
          />
        )}
      </div>

      <Button type="submit" className="w-full my-6" isLoading={isLoading} disabled={isLoading}>
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </Button>
    </form>
  );
};
