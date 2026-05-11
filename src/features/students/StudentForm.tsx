import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, User, Hash, Mail, Smartphone, MapPin, Layers, GraduationCap, Save, Plus } from "lucide-react";
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
      className="space-y-6"
    >
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-1">
          <FieldLabel icon={User}>Full Identity</FieldLabel>
          <input
            type="text"
            placeholder="e.g. Aarav Sharma"
            className={`w-full px-4 py-3 bg-white border rounded-xl text-sm font-bold transition-all outline-none ${
              errors.fullName ? "border-rose-200 bg-rose-50/30" : "border-slate-100 focus:border-brand-300 focus:ring-4 focus:ring-brand-500/5 text-slate-900 shadow-sm"
            }`}
            {...register("fullName")}
          />
          <FieldError message={errors.fullName?.message} />
        </div>
        <div className="space-y-1">
          <FieldLabel icon={Hash}>Registration Index</FieldLabel>
          <input
            type="text"
            placeholder="e.g. BCA001"
            className={`w-full px-4 py-3 bg-white border rounded-xl text-sm font-bold transition-all outline-none ${
              errors.rollNo ? "border-rose-200 bg-rose-50/30" : "border-slate-100 focus:border-brand-300 focus:ring-4 focus:ring-brand-500/5 text-slate-900 shadow-sm"
            }`}
            {...register("rollNo")}
          />
          <FieldError message={errors.rollNo?.message} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-1">
          <FieldLabel icon={Mail}>Institutional Email</FieldLabel>
          <input
            type="email"
            placeholder="e.g. student@college.edu"
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
          <FieldLabel icon={GraduationCap}>Enrollment Batch</FieldLabel>
          <select
            className={`w-full px-4 py-3 bg-white border rounded-xl text-sm font-bold transition-all outline-none appearance-none ${
              errors.batch ? "border-rose-200 bg-rose-50/30" : "border-slate-100 focus:border-brand-300 focus:ring-4 focus:ring-brand-500/5 text-slate-900 shadow-sm"
            }`}
            {...register("batch")}
          >
            <option value="">Select batch</option>
            {BATCHES.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <FieldError message={errors.batch?.message} />
        </div>
      </div>

      <div className="space-y-1">
        <FieldLabel icon={MapPin}>Physical Address</FieldLabel>
        <input
          type="text"
          placeholder="e.g. Kathmandu, Nepal"
          className={`w-full px-4 py-3 bg-white border rounded-xl text-sm font-bold transition-all outline-none ${
            errors.address ? "border-rose-200 bg-rose-50/30" : "border-slate-100 focus:border-brand-300 focus:ring-4 focus:ring-brand-500/5 text-slate-900 shadow-sm"
          }`}
          {...register("address")}
        />
        <FieldError message={errors.address?.message} />
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
            <><Plus size={18} /> Initialize Enrollment</>
          )}
        </button>
      </div>
    </form>
  );
}
