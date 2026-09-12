import { useEffect, useState } from "react";
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
  ChevronRight,
  ShieldCheck,
  Smartphone,
  Mail,
  Globe,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";
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
import { authService } from "../../services/authService";
import { useNavigate } from "react-router-dom";

function FieldLabel({
  children,
  icon: Icon,
}: {
  children: React.ReactNode;
  icon?: React.ElementType;
}) {
  return (
    <label className="flex items-center gap-2 text-[10px] font-medium text-zinc-400 mb-2 uppercase tracking-[0.2em]">
      {Icon && <Icon size={12} className="text-zinc-300" />}
      {children}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-xs text-rose-500 mt-2 flex items-center gap-1.5 font-medium">
      <AlertCircle size={12} />
      {message}
    </p>
  );
}

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
    <div
      className={clsx(
        "card-base transition-all duration-500 bg-white",
        active
          ? "border-brand-200 shadow-2xl shadow-brand-500/5 ring-1 ring-brand-100"
          : "border-zinc-100 hover:border-zinc-200 shadow-sm",
      )}
    >
      <button
        type="button"
        onClick={onClick}
        className={clsx(
          "w-full flex items-center gap-4 sm:gap-6 p-4 sm:p-6 transition-all text-left group",
          active ? "bg-zinc-50/30" : "bg-white hover:bg-zinc-50/50",
        )}
      >
        <div
          className={clsx(
            "w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all shadow-sm border",
            active
              ? "bg-brand-600 text-white border-brand-500 shadow-brand-200"
              : "bg-white text-zinc-400 border-zinc-100 group-hover:border-zinc-200 group-hover:text-zinc-600",
          )}
        >
          <Icon size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={clsx(
              "font-medium text-lg leading-tight tracking-tight",
              active ? "text-zinc-900" : "text-zinc-700",
            )}
          >
            {title}
          </p>
          <p className="text-sm text-zinc-400 font-medium mt-1 truncate">
            {subtitle}
          </p>
        </div>
        <div
          className={clsx(
            "w-8 h-8 rounded-full flex items-center justify-center transition-all",
            active
              ? "bg-brand-50 text-brand-600 rotate-90"
              : "bg-zinc-50 text-zinc-300 group-hover:text-zinc-500",
          )}
        >
          <ChevronRight size={18} />
        </div>
      </button>

      {active && (
        <div className="border-t border-zinc-100 bg-white">
          <div className="p-5 sm:p-8">{children}</div>
        </div>
      )}
    </div>
  );
}

