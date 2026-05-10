import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import type { RegisterPayload } from "../../services/authService";

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    // ── Real API call ──────────────────────────────────
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: (data) => {
      navigate("/login", {
        state: {
          message: `Account created! Welcome ${data.fullName}. Please wait for admin approval before logging in.`,
        },
      });
    },
  });
}
