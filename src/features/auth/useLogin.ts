// import { useMutation } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
// import { authService } from "../../services/authService";
// import { setCredentials } from "./authSlice";
// import { useAppDispatch } from "../../app/hooks";
// import type { LoginPayload } from "../../services/authService";

// // Redirect map — each role goes to their own dashboard
// const ROLE_REDIRECT = {
//   admin: "/dashboard/admin",
//   teacher: "/dashboard/teacher",
//   student: "/dashboard/student",
// } as const;

// export function useLogin() {
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();

//   return useMutation({
//     mutationFn: (payload: LoginPayload) => authService.login(payload),

//     onSuccess: (data) => {
//       // 1. Store in Redux (and localStorage via the slice)
//       dispatch(setCredentials({ user: data.user, token: data.token }));

//       // 2. Redirect to role-specific dashboard
//       navigate(ROLE_REDIRECT[data.user.role]);
//     },

//     onError: (error: unknown) => {
//       // Error is handled in the component via mutation.error
//       console.error("Login failed:", error);
//     },
//   });
// }

import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "./authSlice";
import { useAppDispatch } from "../../app/hooks";
import type { LoginPayload } from "../../services/authService";

const ROLE_REDIRECT = {
  admin: "/dashboard/admin",
  teacher: "/dashboard/teacher",
  student: "/dashboard/student",
} as const;

export function useLogin() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      console.log("✅ MOCK RUNNING");
      await new Promise((r) => setTimeout(r, 800));
      return {
        token: "mock-jwt-token-" + payload.role,
        user: {
          id: "1",
          email: payload.email,
          fullName:
            payload.role === "admin"
              ? "Admin User"
              : payload.role === "teacher"
                ? "John Doe"
                : "Aarav Sharma",
          role: payload.role,
        },
      };
    },
    onSuccess: (data) => {
      dispatch(setCredentials({ user: data.user, token: data.token }));
      navigate(ROLE_REDIRECT[data.user.role]);
    },
  });
}
