import { useMemo } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, BookOpen, UserCheck, Bell, Clock, Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAppSelector } from "../../app/hooks";
import { useStudents } from "../../features/students/useStudents";
import { useCourses } from "../../features/courses/useCourses";
import { useMyNotices } from "../../features/notices/useNotices";
import StatCard from "../../components/ui/StatCard";
import { CardSkeleton } from "../../Component/ui/Skeleton";
import Badge from "../../Component/ui/Badge";

// ── Mock schedule ────────────────────────────────────────
const TODAY_SCHEDULE = [
  {
    id: "1",
    course: "Data Structures",
    code: "CS101",
    time: "09:00 AM",
    duration: "1h 30m",
    room: "Hall A",
    students: 45,
    status: "ongoing",
  },
  {
    id: "2",
    course: "Database Systems",
    code: "CS102",
    time: "11:00 AM",
    duration: "1h 30m",
    room: "Lab 2",
    students: 38,
    status: "upcoming",
  },
  {
    id: "3",
    course: "Web Development",
    code: "IT201",
    time: "02:00 PM",
    duration: "2h 00m",
    room: "Lab 1",
    students: 52,
    status: "later",
  },
];

export default function TeacherDashboard() {
  const user = useAppSelector((s) => s.auth.user);

  const { data: students = [], isLoading: sLoading } = useStudents();
  const { data: courses = [], isLoading: cLoading } = useCourses();
  const { data: notices = [] } = useMyNotices();

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const isLoading = sLoading || cLoading;

  return (
    <div className="space-y-10">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-2 mb-2 text-brand-600 font-medium text-xs uppercase tracking-[0.2em]">
            <Calendar size={14} /> {today}
          </div>
          <h1 className="text-4xl font-display font-medium text-zinc-900 leading-tight">
            {greeting}, <span className="text-brand-600">{user?.fullName?.split(' ')[0]}</span>
          </h1>
          <p className="text-zinc-500 font-medium mt-1">Ready for your classes today?</p>
        </div>
        <div className="flex gap-3">
          <Link to="/teacher/attendance" className="btn-primary py-2.5 px-5 text-sm shadow-brand-500/10">
            Take Attendance <UserCheck size={16} />
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      {isLoading ? (
        <CardSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Assigned Courses" value={courses.length || 4} icon={BookOpen} color="brand" />
          <StatCard
            label="Total Students"
            value={students.length}
            icon={GraduationCap}
            color="brand"
          />
          <StatCard
            label="Avg. Attendance"
            value="88%"
            icon={UserCheck}
            color="emerald"
          />
          <StatCard
            label="System Notices"
            value={notices.length}
            icon={Bell}
            color="amber"
          />
        </div>
      )}

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Today's schedule */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-medium text-zinc-900 flex items-center gap-2">
              Today's Schedule
              <span className="text-[10px] bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full font-medium uppercase tracking-widest">Active</span>
            </h2>
            <Link to="/teacher/marks" className="text-xs font-medium text-brand-600 hover:underline">
              View Weekly Planner
            </Link>
          </div>

          <div className="space-y-4">
            {TODAY_SCHEDULE.map((cls, i) => (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card-base p-6 bg-white border-zinc-100 flex flex-col sm:flex-row items-start sm:items-center gap-6 group hover:border-brand-200 transition-all"
              >
                {/* Time Indicator */}
                <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-zinc-50 border border-zinc-100 min-w-[100px] group-hover:bg-brand-50 group-hover:border-brand-100 transition-colors">
                  <Clock size={16} className="text-brand-600 mb-1" />
                  <span className="text-sm font-medium text-zinc-900">{cls.time}</span>
                  <span className="text-[10px] font-medium text-zinc-400 uppercase">{cls.duration}</span>
                </div>

                {/* Info */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500 uppercase tracking-widest">{cls.code}</span>
                    <Badge 
                      label={cls.status === 'ongoing' ? 'Now' : cls.status} 
                      variant={cls.status === 'ongoing' ? 'success' : cls.status === 'upcoming' ? 'warning' : 'default'}
                    />
                  </div>
                  <h3 className="text-lg font-medium text-zinc-900 group-hover:text-brand-600 transition-colors">{cls.course}</h3>
                  <div className="flex items-center gap-4 text-xs font-medium text-zinc-500">
                    <span className="flex items-center gap-1"><MapPin size={12} className="text-zinc-400" /> {cls.room}</span>
                    <span className="flex items-center gap-1"><Users size={12} className="text-zinc-400" /> {cls.students} Students</span>
                  </div>
                </div>

                <button className="self-end sm:self-center p-3 rounded-xl bg-zinc-50 text-zinc-400 group-hover:bg-brand-600 group-hover:text-white transition-all">
                  <ArrowRight size={18} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="card-base p-6 bg-white border-zinc-100 shadow-sm">
            <h3 className="text-sm font-medium text-zinc-900 mb-4 uppercase tracking-widest">Resource Center</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-zinc-50 hover:bg-brand-50 hover:text-brand-600 border border-zinc-100 transition-all group">
                <BookOpen size={20} className="text-zinc-400 group-hover:text-brand-600" />
                <span className="text-xs font-medium">Curriculum</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-zinc-50 hover:bg-brand-50 hover:text-brand-600 border border-zinc-100 transition-all group">
                <UserCheck size={20} className="text-zinc-400 group-hover:text-brand-600" />
                <span className="text-xs font-medium">Reports</span>
              </button>
            </div>
          </div>

          {/* Notices */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-zinc-900 px-2 uppercase tracking-widest">Recent Updates</h3>
            <div className="space-y-3">
              {notices.slice(0, 3).map((n) => (
                <div 
                  key={n.id}
                  className="p-4 rounded-2xl bg-white border border-zinc-100 hover:border-brand-200 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <Badge label="Faculty" variant={n.urgent ? "danger" : "info"} />
                    <span className="text-[10px] font-medium text-zinc-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="text-sm font-medium text-zinc-800 group-hover:text-brand-600 truncate transition-colors">{n.title}</h4>
                </div>
              ))}
              {notices.length === 0 && (
                <div className="p-8 text-center bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200">
                  <p className="text-xs font-medium text-zinc-400">No new notices</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
