import { Camera, Mail, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import PageHeader from "@/components/ui/PageHeader";
import Avatar from "@/Component/ui/Avatar";
import { teacherService } from "@/services/teacherService";

export default function TeacherProfile() {
  const teacherQuery = useQuery({ queryKey: ["teachers", "me"], queryFn: teacherService.getMe });
  const teacher = teacherQuery.data;
  const [imageUrl, setImageUrl] = useState<string>();
  const [imageError, setImageError] = useState("");
  const upload = useMutation({
    mutationFn: (file: File) => teacherService.uploadImage(teacher!.id, file),
    onSuccess: async () => {
      const url = await teacherService.getImage(teacher!.id);
      setImageUrl(url);
      setImageError("");
      window.dispatchEvent(new Event("profile-image-updated"));
    },
    onError: () => setImageError("Image upload failed. Please try again."),
  });

  useEffect(() => {
    if (!teacher?.id) return;
    teacherService.getImage(teacher.id).then(setImageUrl).catch(() => undefined);
  }, [teacher?.id]);

  const onImageSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!( ["image/jpeg", "image/png", "image/webp"] as string[]).includes(file.type)) {
      setImageError("Use a JPEG, PNG, or WebP image.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setImageError("Image must be under 2MB.");
      return;
    }
    upload.mutate(file);
    event.target.value = "";
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title="My Profile" subtitle="Your faculty account information" />
      {teacherQuery.isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-sm text-gray-400">Loading profile...</div>
      ) : teacherQuery.isError || !teacher ? (
        <div className="bg-red-50 rounded-2xl border border-red-100 p-6 text-sm text-red-700">Unable to load your profile. Please try again.</div>
      ) : (
        <div className="space-y-6">
          <section className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex flex-wrap items-center gap-4">
              <Avatar name={teacher.fullName || "Teacher"} size="xl" imageUrl={imageUrl} color="brand" />
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:border-blue-300 hover:text-blue-600">
                <Camera size={15} /> {upload.isPending ? "Uploading..." : "Change photo"}
                <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={onImageSelected} disabled={upload.isPending} />
              </label>
              <div>
                <h2 className="text-xl font-medium text-gray-900">{teacher.fullName}</h2>
                <p className="text-sm text-gray-500">{teacher.email}</p>
                <span className="inline-flex px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium mt-1">Teacher</span>
              </div>
            </div>
            {imageError && <p className="mt-3 text-sm text-red-600">{imageError}</p>}
          </section>
          <section className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-medium text-gray-900 mb-4">Faculty Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
              <p className="flex items-center gap-2 text-gray-700"><User size={16} className="text-gray-400" /> {teacher.fullName}</p>
              <p className="flex items-center gap-2 text-gray-700"><Mail size={16} className="text-gray-400" /> {teacher.email}</p>
              <p className="flex items-center gap-2 text-gray-700"><Phone size={16} className="text-gray-400" /> {teacher.phone || "Not provided"}</p>
              <p className="text-gray-700"><span className="text-gray-400">Employee ID:</span> {teacher.employeeId}</p>
              <p className="text-gray-700"><span className="text-gray-400">Department:</span> {teacher.department?.name || "Not provided"}</p>
              <p className="text-gray-700"><span className="text-gray-400">Qualification:</span> {teacher.qualification || "Not provided"}</p>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
