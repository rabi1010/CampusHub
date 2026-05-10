import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { setCredentials } from "./authSlice";
import { useAppDispatch } from "../../app/hooks";
import type { LoginPayload } from "../../services/authService";
import type { LoginFormValues } from "./authSchemas";

const ROLE_REDIRECT = {
  admin: "/dashboard/admin",
  teacher: "/dashboard/teacher",
  student: "/dashboard/student",
} as const;

export function useLogin() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    // ── Real API call ──────────────────────────────────
    mutationFn: (payload: LoginFormValues) =>
      authService.login({
        ...payload,
        role: payload.role.toUpperCase() as LoginPayload["role"],
      }),

    onSuccess: (data) => {
      localStorage.setItem("token", data.token);

      dispatch(
        setCredentials({
          user: {
            id: data.user.id,
            email: data.user.email,
            fullName: data.user.fullName,
            role: data.user.role.toLowerCase() as
              | "admin"
              | "teacher"
              | "student",
          },
          token: data.token,
        }),
      );

      const roleKey =
        data.user.role.toLowerCase() as keyof typeof ROLE_REDIRECT;
      const redirect = ROLE_REDIRECT[roleKey] ?? "/dashboard/student";

      navigate(redirect);
    },
  });
}
// import { useMutation } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
// import { setCredentials } from "./authSlice";
// import { useAppDispatch } from "../../app/hooks";
// import type { LoginPayload } from "../../services/authService";

// const ROLE_REDIRECT = {
//   admin: "/dashboard/admin",
//   teacher: "/dashboard/teacher",
//   student: "/dashboard/student",
// } as const;

// export function useLogin() {
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();

//   return useMutation({
//     mutationFn: async (payload: LoginPayload) => {
//       console.log("✅ MOCK RUNNING");
//       await new Promise((r) => setTimeout(r, 800));
//       return {
//         token: "mock-jwt-token-" + payload.role,
//         user: {
//           id: "1",
//           email: payload.email,
//           fullName:
//             payload.role === "admin"
//               ? "Admin User"
//               : payload.role === "teacher"
//                 ? "John Doe"
//                 : "Aarav Sharma",
//           role: payload.role,
//         },
//       };
//     },
//     onSuccess: (data) => {
//       dispatch(setCredentials({ user: data.user, token: data.token }));
//       navigate(ROLE_REDIRECT[data.user.role]);
//     },
//   });
// }
