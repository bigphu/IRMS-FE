import { submitLogout } from "../../api";
import { useMutation } from "@tanstack/react-query";

export const useLogout = () => {
  return useMutation({
    mutationKey: ["logout"],
    mutationFn: () => submitLogout(),
  });
}