import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import {
  teacherSchema,
  teacherEditSchema,
  type TeacherFormValues,
} from "./teacherSchemas";
import type { Teacher } from "../../services/teacherService";

const DEPARTMENTS = [
  "Computer Science",
  "Information Technology",
  "Electronics",
  "Civil Engineering",
  "Mechanical Engineering",
];

const QUALIFICATIONS = [
  "B.E / B.Tech",
  "M.Sc Computer Science",
  "M.Tech IT",
  "M.E Civil",
  "M.E Mechanical",
  "Ph.D Computer Science",
  "Other",
];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-mono text-ink-400 mb-1.5 uppercase tracking-wider">
      {children}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
      <AlertCircle size={11} />
      {message}
    </p>
  );
}

interface TeacherFormProps {
  teacher?: Teacher;
  onSubmit: (data: TeacherFormValues) => void;
  isLoading?: boolean;
}

export default function TeacherForm({
  teacher,
  onSubmit,
  isLoading = false,
}: TeacherFormProps) {
  const isEdit = !!teacher;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TeacherFormValues>({
    resolver: zodResolver(
      isEdit ? teacherEditSchema : teacherSchema,
    ) as Resolver<TeacherFormValues>,
    defaultValues: isEdit
      ? {
          fullName: teacher.fullName,
          email: teacher.email,
          employeeId: teacher.employeeId,
          department: teacher.department,
          qualification: teacher.qualification,
          phone: teacher.phone,
          password: "",
        }
      : {
          fullName: "",
          email: "",
          employeeId: "",
          department: "",
          qualification: "",
          phone: "",
          password: "",
        },
  });

  useEffect(() => {
    if (teacher) {
      reset({
        fullName: teacher.fullName,
        email: teacher.email,
        employeeId: teacher.employeeId,
        department: teacher.department,
        qualification: teacher.qualification,
        phone: teacher.phone,
        password: "",
      });
    } else {
      reset();
    }
  }, [teacher, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-5"
    >
      {/* Row 1 — Full name + Employee ID */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel>Full name</FieldLabel>
          <input
            type="text"
            placeholder="John Doe"
            className={`input-field ${errors.fullName ? "input-error" : ""}`}
            {...register("fullName")}
          />
          <FieldError message={errors.fullName?.message} />
        </div>
        <div>
          <FieldLabel>Employee ID</FieldLabel>
          <input
            type="text"
            placeholder="EMP001"
            className={`input-field ${errors.employeeId ? "input-error" : ""}`}
            {...register("employeeId")}
          />
          <FieldError message={errors.employeeId?.message} />
        </div>
      </div>

      {/* Row 2 — Email + Phone */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel>Email address</FieldLabel>
          <input
            type="email"
            placeholder="teacher@college.edu"
            className={`input-field ${errors.email ? "input-error" : ""}`}
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>
        <div>
          <FieldLabel>Phone number</FieldLabel>
          <input
            type="tel"
            placeholder="+977 9800000000"
            className={`input-field ${errors.phone ? "input-error" : ""}`}
            {...register("phone")}
          />
          <FieldError message={errors.phone?.message} />
        </div>
      </div>

      {/* Row 3 — Department + Qualification */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel>Department</FieldLabel>
          <select
            className={`input-field ${errors.department ? "input-error" : ""}`}
            {...register("department")}
          >
            <option value="">Select department</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <FieldError message={errors.department?.message} />
        </div>
        <div>
          <FieldLabel>Qualification</FieldLabel>
          <select
            className={`input-field ${errors.qualification ? "input-error" : ""}`}
            {...register("qualification")}
          >
            <option value="">Select qualification</option>
            {QUALIFICATIONS.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
          <FieldError message={errors.qualification?.message} />
        </div>
      </div>

      {/* Password */}
      <div>
        <FieldLabel>
          {isEdit ? "New password (leave blank to keep)" : "Password"}
        </FieldLabel>
        <input
          type="password"
          placeholder={
            isEdit ? "Leave blank to keep current" : "Min 6 characters"
          }
          autoComplete="new-password"
          className={`input-field ${errors.password ? "input-error" : ""}`}
          {...register("password")}
        />
        <FieldError message={errors.password?.message} />
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/[0.07]">
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary px-8 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {isEdit ? "Saving..." : "Adding..."}
            </>
          ) : isEdit ? (
            "Save changes"
          ) : (
            "Add teacher"
          )}
        </button>
      </div>
    </form>
  );
}
