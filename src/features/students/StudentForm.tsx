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
import { useDepartments, useBatches } from "../academics/useAcademics";

function FieldLabel({ children, icon: Icon }: { children: React.ReactNode; icon: React.ElementType }) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 mb-2">
      <Icon size={16} className="text-zinc-400" />
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

  // Fetch real departments and batches from backend
  const { data: departments = [], isLoading: deptLoading } = useDepartments();
  const { data: batches = [],     isLoading: batchLoading } = useBatches();

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
          fullName:     student.fullName,
          email:        student.email,
          rollNo:       student.rollNo,
          departmentId: student.department?.id ?? "",
          batchId:      student.batch?.id ?? "",
          phone:        student.phone,
          address:      student.address,
          password:     "",
        }
      : {
          fullName:     "",
          email:        "",
          rollNo:       "",
          departmentId: "",
          batchId:      "",
          phone:        "",
          address:      "",
          password:     "",
        },
  });

  useEffect(() => {
    if (student) {
      reset({
        fullName:     student.fullName,
        email:        student.email,
        rollNo:       student.rollNo,
        departmentId: student.department?.id ?? "",
        batchId:      student.batch?.id ?? "",
        phone:        student.phone,
        address:      student.address,
        password:     "",
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
            className={`input-field ${errors.fullName ? "input-error" : ""}`}
            {...register("fullName")}
          />
          <FieldError message={errors.fullName?.message} />
        </div>
        <div className="space-y-1">
          <FieldLabel icon={Hash}>Registration Index</FieldLabel>
          <input
            type="text"
            placeholder="e.g. BCA001"
            className={`input-field ${errors.rollNo ? "input-error" : ""}`}
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
            className={`input-field ${errors.email ? "input-error" : ""}`}
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>
        <div className="space-y-1">
          <FieldLabel icon={Smartphone}>Contact Number</FieldLabel>
          <input
            type="tel"
            placeholder="e.g. +977 9800000000"
            className={`input-field ${errors.phone ? "input-error" : ""}`}
            {...register("phone")}
          />
          <FieldError message={errors.phone?.message} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-1">
          <FieldLabel icon={Layers}>Academic Faculty</FieldLabel>
          <select
            disabled={deptLoading}
            className={`input-field appearance-none ${errors.departmentId ? "input-error" : ""}`}
            {...register("departmentId")}
          >
            <option value="">
              {deptLoading ? "Loading departments..." : "Select department"}
            </option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <FieldError message={errors.departmentId?.message} />
        </div>
        <div className="space-y-1">
          <FieldLabel icon={GraduationCap}>Enrollment Batch</FieldLabel>
          <select
            disabled={batchLoading}
            className={`input-field appearance-none ${errors.batchId ? "input-error" : ""}`}
            {...register("batchId")}
          >
            <option value="">
              {batchLoading ? "Loading batches..." : "Select batch"}
            </option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} — {b.department.name}
              </option>
            ))}
          </select>
          <FieldError message={errors.batchId?.message} />
        </div>
      </div>

      <div className="space-y-1">
        <FieldLabel icon={MapPin}>Physical Address</FieldLabel>
        <input
          type="text"
          placeholder="e.g. Kathmandu, Nepal"
          className={`input-field ${errors.address ? "input-error" : ""}`}
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
          className={`input-field ${errors.password ? "input-error" : ""}`}
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
            <><Plus size={18} /> Initialize Enrollment</>
          )}
        </button>
      </div>
    </form>
  );
}
