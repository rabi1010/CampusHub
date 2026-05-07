import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, AlertCircle } from "lucide-react";
import { useAppSelector } from "../../app/hooks";

import PageHeader from "../../components/ui/PageHeader";
import { useToast } from "../../Component/ui/Toast";
import Avatar from "../../Component/ui/Avatar";
import Badge from "../../Component/ui/Badge";

// ── Mock student profile data ────────────────────────────
const STUDENT_PROFILE = {
  rollNo: "BCA001",
  department: "Computer Science",
  batch: "2023-2026",
  semester: 3,
  admissionDate: "August 1, 2023",
  address: "Kathmandu, Nepal",
  phone: "+977 9800000001",
  gpa: "3.75",
  attendance: "85%",
};

// ── Profile edit schema ──────────────────────────────────
const profileSchema = z.object({
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^[0-9+\-\s()]{7,15}$/, "Enter a valid phone number"),

  address: z
    .string()
    .min(1, "Address is required")
    .max(200, "Address is too long"),
});

type ProfileValues = z.infer<typeof profileSchema>;

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

// ── Info row ─────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex items-center justify-between py-3
                    border-b border-white/5 last:border-0"
    >
      <span
        className="text-xs font-mono text-ink-500 uppercase
                       tracking-wider"
      >
        {label}
      </span>
      <span className="text-sm text-ink-200 font-medium">{value}</span>
    </div>
  );
}

export default function Profile() {
  const user = useAppSelector((s) => s.auth.user);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      phone: STUDENT_PROFILE.phone,
      address: STUDENT_PROFILE.address,
    },
  });

  const onSubmit = async (_data: ProfileValues) => {
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Profile updated", "Your details have been saved");
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <PageHeader
        title="My Profile"
        subtitle="View and update your personal information"
      />

      {/* Profile header card */}
      <div
        className="glass rounded-2xl p-6 flex flex-col
                      sm:flex-row items-start sm:items-center gap-5"
      >
        <Avatar name={user?.fullName ?? "Student"} size="lg" color="gold" />
        <div className="flex-1">
          <h2 className="font-display text-xl text-ink-50">{user?.fullName}</h2>
          <p className="text-sm text-ink-400 mt-0.5">{user?.email}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge label={`Roll: ${STUDENT_PROFILE.rollNo}`} variant="info" />
            <Badge label={STUDENT_PROFILE.department} variant="default" />
            <Badge label={`Batch ${STUDENT_PROFILE.batch}`} variant="default" />
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="font-mono text-xl font-medium text-jade-400">
              {STUDENT_PROFILE.gpa}
            </p>
            <p className="text-xs text-ink-500 mt-0.5">GPA</p>
          </div>
          <div className="text-center">
            <p className="font-mono text-xl font-medium text-gold-400">
              {STUDENT_PROFILE.attendance}
            </p>
            <p className="text-xs text-ink-500 mt-0.5">Attendance</p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {/* Academic info — read only */}
        <div className="glass rounded-2xl p-5">
          <p
            className="text-xs font-mono text-ink-500 uppercase
                        tracking-wider mb-1"
          >
            Academic information
          </p>
          <div className="mt-3">
            <InfoRow label="Roll Number" value={STUDENT_PROFILE.rollNo} />
            <InfoRow label="Department" value={STUDENT_PROFILE.department} />
            <InfoRow label="Batch" value={STUDENT_PROFILE.batch} />
            <InfoRow
              label="Semester"
              value={`Semester ${STUDENT_PROFILE.semester}`}
            />
            <InfoRow
              label="Admission date"
              value={STUDENT_PROFILE.admissionDate}
            />
          </div>
        </div>

        {/* Editable personal info */}
        <div className="glass rounded-2xl p-5">
          <p
            className="text-xs font-mono text-ink-500 uppercase
                        tracking-wider mb-4"
          >
            Personal information
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-4"
          >
            {/* Read-only name */}
            <div>
              <FieldLabel>Full name</FieldLabel>
              <input
                type="text"
                value={user?.fullName ?? ""}
                disabled
                className="input-field opacity-50 cursor-not-allowed"
              />
              <p className="text-xs text-ink-600 mt-1">
                Contact admin to change your name
              </p>
            </div>

            {/* Read-only email */}
            <div>
              <FieldLabel>Email address</FieldLabel>
              <input
                type="email"
                value={user?.email ?? ""}
                disabled
                className="input-field opacity-50 cursor-not-allowed"
              />
            </div>

            {/* Editable phone */}
            <div>
              <FieldLabel>Phone number</FieldLabel>
              <input
                type="tel"
                className={`input-field ${errors.phone ? "input-error" : ""}`}
                {...register("phone")}
              />
              <FieldError message={errors.phone?.message} />
            </div>

            {/* Editable address */}
            <div>
              <FieldLabel>Address</FieldLabel>
              <input
                type="text"
                className={`input-field ${errors.address ? "input-error" : ""}`}
                {...register("address")}
              />
              <FieldError message={errors.address?.message} />
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary px-6 disabled:opacity-60
                           disabled:cursor-not-allowed
                           disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="w-4 h-4 border-2 border-white/30
                                     border-t-white rounded-full
                                     animate-spin"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={15} />
                    Update profile
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
