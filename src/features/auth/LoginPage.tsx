// src/features/auth/LoginPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button, InputBox } from "@/components";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login({ email, password });
      // Store token if needed (backend should set it via HttpOnly cookie)
      navigate("/menu");
    } catch (err) {
      setError("Invalid email or password");
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="bg-surface relative flex h-screen w-screen items-center justify-center overflow-hidden">
      <div className="z-10 flex w-full max-w-md flex-col px-6">
        <h1 className="text-primary mb-12 text-center text-5xl leading-tight font-black tracking-wide md:text-6xl">
          WELCOME
          <br />
          BACK
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <InputBox
            id="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            content={email}
            onChange={setEmail}
            required
            className="px-4 py-2"
          />

          <InputBox
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            content={password}
            onChange={setPassword}
            required
            className="px-4 py-2"
          />

          {error && <div className="text-red-500 text-sm font-bold">{error}</div>}

          <Button
            variant="full-primary"
            type="submit"
            disabled={isLoading}
            className="mt-4 py-2 text-lg"
          >
            {isLoading ? "LOGGING IN..." : "LOG IN"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
