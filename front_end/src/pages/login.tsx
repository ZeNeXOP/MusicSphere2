import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "@hooks/useAuth";
import { handleApiError } from "@api/client";
import { Card } from "@components/ui/Card";
import { Button } from "@components/ui/Button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await loginMutation.mutateAsync({ email, password });
      navigate("/dashboard");
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand/40 via-black to-apple-red/40">
      <Card className="max-w-md w-full p-8 space-y-8 bg-surface/90 backdrop-blur-md">
        <h2 className="text-3xl font-extrabold text-primary text-center mb-2">
          Sign in to your account
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {(error || loginMutation.error) && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error || handleApiError(loginMutation.error)}
            </div>
          )}
          <div className="space-y-4">
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-md text-primary focus:outline-none focus:ring-2 focus:ring-brand"
              placeholder="Email address"
            />
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-md text-primary focus:outline-none focus:ring-2 focus:ring-brand"
              placeholder="Password"
            />
          </div>
          <Button
            type="submit"
            loading={loginMutation.isPending}
            className="w-full mt-2"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </Button>
          <div className="text-center">
            <span className="text-muted">Don't have an account? </span>
            <Link
              to="/register"
              className="font-medium text-brand hover:underline"
            >
              Sign up
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Login;
