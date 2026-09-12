import { BookOpen, Building2, Calendar, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { useCourses } from "../../features/courses/useCourses";
import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../Component/ui/EmptyState";

export default function MyCourses() {
  const coursesQuery = useCourses();
  const courses = coursesQuery.data ?? [];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader
          title="Academic Course Catalog"
          subtitle={
            coursesQuery.isLoading
              ? "Loading the available course catalog."
              : coursesQuery.isError
                ? "The available course catalog could not be loaded."
                : `${courses.length} course${courses.length === 1 ? "" : "s"} available in the catalog.`
          }
        />
      </motion.div>

      {coursesQuery.isLoading ? (
        <div className="card-base bg-white p-12 text-center text-sm text-zinc-500">
          Loading course catalog...
        </div>
      ) : coursesQuery.isError ? (
        <div className="card-base bg-rose-50 border-rose-100 p-8 text-center">
          <p className="font-medium text-rose-800">Course catalog unavailable</p>
          <p className="text-sm text-rose-600 mt-1">
            Course data could not be retrieved from the server.
          </p>
        </div>
      ) : courses.length === 0 ? (
        <div className="card-base bg-white p-12">
          <EmptyState
            icon={BookOpen}
            title="No Catalog Courses"
            description="No courses are currently available in the academic catalog."
          />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {courses.map((course, index) => (
            <motion.article
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              key={course.id}
              className="card-base p-6 bg-white border-zinc-100 flex flex-col gap-5 hover:shadow-lg hover:border-brand-100 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 shrink-0">
                  <BookOpen size={23} />
                </div>
                <div className="min-w-0">
                  <span className="font-mono text-[10px] font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                    {course.code}
                  </span>
                  <h2 className="text-lg font-medium text-zinc-900 group-hover:text-brand-600 transition-colors mt-2">
                    {course.name}
                  </h2>
                </div>
              </div>

              <p className="text-sm text-zinc-500 leading-relaxed flex-1">
                {course.description || "No course description is available."}
              </p>

              <dl className="grid sm:grid-cols-3 gap-3 pt-5 border-t border-zinc-100">
                <div className="min-w-0">
                  <dt className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
                    <Building2 size={12} /> Department
                  </dt>
                  <dd className="text-sm font-medium text-zinc-700 mt-1 truncate">
                    {course.department.name}
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
                    <CreditCard size={12} /> Credits
                  </dt>
                  <dd className="text-sm font-medium text-zinc-700 mt-1">
                    {course.credits}
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
                    <Calendar size={12} /> Semester
                  </dt>
                  <dd className="text-sm font-medium text-zinc-700 mt-1">
                    {course.semester}
                  </dd>
                </div>
              </dl>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}
