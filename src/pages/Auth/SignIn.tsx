import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthForm } from "../../components/forms/AuthForm";
import { signin } from "../../api/auth";
import { useAuth } from "../../hooks/useAuth";

const SignIn: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignIn = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await signin({ username, password });
      if (response.message == "Login successful.") {
        // Fix: Check if accessToken is defined before passing to login
        if (response.accessToken) {
          login(response.accessToken);

          setTimeout(() => {
            navigate("/");
          }, 1000);
        } else {
          setError("Login successful, but no access token received.");
        }
      } else {
        setError(response.message || "Sign in failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Sign in error:", err);
      setError(err?.message || "An unexpected error occurred during sign in.");
    } finally {
      setIsLoading(false);
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
          Don't have an account?
          <Link to="/signup" className="text-primary hover:underline ml-1">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;