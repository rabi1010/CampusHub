import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { courseSchema, type CourseFormValues } from "./courseSchemas";
import type { Course } from "../../services/courseService";
import { useDepartments } from "../academics/useAcademics";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="block text-xs font-mono text-ink-400
                      mb-1.5 uppercase tracking-wider"
    >
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

interface CourseFormProps {
  course?: Course;
  onSubmit: (data: CourseFormValues) => void;
  isLoading?: boolean;
}

export default function CourseForm({
  course,
  onSubmit,
  isLoading = false,
}: CourseFormProps) {
  const isEdit = !!course;
  const { data: departments = [], isLoading: departmentsLoading } =
    useDepartments();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: isEdit
      ? {
          name: course.name,
          code: course.code,
          departmentId: course.department?.id ?? "",
          credits: course.credits,
          semester: course.semester,
          description: course.description,
        }
      : {
          name: "",
          code: "",
          departmentId: "",
          credits: 3,
          semester: 1,
          description: "",
        },
  });

  useEffect(() => {
    if (course) {
      reset({
        name: course.name,
        code: course.code,
        departmentId: course.department?.id ?? "",
        credits: course.credits,
        semester: course.semester,
        description: course.description,
      });
    } else {
      reset();
    }
  }, [course, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-5"
    >
      {/* Row 1 — Name + Code */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel>Course name</FieldLabel>
          <input
            type="text"
            placeholder="Data Structures"
            className={`input-field ${errors.name ? "input-error" : ""}`}
            {...register("name")}
          />
          <FieldError message={errors.name?.message} />
        </div>

        <div>
          <FieldLabel>Course code</FieldLabel>
          <input
            type="text"
            placeholder="CS101"
            className={`input-field ${errors.code ? "input-error" : ""}`}
            {...register("code")}
          />
          <p className="text-xs text-ink-600 mt-1">
            Format: 2-4 letters + 3-4 numbers (e.g. CS101)
          </p>
          <FieldError message={errors.code?.message} />
        </div>
      </div>

      {/* Row 2 — Department */}
      <div>
        <FieldLabel>Department</FieldLabel>
        <select
          disabled={departmentsLoading}
          className={`input-field ${errors.departmentId ? "input-error" : ""}`}
          {...register("departmentId")}
        >
          <option value="">
            {departmentsLoading ? "Loading departments..." : "Select department"}
          </option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
        <FieldError message={errors.departmentId?.message} />
      </div>

      {/* Row 3 — Credits + Semester */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel>Credits</FieldLabel>
          <input
            type="number"
            min={1}
            max={6}
            className={`input-field ${errors.credits ? "input-error" : ""}`}
            {...register("credits", { valueAsNumber: true })}
          />
          <p className="text-xs text-ink-600 mt-1">Between 1 and 6</p>
          <FieldError message={errors.credits?.message} />
        </div>

        <div>
          <FieldLabel>Semester</FieldLabel>
          <select
            className={`input-field ${errors.semester ? "input-error" : ""}`}
            {...register("semester", { valueAsNumber: true })}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </select>
          <FieldError message={errors.semester?.message} />
        </div>
      </div>

      {/* Description */}
      <div>
        <FieldLabel>Description</FieldLabel>
        <textarea
          rows={3}
          placeholder="Brief description of the course content..."
          className={`input-field resize-none ${
            errors.description ? "input-error" : ""
          }`}
          {...register("description")}
        />
        <FieldError message={errors.description?.message} />
      </div>

      {/* Submit */}
      <div
        className="flex items-center justify-end gap-3 pt-2
                      border-t border-white/[0.07]"
      >
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary px-8 disabled:opacity-60
                     disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <>
              <span
                className="w-4 h-4 border-2 border-white/30
                               border-t-white rounded-full animate-spin"
              />
              {isEdit ? "Saving..." : "Creating..."}
            </>
          ) : isEdit ? (
            "Save changes"
          ) : (
            "Create course"
          )}
        </button>
      </div>
    </form>
  );
}
