import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Lock,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  AlertCircle,
  Save,
} from "lucide-react";
import {
  profileSchema,
  passwordSchema,
  collegeSchema,
  type ProfileFormValues,
  type PasswordFormValues,
  type CollegeFormValues,
} from "../../features/settings/settingsSchemas";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { setCredentials } from "../../features/auth/authSlice";

import clsx from "clsx";
import { useToast } from "../../Component/ui/Toast";
import Avatar from "../../Component/ui/Avatar";

// ── Reusable field components ────────────────────────────
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

// ── Section wrapper ──────────────────────────────────────
function SettingsSection({
  icon: Icon,
  title,
  subtitle,
  children,
  active,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Section header — clickable to expand */}
      <button
        type="button"
        onClick={onClick}
        className="w-full flex items-center gap-4 p-5
                   hover:bg-white/2 transition-colors text-left"
      >
        <div
          className="w-10 h-10 rounded-xl bg-jade-500/10
                        border border-jade-500/20
                        flex items-center justify-center shrink-0"
        >
          <Icon size={18} className="text-jade-400" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-ink-100">{title}</p>
          <p className="text-xs text-ink-500 mt-0.5">{subtitle}</p>
        </div>
        <div
          className={clsx(
            "w-1.5 h-1.5 rounded-full transition-colors",
            active ? "bg-jade-400" : "bg-white/20",
          )}
        />
      </button>

      {/* Section content */}
      {active && (
        <div className="px-5 pb-6 border-t border-white/[0.07]">
          <div className="pt-5">{children}</div>
        </div>
      )}
    </div>
  );
}

