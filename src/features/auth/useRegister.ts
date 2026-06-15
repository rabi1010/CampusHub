import { useMutation } from "@tanstack/react-query"
import { useNavigate }  from "react-router-dom"
import { useToast }     from "@/Component/ui/Toast"
import type { RegisterFormData } from "./authSchemas"
import api from "@/services/axios"

export function useRegister() {
  const navigate = useNavigate()
  const toast    = useToast()

  return useMutation({
    mutationFn: async (data: RegisterFormData) => {
      // Build payload — only send childRollNumbers if PARENT
      const payload: any = {
        fullName: data.fullName,
        email:    data.email,
        password: data.password,
        phone:    data.phone,
        role:     data.role,
      }

      if (data.role === "PARENT" && data.childRollNumbers) {
        // Filter empty strings
        payload.childRollNumbers = data.childRollNumbers.filter(
          (r) => r.trim() !== ""
        )
      }

      const res = await api.post("/auth/register", payload)
      return res.data
    },

    onSuccess: () => {
      toast.success(
        "Account created",
        "Please wait for admin approval. Check your email."
      )
      navigate("/login")
    },

    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Registration failed"
      toast.error("Registration failed", message)
    },
  })
}
