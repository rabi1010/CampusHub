import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, User, ShieldCheck, Mail, Smartphone, Layers, GraduationCap, Save, Plus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  teacherSchema,
  teacherEditSchema,
  type TeacherFormValues,
} from "./teacherSchemas";
import type { Teacher } from "../../services/teacherService";
import { useDepartments } from "../academics/useAcademics";

const QUALIFICATIONS = [
  "B.E / B.Tech",
  "M.Sc Computer Science",
  "M.Tech IT",
  "M.E Civil",
  "M.E Mechanical",
  "Ph.D Computer Science",
  "Other",
];

function FieldLabel({
  children,
  icon: Icon,
}: {
  children: React.ReactNode;
  icon: LucideIcon;
}) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 mb-2">
      <Icon size={12} className="text-zinc-400" />
      {children}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-[11px] text-rose-500 mt-2 flex items-center gap-1.5 font-medium">
      <AlertCircle size={12} />
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
  const { data: departments = [], isLoading: departmentsLoading } =
    useDepartments();

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
          departmentId: teacher.department?.id ?? "",
          qualification: teacher.qualification,
          phone: teacher.phone,
          password: "",
        }
      : {
          fullName: "",
          email: "",
          employeeId: "",
          departmentId: "",
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
        departmentId: teacher.department?.id ?? "",
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
      className="space-y-6"
    >
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-1">
          <FieldLabel icon={User}>Faculty Name</FieldLabel>
          <input
            type="text"
            placeholder="e.g. John Doe"
            className={`input-field ${
              errors.fullName ? "input-error" : ""
            }`}
            {...register("fullName")}
          />
          <FieldError message={errors.fullName?.message} />
        </div>
        <div className="space-y-1">
          <FieldLabel icon={ShieldCheck}>Employee Index</FieldLabel>
          <input
            type="text"
            placeholder="e.g. EMP001"
            className={`input-field ${
              errors.employeeId ? "input-error" : ""
            }`}
            {...register("employeeId")}
          />
          <FieldError message={errors.employeeId?.message} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-1">
          <FieldLabel icon={Mail}>Institutional Email</FieldLabel>
          <input
            type="email"
            placeholder="e.g. teacher@college.edu"
            className={`input-field ${
              errors.email ? "input-error" : ""
            }`}
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>
        <div className="space-y-1">
          <FieldLabel icon={Smartphone}>Contact Number</FieldLabel>
          <input
            type="tel"
            placeholder="e.g. +977 9800000000"
            className={`input-field ${
              errors.phone ? "input-error" : ""
            }`}
            {...register("phone")}
          />
          <FieldError message={errors.phone?.message} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-1">
          <FieldLabel icon={Layers}>Academic Faculty</FieldLabel>
          <select
            disabled={departmentsLoading}
            className={`input-field appearance-none ${
              errors.departmentId ? "input-error" : ""
            }`}
            {...register("departmentId")}
          >
            <option value="">
              {departmentsLoading
                ? "Loading departments..."
                : "Select department"}
            </option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
          <FieldError message={errors.departmentId?.message} />
        </div>
        <div className="space-y-1">
          <FieldLabel icon={GraduationCap}>Highest Qualification</FieldLabel>
          <select
            className={`input-field appearance-none ${
              errors.qualification ? "input-error" : ""
            }`}
            {...register("qualification")}
          >
            <option value="">Select qualification</option>
            {QUALIFICATIONS.map((q) => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
          <FieldError message={errors.qualification?.message} />
        </div>
      </div>

      <div className="space-y-1">
        <FieldLabel icon={Save}>
          {isEdit ? "Authentication Refresh" : "Access Credentials"}
        </FieldLabel>
        <input
          type="password"
          placeholder={isEdit ? "Leave blank to preserve existing" : "Minimum 6 characters"}
          autoComplete="new-password"
          className={`input-field ${
            errors.password ? "input-error" : ""
          }`}
          {...register("password")}
        />
        <FieldError message={errors.password?.message} />
      </div>

      <div className="pt-6 border-t border-zinc-50 flex items-center justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary py-3.5 px-10 shadow-xl shadow-brand-500/15 disabled:opacity-50"
        >
          {isLoading ? (
             <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : isEdit ? (
            <><Save size={18} /> Synchronize Record</>
          ) : (
            <><Plus size={18} /> Register Faculty</>
          )}
        </button>
      </div>
    </form>
  );
}
