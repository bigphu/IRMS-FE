// src/features/auth/LoginPage.tsx
import { Button, InputBox } from "@/components"; // Importing from your global UI library

const LoginPage = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic
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
          {/* Replacing raw inputs with your InputBox component */}
          <InputBox
            id="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            required
            className="px-4 py-2"
          />

          <InputBox
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            required
            className="px-4 py-2"
          />

          {/* Replacing raw button with your Button component */}
          <Button
            variant="full-primary"
            type="submit"
            className="mt-4 py-2 text-lg"
          >
            LOG IN
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
