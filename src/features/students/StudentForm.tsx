import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import {
  studentSchema,
  studentEditSchema,
  type StudentFormValues,
} from "./studentSchemas";
import type { Student } from "../../services/studentService";

const DEPARTMENTS = [
  "Computer Science",
  "Information Technology",
  "Electronics",
  "Civil Engineering",
  "Mechanical Engineering",
];

const BATCHES = ["2021-2024", "2022-2025", "2023-2026", "2024-2027"];

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

interface StudentFormProps {
  student?: Student;
  onSubmit: (data: StudentFormValues) => void;
  isLoading?: boolean;
}

export default function StudentForm({
  student,
  onSubmit,
  isLoading = false,
}: StudentFormProps) {
  const isEdit = !!student;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<StudentFormValues>({
    resolver: zodResolver(
      isEdit ? studentEditSchema : studentSchema,
    ) as Resolver<StudentFormValues>,
    defaultValues: isEdit
      ? {
          fullName: student.fullName,
          email: student.email,
          rollNo: student.rollNo,
          department: student.department,
          batch: student.batch,
          phone: student.phone,
          address: student.address,
          password: "",
        }
      : {
          fullName: "",
          email: "",
          rollNo: "",
          department: "",
          batch: "",
          phone: "",
          address: "",
          password: "",
        },
  });

  useEffect(() => {
    if (student) {
      reset({
        fullName: student.fullName,
        email: student.email,
        rollNo: student.rollNo,
        department: student.department,
        batch: student.batch,
        phone: student.phone,
        address: student.address,
        password: "",
      });
    } else {
      reset();
    }
  }, [student, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-5"
    >
      {/* Row 1: Full name + Roll No */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel>Full name</FieldLabel>
          <input
            type="text"
            placeholder="Aarav Sharma"
            className={`input-field ${errors.fullName ? "input-error" : ""}`}
            {...register("fullName")}
          />
          <FieldError message={errors.fullName?.message} />
        </div>
        <div>
          <FieldLabel>Roll number</FieldLabel>
          <input
            type="text"
            placeholder="BCA001"
            className={`input-field ${errors.rollNo ? "input-error" : ""}`}
            {...register("rollNo")}
          />
          <FieldError message={errors.rollNo?.message} />
        </div>
      </div>

      {/* Row 2: Email + Phone */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel>Email address</FieldLabel>
          <input
            type="email"
            placeholder="student@college.edu"
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

      {/* Row 3: Department + Batch */}
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
          <FieldLabel>Batch</FieldLabel>
          <select
            className={`input-field ${errors.batch ? "input-error" : ""}`}
            {...register("batch")}
          >
            <option value="">Select batch</option>
            {BATCHES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <FieldError message={errors.batch?.message} />
        </div>
      </div>

      {/* Address */}
      <div>
        <FieldLabel>Address</FieldLabel>
        <input
          type="text"
          placeholder="Kathmandu, Nepal"
          className={`input-field ${errors.address ? "input-error" : ""}`}
          {...register("address")}
        />
        <FieldError message={errors.address?.message} />
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
            "Add student"
          )}
        </button>
      </div>
    </form>
  );
}
