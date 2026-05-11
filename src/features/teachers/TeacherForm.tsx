import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, User, ShieldCheck, Mail, Smartphone, Layers, GraduationCap, Save, Plus } from "lucide-react";
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

function FieldLabel({ children, icon: Icon }: { children: React.ReactNode; icon: any }) {
  return (
    <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-[0.2em]">
      <Icon size={12} className="text-slate-300" />
      {children}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-[11px] text-rose-500 mt-2 flex items-center gap-1.5 font-bold">
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
      className="space-y-6"
    >
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-1">
          <FieldLabel icon={User}>Faculty Name</FieldLabel>
          <input
            type="text"
            placeholder="e.g. John Doe"
            className={`w-full px-4 py-3 bg-white border rounded-xl text-sm font-bold transition-all outline-none ${
              errors.fullName ? "border-rose-200 bg-rose-50/30" : "border-slate-100 focus:border-brand-300 focus:ring-4 focus:ring-brand-500/5 text-slate-900 shadow-sm"
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
            className={`w-full px-4 py-3 bg-white border rounded-xl text-sm font-bold transition-all outline-none ${
              errors.employeeId ? "border-rose-200 bg-rose-50/30" : "border-slate-100 focus:border-brand-300 focus:ring-4 focus:ring-brand-500/5 text-slate-900 shadow-sm"
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
            className={`w-full px-4 py-3 bg-white border rounded-xl text-sm font-bold transition-all outline-none ${
              errors.email ? "border-rose-200 bg-rose-50/30" : "border-slate-100 focus:border-brand-300 focus:ring-4 focus:ring-brand-500/5 text-slate-900 shadow-sm"
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
            className={`w-full px-4 py-3 bg-white border rounded-xl text-sm font-bold transition-all outline-none ${
              errors.phone ? "border-rose-200 bg-rose-50/30" : "border-slate-100 focus:border-brand-300 focus:ring-4 focus:ring-brand-500/5 text-slate-900 shadow-sm"
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
            className={`w-full px-4 py-3 bg-white border rounded-xl text-sm font-bold transition-all outline-none appearance-none ${
              errors.department ? "border-rose-200 bg-rose-50/30" : "border-slate-100 focus:border-brand-300 focus:ring-4 focus:ring-brand-500/5 text-slate-900 shadow-sm"
            }`}
            {...register("department")}
          >
            <option value="">Select department</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <FieldError message={errors.department?.message} />
        </div>
        <div className="space-y-1">
          <FieldLabel icon={GraduationCap}>Highest Qualification</FieldLabel>
          <select
            className={`w-full px-4 py-3 bg-white border rounded-xl text-sm font-bold transition-all outline-none appearance-none ${
              errors.qualification ? "border-rose-200 bg-rose-50/30" : "border-slate-100 focus:border-brand-300 focus:ring-4 focus:ring-brand-500/5 text-slate-900 shadow-sm"
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
          className={`w-full px-4 py-3 bg-white border rounded-xl text-sm font-bold transition-all outline-none ${
            errors.password ? "border-rose-200 bg-rose-50/30" : "border-slate-100 focus:border-brand-300 focus:ring-4 focus:ring-brand-500/5 text-slate-900 shadow-sm"
          }`}
          {...register("password")}
        />
        <FieldError message={errors.password?.message} />
      </div>

      <div className="pt-6 border-t border-slate-50 flex items-center justify-end">
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
