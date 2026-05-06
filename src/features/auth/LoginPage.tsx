// src/features/auth/LoginPage.tsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, InputBox } from "@/components";
import { useAuth } from "@/hooks";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submitLogin = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const user = await login({ email, password });
      if (user.role === "CHEF" || user.role === "MANAGER") {
        navigate("/kds", { replace: true });
        return;
      }
      navigate("/menu", { replace: true });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setErrorMessage("Invalid email or password.");
      } else {
        setErrorMessage("Login failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    void submitLogin();
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

          {errorMessage ? (
            <p className="text-danger text-sm font-semibold">{errorMessage}</p>
          ) : null}

          <Button
            variant="full-primary"
            type="submit"
            disabled={isSubmitting}
            className="mt-4 py-2 text-lg"
          >
            {isSubmitting ? "LOGGING IN..." : "LOG IN"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
