import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthForm } from "../../components/forms/AuthForm";
import { signup } from "../../api/auth";

const SignUp: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignUp = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await signup({ username, password });
      if (response.success) {
        alert(
          response.message || "Account created successfully! Please sign in."
        );
        navigate("/signin");
      } else {
        setError(response.message || "Sign up failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Sign up error:", err);

      setError(err?.message || "An unexpected error occurred during sign up.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <div className="text-center">
        <AuthForm
          isSignUp={true}
          onSubmit={handleSignUp}
          isLoading={isLoading}
          error={error}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/signin" className="text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