// ── Main component ───────────────────────────────────────
export default function Settings() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const toast = useToast();

  const [activeSection, setActiveSection] = useState<
    "profile" | "password" | "college" | null
  >("profile");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const toggleSection = (section: "profile" | "password" | "college") => {
    setActiveSection((s) => (s === section ? null : section));
  };

  // ── Profile form ───────────────────────────────────────
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName ?? "",
      email: user?.email ?? "",
      phone: "",
    },
  });

  const onProfileSubmit = async (data: ProfileFormValues) => {
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));

    // Update Redux store with new name
    if (user) {
      dispatch(
        setCredentials({
          token: localStorage.getItem("token") ?? "",
          user: { ...user, fullName: data.fullName, email: data.email },
        }),
      );
    }
    toast.success("Profile updated", "Your details have been saved");
  };

  // ── Password form ──────────────────────────────────────
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onPasswordSubmit = async (_data: PasswordFormValues) => {
    await new Promise((r) => setTimeout(r, 800));
    passwordForm.reset();
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
    toast.success("Password changed", "Your password has been updated");
  };

  // ── College form ───────────────────────────────────────
  const collegeForm = useForm<CollegeFormValues>({
    resolver: zodResolver(collegeSchema),
    defaultValues: {
      name: "Global Tech College",
      email: "info@globaltech.edu",
      phone: "+977 9800 123456",
      address: "Kathmandu, Nepal",
      website: "https://globaltech.edu",
    },
  });

  const onCollegeSubmit = async (_data: CollegeFormValues) => {
    await new Promise((r) => setTimeout(r, 800));
    toast.success("College info updated", "Changes saved successfully");
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Page title */}
      <div>
        <h1 className="font-display text-2xl md:text-3xl text-ink-50">
          Settings
        </h1>
        <p className="text-sm text-ink-400 mt-1">
          Manage your account and college configuration
        </p>
      </div>

      {/* ── User card ─────────────────────────────────── */}
      <div className="glass rounded-2xl p-5 flex items-center gap-4">
        <Avatar name={user?.fullName ?? "Admin"} size="lg" color="jade" />
        <div>
          <p className="font-medium text-ink-100">{user?.fullName}</p>
          <p className="text-sm text-ink-500">{user?.email}</p>
          <span
            className="inline-flex mt-1.5 text-[10px] font-mono
                           font-medium uppercase tracking-wider
                           bg-jade-500/10 text-jade-400
                           border border-jade-500/20
                           px-2 py-0.5 rounded-full"
          >
            {user?.role} portal
          </span>
        </div>
      </div>

      {/* ── Profile section ───────────────────────────── */}
      <SettingsSection
        icon={User}
        title="Profile"
        subtitle="Update your name, email and phone number"
        active={activeSection === "profile"}
        onClick={() => toggleSection("profile")}
      >
        <form
          onSubmit={profileForm.handleSubmit(onProfileSubmit)}
          noValidate
          className="flex flex-col gap-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel>Full name</FieldLabel>
              <input
                type="text"
                className={`input-field ${
                  profileForm.formState.errors.fullName ? "input-error" : ""
                }`}
                {...profileForm.register("fullName")}
              />
              <FieldError
                message={profileForm.formState.errors.fullName?.message}
              />
            </div>

            <div>
              <FieldLabel>Phone number</FieldLabel>
              <input
                type="tel"
                placeholder="+977 9800000000"
                className={`input-field ${
                  profileForm.formState.errors.phone ? "input-error" : ""
                }`}
                {...profileForm.register("phone")}
              />
              <FieldError
                message={profileForm.formState.errors.phone?.message}
              />
            </div>
          </div>

          <div>
            <FieldLabel>Email address</FieldLabel>
            <input
              type="email"
              className={`input-field ${
                profileForm.formState.errors.email ? "input-error" : ""
              }`}
              {...profileForm.register("email")}
            />
            <FieldError message={profileForm.formState.errors.email?.message} />
          </div>

          <div className="flex justify-end pt-2 border-t border-white/[0.07]">
            <button
              type="submit"
              disabled={profileForm.formState.isSubmitting}
              className="btn-primary px-6 disabled:opacity-60
                         disabled:cursor-not-allowed disabled:transform-none"
            >
              {profileForm.formState.isSubmitting ? (
                <>
                  <span
                    className="w-4 h-4 border-2 border-white/30
                                   border-t-white rounded-full animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={15} />
                  Save profile
                </>
              )}
            </button>
          </div>
        </form>
      </SettingsSection>

      {/* ── Password section ──────────────────────────── */}
      <SettingsSection
        icon={Lock}
        title="Password"
        subtitle="Change your login password"
        active={activeSection === "password"}
        onClick={() => toggleSection("password")}
      >
        <form
          onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
          noValidate
          className="flex flex-col gap-4"
        >
          {/* Current password */}
          <div>
            <FieldLabel>Current password</FieldLabel>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                className={`input-field pr-10 ${
                  passwordForm.formState.errors.currentPassword
                    ? "input-error"
                    : ""
                }`}
                {...passwordForm.register("currentPassword")}
              />
              <button
                type="button"
                onClick={() => setShowCurrent((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2
                           text-ink-500 hover:text-ink-300 transition-colors"
              >
                {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <FieldError
              message={passwordForm.formState.errors.currentPassword?.message}
            />
          </div>

          {/* New password */}
          <div>
            <FieldLabel>New password</FieldLabel>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                placeholder="Min 8 chars, 1 uppercase, 1 number"
                autoComplete="new-password"
                className={`input-field pr-10 ${
                  passwordForm.formState.errors.newPassword ? "input-error" : ""
                }`}
                {...passwordForm.register("newPassword")}
              />
              <button
                type="button"
                onClick={() => setShowNew((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2
                           text-ink-500 hover:text-ink-300 transition-colors"
              >
                {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <FieldError
              message={passwordForm.formState.errors.newPassword?.message}
            />
          </div>

          {/* Confirm password */}
          <div>
            <FieldLabel>Confirm new password</FieldLabel>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Repeat your new password"
                autoComplete="new-password"
                className={`input-field pr-10 ${
                  passwordForm.formState.errors.confirmPassword
                    ? "input-error"
                    : ""
                }`}
                {...passwordForm.register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2
                           text-ink-500 hover:text-ink-300 transition-colors"
              >
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <FieldError
              message={passwordForm.formState.errors.confirmPassword?.message}
            />
          </div>

          {/* Password rules */}
          <div className="glass-light rounded-xl p-3 flex flex-col gap-1.5">
            {[
              "At least 8 characters",
              "At least one uppercase letter",
              "At least one number",
              "Different from current password",
            ].map((rule) => (
              <div key={rule} className="flex items-center gap-2">
                <CheckCircle2 size={12} className="text-jade-500 shrink-0" />
                <p className="text-xs text-ink-500">{rule}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2 border-t border-white/[0.07]">
            <button
              type="submit"
              disabled={passwordForm.formState.isSubmitting}
              className="btn-primary px-6 disabled:opacity-60
                         disabled:cursor-not-allowed disabled:transform-none"
            >
              {passwordForm.formState.isSubmitting ? (
                <>
                  <span
                    className="w-4 h-4 border-2 border-white/30
                                   border-t-white rounded-full animate-spin"
                  />
                  Updating...
                </>
              ) : (
                <>
                  <Lock size={15} />
                  Update password
                </>
              )}
            </button>
          </div>
        </form>
      </SettingsSection>

      {/* ── College info section ──────────────────────── */}
      <SettingsSection
        icon={Building2}
        title="College Information"
        subtitle="Update your institution details"
        active={activeSection === "college"}
        onClick={() => toggleSection("college")}
      >
        <form
          onSubmit={collegeForm.handleSubmit(onCollegeSubmit)}
          noValidate
          className="flex flex-col gap-4"
        >
          <div>
            <FieldLabel>College name</FieldLabel>
            <input
              type="text"
              className={`input-field ${
                collegeForm.formState.errors.name ? "input-error" : ""
              }`}
              {...collegeForm.register("name")}
            />
            <FieldError message={collegeForm.formState.errors.name?.message} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel>Email address</FieldLabel>
              <input
                type="email"
                className={`input-field ${
                  collegeForm.formState.errors.email ? "input-error" : ""
                }`}
                {...collegeForm.register("email")}
              />
              <FieldError
                message={collegeForm.formState.errors.email?.message}
              />
            </div>

            <div>
              <FieldLabel>Phone number</FieldLabel>
              <input
                type="tel"
                className={`input-field ${
                  collegeForm.formState.errors.phone ? "input-error" : ""
                }`}
                {...collegeForm.register("phone")}
              />
              <FieldError
                message={collegeForm.formState.errors.phone?.message}
              />
            </div>
          </div>

          <div>
            <FieldLabel>Address</FieldLabel>
            <input
              type="text"
              className={`input-field ${
                collegeForm.formState.errors.address ? "input-error" : ""
              }`}
              {...collegeForm.register("address")}
            />
            <FieldError
              message={collegeForm.formState.errors.address?.message}
            />
          </div>

          <div>
            <FieldLabel>Website (optional)</FieldLabel>
            <input
              type="url"
              placeholder="https://yourcollege.edu"
              className={`input-field ${
                collegeForm.formState.errors.website ? "input-error" : ""
              }`}
              {...collegeForm.register("website")}
            />
            <FieldError
              message={collegeForm.formState.errors.website?.message}
            />
          </div>

          <div className="flex justify-end pt-2 border-t border-white/[0.07]">
            <button
              type="submit"
              disabled={collegeForm.formState.isSubmitting}
              className="btn-primary px-6 disabled:opacity-60
                         disabled:cursor-not-allowed disabled:transform-none"
            >
              {collegeForm.formState.isSubmitting ? (
                <>
                  <span
                    className="w-4 h-4 border-2 border-white/30
                                   border-t-white rounded-full animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={15} />
                  Save changes
                </>
              )}
            </button>
          </div>
        </form>
      </SettingsSection>
    </div>
  );
}
