import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { noticeSchema, type NoticeFormValues } from "./noticeSchemas";
import type { Notice } from "../../services/noticeService";

const AUDIENCE_OPTIONS = [
  { value: "ALL", label: "Everyone", desc: "All students and teachers" },
  { value: "STUDENT", label: "Students only", desc: "Only student accounts" },
  { value: "TEACHER", label: "Teachers only", desc: "Only teacher accounts" },
];

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

interface NoticeFormProps {
  notice?: Notice;
  onSubmit: (data: NoticeFormValues) => void;
  isLoading?: boolean;
}

export default function NoticeForm({
  notice,
  onSubmit,
  isLoading = false,
}: NoticeFormProps) {
  const isEdit = !!notice;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<NoticeFormValues>({
    resolver: zodResolver(noticeSchema) as Resolver<NoticeFormValues>,
    defaultValues: isEdit
      ? {
          title: notice.title,
          content: notice.content,
          forRole: notice.forRole,
          urgent: notice.urgent,
        }
      : {
          title: "",
          content: "",
          forRole: "ALL",
          urgent: false,
        },
  });

  const isUrgent = watch("urgent");
  const selectedRole = watch("forRole");

  useEffect(() => {
    if (notice) {
      reset({
        title: notice.title,
        content: notice.content,
        forRole: notice.forRole,
        urgent: notice.urgent,
      });
    } else {
      reset();
    }
  }, [notice, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-5"
    >
      {/* Title */}
      <div>
        <FieldLabel>Notice title</FieldLabel>
        <input
          type="text"
          placeholder="e.g. Annual Sports Week"
          className={`input-field ${errors.title ? "input-error" : ""}`}
          {...register("title")}
        />
        <FieldError message={errors.title?.message} />
      </div>

      {/* Audience selector */}
      <div>
        <FieldLabel>Audience</FieldLabel>
        <div className="grid grid-cols-3 gap-2">
          {AUDIENCE_OPTIONS.map(({ value, label, desc }) => (
            <button
              key={value}
              type="button"
              onClick={() =>
                setValue("forRole", value as NoticeFormValues["forRole"])
              }
              className={`flex flex-col items-start gap-1 p-3
                          rounded-xl border text-left
                          transition-all duration-200 ${
                            selectedRole === value
                              ? "bg-jade-500/15 border-jade-500/40"
                              : "border-white/[0.07] hover:border-white/20"
                          }`}
            >
              <p
                className={`text-xs font-medium ${
                  selectedRole === value ? "text-jade-300" : "text-ink-300"
                }`}
              >
                {label}
              </p>
              <p className="text-[10px] text-ink-500 leading-snug">{desc}</p>
            </button>
          ))}
        </div>
        <FieldError message={errors.forRole?.message} />
      </div>

      {/* Content */}
      <div>
        <FieldLabel>Content</FieldLabel>
        <textarea
          rows={5}
          placeholder="Write the full notice content here..."
          className={`input-field resize-none ${
            errors.content ? "input-error" : ""
          }`}
          {...register("content")}
        />
        <FieldError message={errors.content?.message} />
      </div>

      {/* Urgent toggle */}
      <div
        className={`flex items-center justify-between p-4 rounded-xl
                    border transition-all duration-200 cursor-pointer ${
                      isUrgent
                        ? "bg-red-500/10 border-red-500/30"
                        : "border-white/[0.07] hover:border-white/15"
                    }`}
        onClick={() => setValue("urgent", !isUrgent)}
      >
        <div>
          <p
            className={`text-sm font-medium ${
              isUrgent ? "text-red-300" : "text-ink-300"
            }`}
          >
            Mark as urgent
          </p>
          <p className="text-xs text-ink-500 mt-0.5">
            Urgent notices appear highlighted at the top
          </p>
        </div>

        {/* Toggle switch */}
        <div
          className={`w-10 h-6 rounded-full transition-all duration-200
                      flex items-center px-0.5 ${
                        isUrgent ? "bg-red-500" : "bg-white/10"
                      }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white shadow-sm
                        transition-transform duration-200 ${
                          isUrgent ? "translate-x-4" : "translate-x-0"
                        }`}
          />
        </div>

        {/* Hidden checkbox for RHF */}
        <input type="checkbox" className="hidden" {...register("urgent")} />
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
              {isEdit ? "Saving..." : "Posting..."}
            </>
          ) : isEdit ? (
            "Save changes"
          ) : (
            "Post notice"
          )}
        </button>
      </div>
    </form>
  );
}
