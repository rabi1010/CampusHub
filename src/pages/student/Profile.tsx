import {
  AlertCircle,
  AtSign,
  Clock,
  GraduationCap,
  IdCard,
  LockKeyhole,
  Mail,
  ShieldCheck,
  TrendingUp,
  User,
  Camera,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAppSelector } from "../../app/hooks";
import { useAttendanceSummary } from "../../features/attendance/useAttendance";
import { useGpa } from "../../features/marks/useMarks";
import PageHeader from "../../components/ui/PageHeader";
import Avatar from "../../Component/ui/Avatar";
import { studentService } from "../../services/studentService";

function Metric({
  label,
  value,
  isLoading,
  isError,
  icon: Icon,
}: {
  label: string;
  value?: string;
  isLoading: boolean;
  isError: boolean;
  icon: typeof TrendingUp;
}) {
  return (
    <div className="min-w-32 text-center">
      <p className="text-2xl font-display font-medium text-zinc-900">
        {isLoading ? "Loading" : isError || value === undefined ? "Unavailable" : value}
      </p>
      <div className="flex items-center justify-center gap-1.5 text-[9px] font-medium text-zinc-400 uppercase tracking-widest mt-1">
        <Icon size={10} /> {label}
      </div>
    </div>
  );
}

export default function Profile() {
  const user = useAppSelector((state) => state.auth.user);
  const gpaQuery = useGpa();
  const attendanceQuery = useAttendanceSummary();
  const studentQuery = useQuery({ queryKey: ["students", "me"], queryFn: studentService.getMe });
  const [imageUrl, setImageUrl] = useState<string>();
  const [imageError, setImageError] = useState("");
  const upload = useMutation({
    mutationFn: (file: File) => studentService.uploadImage(studentQuery.data!.id, file),
    onSuccess: async () => {
      if (studentQuery.data) {
        const response = await studentService.getImage(studentQuery.data.id);
        setImageUrl(response);
        window.dispatchEvent(new Event("student-profile-image-updated"));
      }
      setImageError("");
    },
    onError: () => setImageError("Image upload failed. Please try again."),
  });

  useEffect(() => {
    const id = studentQuery.data?.id;
    if (!id) return;
    studentService.getImage(id)
      .then((url) => setImageUrl(url))
      .catch(() => undefined);
  }, [studentQuery.data?.id]);

  const onImageSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!(["image/jpeg", "image/png", "image/webp"] as string[]).includes(file.type)) {
      setImageError("Use a JPEG, PNG, or WebP image.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setImageError("Image must be under 2MB.");
      return;
    }
    upload.mutate(file);
  };

  const gpa = gpaQuery.data?.toFixed(2);
  const attendance = attendanceQuery.data
    ? `${attendanceQuery.data.attendancePercentage.toFixed(1)}%`
    : undefined;

  return (
    <div className="space-y-8 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader
          title="Student Profile"
          subtitle="Your authenticated account identity and available academic summary."
        />
      </motion.div>

      <motion.section
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="card-base p-8 bg-white border-zinc-100 flex flex-col lg:flex-row lg:items-center gap-8 shadow-sm"
      >
        <Avatar
          name={user?.fullName ?? "Student"}
          size="xl"
          imageUrl={imageUrl}
          className="border-4 border-zinc-50 shadow-md ring-1 ring-zinc-100"
        />

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 hover:border-brand-300 hover:text-brand-600">
          <Camera size={15} />
          {upload.isPending ? "Uploading..." : "Change photo"}
          <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={onImageSelected} disabled={upload.isPending || studentQuery.isLoading} />
        </label>

        <div className="flex-1 text-center lg:text-left min-w-0">
          <h2 className="text-3xl font-display font-medium text-zinc-900 tracking-tight">
            {user?.fullName || "Student"}
          </h2>
          <p className="text-zinc-500 font-medium flex items-center justify-center lg:justify-start gap-2 mt-1 break-all">
            <Mail size={14} className="text-zinc-400 shrink-0" />
            {user?.email || "Email unavailable"}
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-2 mt-4">
            <span className="px-3 py-1 bg-brand-50 text-brand-600 text-[10px] font-medium uppercase tracking-widest rounded-lg border border-brand-100">
              {user?.role || "student"} account
            </span>
            {user?.id && (
              <span className="px-3 py-1 bg-zinc-50 text-zinc-600 text-[10px] font-medium uppercase tracking-widest rounded-lg border border-zinc-100">
                Account ID: {user.id}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 px-8 py-5 bg-zinc-50 rounded-2xl border border-zinc-100">
          <Metric
            label="Cumulative GPA"
            value={gpa}
            isLoading={gpaQuery.isLoading}
            isError={gpaQuery.isError}
            icon={TrendingUp}
          />
          <div className="hidden sm:block w-px h-10 bg-zinc-200" />
          <Metric
            label="Attendance"
            value={attendance}
            isLoading={attendanceQuery.isLoading}
            isError={attendanceQuery.isError}
            icon={Clock}
          />
        </div>
      </motion.section>

      {(gpaQuery.isError || attendanceQuery.isError) && (
        <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 flex items-start gap-3 text-sm text-rose-700">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          Some academic summary information could not be loaded from the server.
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
         {imageError && <p className="text-sm text-rose-600">{imageError}</p>}

         <motion.section
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card-base p-8 bg-white border-zinc-100 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-zinc-900 uppercase tracking-widest">
                Authenticated Identity
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">Account data from your session</p>
            </div>
          </div>

          <dl className="divide-y divide-zinc-100">
            <div className="py-4 flex items-center justify-between gap-6">
              <dt className="flex items-center gap-2 text-xs text-zinc-500">
                <User size={14} /> Full name
              </dt>
              <dd className="text-sm font-medium text-zinc-800 text-right">
                {user?.fullName || "Unavailable"}
              </dd>
            </div>
            <div className="py-4 flex items-center justify-between gap-6">
              <dt className="flex items-center gap-2 text-xs text-zinc-500">
                <AtSign size={14} /> Email
              </dt>
              <dd className="text-sm font-medium text-zinc-800 text-right break-all">
                {user?.email || "Unavailable"}
              </dd>
            </div>
            <div className="py-4 flex items-center justify-between gap-6">
              <dt className="flex items-center gap-2 text-xs text-zinc-500">
                <LockKeyhole size={14} /> Role
              </dt>
              <dd className="text-sm font-medium text-zinc-800 capitalize">
                {user?.role || "Unavailable"}
              </dd>
            </div>
            <div className="py-4 flex items-center justify-between gap-6">
              <dt className="flex items-center gap-2 text-xs text-zinc-500">
                <IdCard size={14} /> Account ID
              </dt>
              <dd className="text-sm font-medium text-zinc-800 text-right break-all">
                {user?.id || "Unavailable"}
              </dd>
            </div>
          </dl>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
           className="card-base p-8 bg-zinc-50 border-zinc-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-500">
              <GraduationCap size={18} />
            </div>
            <div>
               <h3 className="text-sm font-medium text-zinc-900 uppercase tracking-widest">
                 Student Record
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                 Linked academic information
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-white border border-zinc-200 p-5 space-y-3">
             {studentQuery.isLoading ? <p className="text-sm text-zinc-500">Loading student record...</p> : studentQuery.isError ? <p className="text-sm text-rose-600">Student record could not be loaded.</p> : <dl className="space-y-3 text-sm text-zinc-700"><div className="flex justify-between gap-4"><dt>Roll number</dt><dd className="font-medium">{studentQuery.data?.rollNo}</dd></div><div className="flex justify-between gap-4"><dt>Department</dt><dd className="font-medium">{studentQuery.data?.department?.name}</dd></div><div className="flex justify-between gap-4"><dt>Batch</dt><dd className="font-medium">{studentQuery.data?.batch?.name}</dd></div><div className="flex justify-between gap-4"><dt>Phone</dt><dd className="font-medium">{studentQuery.data?.phone || "Not provided"}</dd></div><div className="flex justify-between gap-4"><dt>Address</dt><dd className="font-medium text-right">{studentQuery.data?.address || "Not provided"}</dd></div></dl>}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
