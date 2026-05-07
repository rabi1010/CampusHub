import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authService, type RegisterPayload } from "../../services/authService";

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),

    onSuccess: (data) => {
      // Don't log them in — account is pending admin approval.
      // Send to login page with a success message via router state.
      navigate("/login", {
        state: {
          message: `Account created! Welcome ${data.user.fullName}. 
                    Please wait for admin approval before logging in.`,
        },
      });
    },

    // onError handled in component via mutation.isError
  });
}
