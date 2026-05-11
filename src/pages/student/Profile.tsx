import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, AlertCircle, TrendingUp, Calendar, MapPin, Phone, Mail, User, GraduationCap, Clock, Hash, Layers, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAppSelector } from "../../app/hooks";

import PageHeader from "../../components/ui/PageHeader";
import { useToast } from "../../Component/ui/Toast";
import Avatar from "../../Component/ui/Avatar";
import Badge from "../../Component/ui/Badge";
import clsx from "clsx";

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

function FieldLabel({ children, icon: Icon }: { children: React.ReactNode; icon?: any }) {
  return (
    <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
      {Icon && <Icon size={12} className="text-slate-300" />}
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

function InfoRow({ label, value, icon: Icon }: { label: string; value: string; icon?: any }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0 group">
      <div className="flex items-center gap-3">
        {Icon && <Icon size={14} className="text-slate-300 group-hover:text-brand-400 transition-colors" />}
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      </div>
      <span className="text-sm text-slate-700 font-bold">{value}</span>
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
    toast.success("Profile synchronized", "Your student credentials have been updated successfully.");
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader
          title="Student Credentials"
          subtitle="Manage your academic identity and contact information."
        />
      </motion.div>

      {/* Hero Profile Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="card-base p-8 bg-white border-slate-100 flex flex-col md:flex-row items-center gap-8 shadow-sm"
      >
        <div className="relative">
          <Avatar name={user?.fullName ?? "Student"} size="xl" className="border-4 border-slate-50 shadow-md ring-1 ring-slate-100" />
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 border-4 border-white w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm" title="Active Account">
            <CheckCircle2 size={16} />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">{user?.fullName}</h2>
            <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2 mt-1">
              <Mail size={14} className="text-slate-400" /> {user?.email}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <div className="px-3 py-1 bg-brand-50 text-brand-600 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-brand-100">
               ID: {STUDENT_PROFILE.rollNo}
            </div>
            <div className="px-3 py-1 bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-slate-100">
               {STUDENT_PROFILE.department}
            </div>
            <div className="px-3 py-1 bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-slate-100">
               Batch {STUDENT_PROFILE.batch}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8 px-8 py-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="text-center">
            <p className="text-2xl font-display font-bold text-emerald-600">{STUDENT_PROFILE.gpa}</p>
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              <TrendingUp size={10} /> Cum. GPA
            </div>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="text-center">
            <p className="text-2xl font-display font-bold text-brand-600">{STUDENT_PROFILE.attendance}</p>
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              <Clock size={10} /> Attendance
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Academic Profile */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card-base p-8 bg-white border-slate-100 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
              <GraduationCap size={16} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Academic Record</h3>
          </div>
          
          <div className="space-y-1">
            <InfoRow label="Registration Number" value={STUDENT_PROFILE.rollNo} icon={Hash} />
            <InfoRow label="Curriculum Department" value={STUDENT_PROFILE.department} icon={Layers} />
            <InfoRow label="Admission Batch" value={STUDENT_PROFILE.batch} icon={Calendar} />
            <InfoRow label="Current Semester" value={`Level ${STUDENT_PROFILE.semester}`} icon={TrendingUp} />
            <InfoRow label="Date of Admission" value={STUDENT_PROFILE.admissionDate} icon={Calendar} />
          </div>
        </motion.div>

        {/* Contact Preferences */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card-base p-8 bg-white border-slate-100 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
              <User size={16} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Personal Details</h3>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <FieldLabel icon={User}>Full Identity</FieldLabel>
                <div className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-400 select-none">
                  {user?.fullName}
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Contact administration for name updates.</p>
              </div>

              <div className="space-y-2">
                <FieldLabel icon={Mail}>Email Address</FieldLabel>
                <div className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-400 select-none">
                  {user?.email}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <FieldLabel icon={Phone}>Contact Number</FieldLabel>
              <input
                type="tel"
                className={clsx(
                  "w-full px-4 py-3 bg-white border rounded-xl text-sm font-bold transition-all outline-none",
                  errors.phone ? "border-rose-200 bg-rose-50/30 text-rose-600" : "border-slate-100 focus:border-brand-300 focus:ring-4 focus:ring-brand-500/5 text-slate-900"
                )}
                {...register("phone")}
              />
              <FieldError message={errors.phone?.message} />
            </div>

            <div className="space-y-2">
              <FieldLabel icon={MapPin}>Residential Address</FieldLabel>
              <input
                type="text"
                className={clsx(
                  "w-full px-4 py-3 bg-white border rounded-xl text-sm font-bold transition-all outline-none",
                  errors.address ? "border-rose-200 bg-rose-50/30 text-rose-600" : "border-slate-100 focus:border-brand-300 focus:ring-4 focus:ring-brand-500/5 text-slate-900"
                )}
                {...register("address")}
              />
              <FieldError message={errors.address?.message} />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-3 px-8 shadow-brand-500/10 disabled:opacity-50"
              >
                {isSubmitting ? "Synchronizing..." : <><Save size={18} /> Update Personal Details</>}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