export default function Settings() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const toast = useToast();

  const [activeSection, setActiveSection] = useState<
    "profile" | "password" | "college" | null
  >("profile");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string>();
  const [imageError, setImageError] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    authService.getProfileImage().then((url) => {
      setProfileImageUrl(url);
    }).catch(() => undefined);
  }, []);

  const onImageSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setImageError("Use a JPEG, PNG, or WebP image.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setImageError("Image must be under 2MB.");
      return;
    }
    setImageUploading(true);
    try {
      await authService.uploadProfileImage(file);
       const url = await authService.getProfileImage();
       setProfileImageUrl(url);
      window.dispatchEvent(new Event("profile-image-updated"));
      setImageError("");
      toast.success("Profile image updated", "Your admin avatar was saved.");
    } catch (error) {
      const status = (error as { response?: { status?: number } }).response?.status;
      setImageError(
        status === 403
          ? "Your account is not permitted to upload images."
          : status === 401
            ? "Your session expired. Sign in again, then return to Settings."
            : "Profile image upload failed. Please try again.",
      );
    } finally {
      setImageUploading(false);
      event.target.value = "";
    }
  };

  const toggleSection = (section: "profile" | "password" | "college") => {
    setActiveSection((s) => (s === section ? null : section));
  };

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName ?? "",
      email: user?.email ?? "",
      phone: "",
    },
  });

  const onProfileSubmit = async (data: ProfileFormValues) => {
    try {
      await authService.updateMe(data);
      if (user) dispatch(setCredentials({ token: localStorage.getItem("token") ?? "", user: { ...user, fullName: data.fullName, email: data.email } }));
      toast.success("Identity synchronized", "Your account credentials have been updated successfully.");
    } catch { toast.error("Profile update failed", "Could not save your account details."); }
  };

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    try {
      await authService.changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      passwordForm.reset();
      toast.success("Security vault updated", "Your password has been changed.");
    } catch { toast.error("Password update failed", "Check your current password and try again."); }
  };

  const collegeForm = useForm<CollegeFormValues>({
    resolver: zodResolver(collegeSchema),
    defaultValues: {
      name: "CampusHub Academy",
      email: "administration@campushub.edu",
      phone: "+1 (555) 000-1234",
      address: "Academic Square, Silicon Valley, CA",
      website: "https://campushub.edu",
    },
  });

  const onCollegeSubmit = async () => {
    await new Promise((r) => setTimeout(r, 800));
    toast.success(
      "Institution config saved",
      "Campus configuration has been synchronized globally.",
    );
  };

  return (
    <div className="w-full max-w-6xl space-y-8 pb-10 sm:space-y-10 sm:pb-14">
      {/* Dynamic Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-zinc-900 leading-tight tracking-tight">
          System <span className="text-brand-600">Preferences</span>
        </h1>
        <p className="text-zinc-500 font-medium text-sm sm:text-lg leading-6">
          Configure your personal identity, security layers, and institutional
          defaults.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-10 items-start">
        {/* Profile Insight Card */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="card-base p-5 sm:p-8 bg-white border-zinc-100 lg:sticky lg:top-24 shadow-sm"
          >
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6 shadow-xl shadow-brand-500/10 border-4 border-white ring-1 ring-zinc-100 rounded-full w-fit">
                <Avatar name={user?.fullName ?? "Admin"} size="lg" imageUrl={profileImageUrl} />
                <label className="absolute -bottom-2 -left-2 cursor-pointer rounded-lg border border-zinc-200 bg-white px-2 py-1 text-[10px] font-medium text-zinc-600 shadow-sm hover:text-brand-600">
                  {imageUploading ? "Uploading" : "Change"}
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={onImageSelected} disabled={imageUploading} />
                </label>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 border-4 border-white flex items-center justify-center text-white shadow-sm">
                  <CheckCircle2 size={16} />
                </div>
              </div>
              <h2 className="text-2xl font-display font-medium text-zinc-900 leading-tight tracking-tight">
                {user?.fullName}
              </h2>
              <p className="text-sm text-zinc-500 font-medium mt-1">
                {user?.email}
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <div className="px-3 py-1 bg-brand-50 text-brand-600 rounded-lg text-[10px] font-medium uppercase tracking-widest border border-brand-100 flex items-center gap-1.5">
                  <ShieldCheck size={12} /> {user?.role} Access
                </div>
              </div>
              {imageError && (
                <div className="mt-3 w-full rounded-xl border border-rose-100 bg-rose-50 px-3 py-3 text-left">
                  <p className="text-xs font-medium text-rose-700">{imageError}</p>
                  {imageError.includes("session expired") && (
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="mt-2 text-xs font-semibold text-rose-700 underline underline-offset-2 hover:text-rose-900"
                    >
                      Sign in again
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="mt-10 pt-10 border-t border-zinc-50 space-y-4">
              <div className="flex items-center justify-between py-1">
                <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">
                  System UID
                </span>
                <span className="font-mono text-[10px] font-medium text-zinc-600 bg-zinc-50 px-2 py-0.5 rounded border border-zinc-100 tracking-tighter">
                  USR-842-990-CLG
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">
                  Status
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-600 uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
                  Synchronized
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Configuration Sections */}
          <div className="lg:col-span-2 min-w-0 space-y-5 sm:space-y-6">
          <SettingsSection
            icon={User}
            title="Personal Credentials"
            subtitle="Manage your public identity and contact touchpoints."
            active={activeSection === "profile"}
            onClick={() => toggleSection("profile")}
          >
            <form
              onSubmit={profileForm.handleSubmit(onProfileSubmit)}
              className="space-y-6 sm:space-y-8"
            >
              <div className="grid sm:grid-cols-2 gap-5 sm:gap-8">
                <div className="space-y-2">
                  <FieldLabel icon={User}>Full Identity</FieldLabel>
                  <input
                    type="text"
                    className={clsx(
                      "input-field",
                      profileForm.formState. errors.fullName ? "input-error" : "",
                    )}
                    {...profileForm.register("fullName")}
                  />
                  <FieldError
                    message={profileForm.formState.errors.fullName?.message}
                  />
                </div>
                <div className="space-y-2">
                  <FieldLabel icon={Smartphone}>Mobile Contact</FieldLabel>
                  <input
                    type="tel"
                    className={clsx(
                      "input-field",
                      profileForm.formState. errors.phone ? "input-error" : "",
                    )}
                    {...profileForm.register("phone")}
                  />
                  <FieldError
                    message={profileForm.formState.errors.phone?.message}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <FieldLabel icon={Mail}>Institutional Email</FieldLabel>
                <input
                  type="email"
                  className={clsx(
                    "input-field",
                    profileForm.formState. errors.email ? "input-error" : "",
                  )}
                  {...profileForm.register("email")}
                />
                <FieldError
                  message={profileForm.formState.errors.email?.message}
                />
              </div>

              <div className="pt-5 sm:pt-6 border-t border-zinc-50 flex justify-stretch sm:justify-end">
                <button
                  type="submit"
                  disabled={profileForm.formState.isSubmitting}
                  className="btn-primary w-full sm:w-auto py-3.5 px-5 sm:px-10 shadow-xl shadow-brand-500/15 disabled:opacity-50"
                >
                  {profileForm.formState.isSubmitting ? (
                    "Processing..."
                  ) : (
                    <>
                      <Save size={18} /> Synchronize Profile
                    </>
                  )}
                </button>
              </div>
            </form>
          </SettingsSection>

          <SettingsSection
            icon={Lock}
            title="Authentication Layers"
            subtitle="Rotate your login credentials and enhance security."
            active={activeSection === "password"}
            onClick={() => toggleSection("password")}
          >
            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className="space-y-6 sm:space-y-8"
            >
              <div className="space-y-2">
                <FieldLabel icon={Lock}>
                  Current Verification Password
                </FieldLabel>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    className={clsx(
                      "input-field pr-12",
                      passwordForm.formState. errors.currentPassword ? "input-error" : "",
                    )}
                    {...passwordForm.register("currentPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-600 transition-colors"
                  >
                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <FieldError
                  message={
                    passwordForm.formState.errors.currentPassword?.message
                  }
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-5 sm:gap-8">
                <div className="space-y-2">
                  <FieldLabel icon={Lock}>New Secure Password</FieldLabel>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      className={clsx(
                        "input-field pr-12",
                        passwordForm.formState. errors.newPassword ? "input-error" : "",
                      )}
                      {...passwordForm.register("newPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-600 transition-colors"
                    >
                      {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <FieldError
                    message={passwordForm.formState.errors.newPassword?.message}
                  />
                </div>
                <div className="space-y-2">
                  <FieldLabel icon={ShieldCheck}>Confirm Rotation</FieldLabel>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      className={clsx(
                        "input-field pr-12",
                        passwordForm.formState. errors.confirmPassword ? "input-error" : "",
                      )}
                      {...passwordForm.register("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-600 transition-colors"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <FieldError
                    message={
                      passwordForm.formState.errors.confirmPassword?.message
                    }
                  />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-3 shadow-inner">
                <div className="flex items-center gap-3 text-xs font-medium text-zinc-500 tracking-tight">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                    <CheckCircle2 size={12} />
                  </div>
                  Must contain a minimum of 8 high-entropy characters.
                </div>
                <div className="flex items-center gap-3 text-xs font-medium text-zinc-500 tracking-tight">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                    <CheckCircle2 size={12} />
                  </div>
                  Encryption layer will be updated upon synchronization.
                </div>
              </div>

              <div className="pt-5 sm:pt-6 border-t border-zinc-50 flex justify-stretch sm:justify-end">
                <button
                  type="submit"
                  disabled={passwordForm.formState.isSubmitting}
                  className="btn-primary w-full sm:w-auto py-3.5 px-5 sm:px-10 shadow-xl shadow-brand-500/15"
                >
                  <Lock size={18} /> Update Security Vault
                </button>
              </div>
            </form>
          </SettingsSection>

          <SettingsSection
            icon={Building2}
            title="Institutional Blueprint"
            subtitle="Configure global campus identity and operational defaults."
            active={activeSection === "college"}
            onClick={() => toggleSection("college")}
          >
            <form
              onSubmit={collegeForm.handleSubmit(onCollegeSubmit)}
              className="space-y-6 sm:space-y-8"
            >
              <div className="space-y-2">
                <FieldLabel icon={Building2}>
                  Institution Designation
                </FieldLabel>
                <input
                  type="text"
                  className="input-field"
                  {...collegeForm.register("name")}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-5 sm:gap-8">
                <div className="space-y-2">
                  <FieldLabel icon={Mail}>Global Support Email</FieldLabel>
                  <input
                    type="email"
                    className="input-field"
                    {...collegeForm.register("email")}
                  />
                </div>
                <div className="space-y-2">
                  <FieldLabel icon={Smartphone}>
                    Primary Administration Line
                  </FieldLabel>
                  <input
                    type="tel"
                    className="input-field"
                    {...collegeForm.register("phone")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <FieldLabel icon={MapPin}>Geographic HQ Address</FieldLabel>
                <input
                  type="text"
                  className="input-field"
                  {...collegeForm.register("address")}
                />
              </div>

              <div className="space-y-2">
                <FieldLabel icon={Globe}>Institutional Web Domain</FieldLabel>
                <input
                  type="url"
                  className="input-field"
                  {...collegeForm.register("website")}
                />
              </div>

              <div className="pt-5 sm:pt-6 border-t border-zinc-50 flex justify-stretch sm:justify-end">
                <button
                  type="submit"
                  disabled={collegeForm.formState.isSubmitting}
                  className="btn-primary w-full sm:w-auto py-3.5 px-5 sm:px-10 shadow-xl shadow-brand-500/15"
                >
                  <Save size={18} /> Synchronize Institutional Logic
                </button>
              </div>
            </form>
          </SettingsSection>
        </div>
      </div>
    </div>
  );
}
