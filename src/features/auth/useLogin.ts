import type { LoginPayload } from "../../types/api";
import { submitLogin } from "../../api/auth";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: (loginInfo: LoginPayload) => submitLogin(loginInfo),
  });
}