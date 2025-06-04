import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegister } from "@hooks/useAuth";
import { handleApiError } from "@api/client";
import { Card } from "@components/ui/Card";
import { Button } from "@components/ui/Button";
import { FaEye, FaEyeSlash, FaGoogle, FaApple } from "react-icons/fa6";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const registerMutation = useRegister();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      await registerMutation.mutateAsync({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      navigate("/dashboard");
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    }
  };

  // Password strength hint
  const passwordHint =
    "At least 8 characters, 1 number, 1 uppercase, 1 special character";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-brand/40 via-black to-apple-red/40">
      <Card className="max-w-md w-full p-8 space-y-8 bg-surface/90 backdrop-blur-md border-white">
        {/* Branding */}
        <div className="flex flex-col items-center mb-2">
          <span className="text-4xl font-display font-bold text-white tracking-tight drop-shadow-lg select-none">
            <span className="text-brand">Music</span>
            <span className="text-apple-red">Sphere</span>
          </span>
          <span className="text-white text-sm mt-1">
            Create your free account and join the music revolution!
          </span>
        </div>

        {/* Social sign up */}
        <div className="flex gap-3 mb-2">
          <Button
            type="button"
            variant="secondary"
            color="white"
            className="flex-1"
            icon={<FaGoogle />}
            disabled
          >
            Google
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            icon={<FaApple />}
            disabled
          >
            Apple
          </Button>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 h-px bg-border" />
          <span className="text-white text-m">or sign up with email</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <form
          className="space-y-6"
          onSubmit={handleSubmit}
          aria-label="Registration form"
        >
          {(error || registerMutation.error) && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
              role="alert"
            >
              {error || handleApiError(registerMutation.error)}
            </div>
          )}
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-white mb-1 block">
                Username
              </span>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-background border border-white rounded-md text-primary focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder="Username"
                aria-label="Username"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-white mb-1 block">
                Email
              </span>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-background border border-white rounded-md text-primary focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder="Email address"
                aria-label="Email address"
              />
            </label>
            <label className="block relative">
              <span className="text-sm font-medium text-white mb-1 block">
                Password
              </span>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-background border border-white rounded-md text-primary focus:outline-none focus:ring-2 focus:ring-brand pr-10"
                placeholder="Password"
                aria-label="Password"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-8 text-black hover:text-primary bg-transparent shadow-none border-none p-0"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              <span className="text-xs text-white mt-1 block">
                {passwordHint}
              </span>
            </label>
            <label className="block relative">
              <span className="text-sm font-medium text-white mb-1 block">
                Confirm Password
              </span>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-background border border-white rounded-md text-primary focus:outline-none focus:ring-2 focus:ring-brand pr-10"
                placeholder="Confirm Password"
                aria-label="Confirm Password"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-2 top-6 text-muted hover:text-primary bg-transparent shadow-none border-none p-0"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </label>
          </div>
          <Button
            type="submit"
            loading={registerMutation.isPending}
            className="w-full mt-2 bg-black text-black border border-white"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="loader border-t-2 border-b-2 border-white rounded-full w-4 h-4 animate-spin" />
                Creating account...
              </span>
            ) : (
              "Create account"
            )}
          </Button>
          <div className="text-center text-xs text-white mt-2">
            By signing up, you agree to our{" "}
            <a href="#" className="underline hover:text-brand">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-brand">
              Privacy Policy
            </a>
            .
          </div>
          <div className="text-center">
            <span className="text-white">Already have an account? </span>
            <Link
              to="/login"
              className="font-medium text-brand hover:underline"
            >
              Sign in
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Register;
