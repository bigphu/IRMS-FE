import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, InputBox } from "../../components";
import { MailIcon, LockIcon } from "lucide-react";

import { useAppDispatch } from "../../store/hooks";
import { setCredentials } from "../../store/slices/authSlice";

import { useLogin } from "./useLogin";

import type { User, LoginPayload, UserRole } from "../../types/api";

export const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutateAsync: loginMutation, isPending } = useLogin();

  const handleLoginSubmit = async () => {
    setErrorMessage(null);

    try {
      const loginInfo: LoginPayload = { email, password };
      const res = await loginMutation(loginInfo);

      const loggedInUser: User = {
        id: Number(res.userId),
        email: res.email,
        role: res.role as UserRole,
      };

      dispatch(setCredentials({ user: loggedInUser }));
      if (loggedInUser.role === "CHEF" || loggedInUser.role === "MANAGER") {
        navigate("/kds", { replace: true });
        return;
      }
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Login failed: ", error);
      setErrorMessage("Invalid email or password!");
    }
  };

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    handleLoginSubmit();
  };

  return (
    <div className="bg-surface relative flex h-screen w-screen items-center justify-center overflow-hidden">
      <div className="z-10 flex items-center w-full flex-col px-6">
        <h1 className="text-primary w-[60%] mb-4 text-center text-8xl leading-tight tracking-wide">
          WELCOME BACK
        </h1>

        <p className="text-on-surface text-center mb-6 text-sm font-mono font-medium leading-tight tracking-wide">
          Please login with your provided
          <br />
          Email and Password.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-[30%]">
          <InputBox
            id="email"
            label="Email"
            type="email"
            placeholder="user@example.com"
            icon={<MailIcon />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <InputBox
            id="password"
            label="Password"
            type="password"
            placeholder="Password"
            icon={<LockIcon />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {errorMessage && (
            <p className="text-danger font-mono font-bold text-center text-sm my-2">
              {errorMessage}
            </p>
          )}

          <Button variant="full-primary" type="submit" disabled={isPending}>
            {isPending ? "LOGGING IN..." : "LOG IN"}
          </Button>
        </form>
      </div>
    </div>
  );
};
