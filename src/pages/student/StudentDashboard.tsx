import { useMemo } from "react";
import { Link } from "react-router-dom";
import { BookOpen, UserCheck, Bell, TrendingUp, Star, Calendar, Clock, ArrowRight, Award, CheckCircle2, ChevronRight, Hash } from "lucide-react";
import { motion } from "framer-motion";
import { useAppSelector } from "../../app/hooks";
import { useMyNotices } from "../../features/notices/useNotices";
import StatCard from "../../components/ui/StatCard";
import clsx from "clsx";
import Badge from "../../Component/ui/Badge";

const MY_ENROLLED_COURSES = [
  {
    id: "1",
    name: "Data Structures",
    code: "CS101",
    teacher: "John Doe",
    progress: 75,
    attendance: 88,
    grade: "A",
  },
  {
    id: "2",
    name: "Database Systems",
    code: "CS102",
    teacher: "Sarah Miller",
    progress: 60,
    attendance: 92,
    grade: "B+",
  },
  {
    id: "3",
    name: "Web Development",
    code: "IT201",
    teacher: "Raj Thapa",
    progress: 85,
    attendance: 78,
    grade: "A+",
  },
  {
    id: "4",
    name: "Computer Networks",
    code: "CS401",
    teacher: "Anita Gurung",
    progress: 45,
    attendance: 70,
    grade: "B",
  },
];

const UPCOMING_EVENTS = [
  {
    id: "1",
    title: "CS101 Mid-term Exam",
    date: "May 18, 2024",
    type: "exam",
    subject: "Data Structures",
  },
  {
    id: "2",
    title: "Web Dev Project Due",
    date: "May 22, 2024",
    type: "assignment",
    subject: "Web Development",
  },
  {
    id: "3",
    title: "Annual Sports Week",
    date: "May 20-25, 2024",
    type: "event",
    subject: "Campus Life",
  },
];

const GRADE_POINTS: Record<string, number> = {
  "A+": 4.0, A: 4.0, "A-": 3.7, "B+": 3.3, B: 3.0, "B-": 2.7, "C+": 2.3, C: 2.0, F: 0.0,
};

function calculateGPA(courses: typeof MY_ENROLLED_COURSES): string {
  const points = courses.map((c) => GRADE_POINTS[c.grade] ?? 0);
  const avg = points.reduce((a, b) => a + b, 0) / points.length;
  return avg.toFixed(2);
}

function ProgressBar({ value, colorClass }: { value: number; colorClass: string }) {
  return (
    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(value, 100)}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={clsx("h-full rounded-full", colorClass)}
      />
    </div>
  );
}

export default function StudentDashboard() {
  const user = useAppSelector((s) => s.auth.user);
  const { data: notices = [] } = useMyNotices();

  const gpa = useMemo(() => calculateGPA(MY_ENROLLED_COURSES), []);

  const avgAttendance = useMemo(() => {
    const avg = MY_ENROLLED_COURSES.reduce((a, c) => a + c.attendance, 0) / MY_ENROLLED_COURSES.length;
    return Math.round(avg);
  }, []);

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

  return (
    <div className="space-y-10">
      {/* Dynamic Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-8"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-brand-600 font-bold text-[10px] uppercase tracking-[0.25em]">
            <Calendar size={14} /> {today}
          </div>
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 leading-tight tracking-tight">
            {greeting}, <span className="text-brand-600">{user?.fullName?.split(' ')[0]}</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">Your academic summary is synchronized and up-to-date.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/student/courses" className="btn-primary py-3.5 px-8 text-sm shadow-xl shadow-brand-500/15">
            Access My Registry <ArrowRight size={18} />
          </Link>
        </div>
      </motion.div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Cumulative GPA"
          value={gpa}
          icon={Star}
          color="amber"
          change="Academic Standing"
          positive
        />
        <StatCard
          label="Overall Attendance"
          value={`${avgAttendance}%`}
          icon={UserCheck}
          color="brand"
          change={avgAttendance >= 75 ? "Target Met" : "Needs Review"}
          positive={avgAttendance >= 75}
        />
        <StatCard
          label="Active Modules"
          value={MY_ENROLLED_COURSES.length}
          icon={BookOpen}
          color="indigo"
        />
        <StatCard
          label="Recent Bulletins"
          value={notices.length}
          icon={Bell}
          color="rose"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Course Performance Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
              Course Performance
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] rounded-full font-bold uppercase tracking-widest border border-emerald-100">
                <CheckCircle2 size={12} /> Live Status
              </div>
            </h2>
            <Link to="/student/courses" className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-all">
              Manage Enrollment <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {MY_ENROLLED_COURSES.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="card-base p-6 bg-white border-slate-100 hover:border-brand-200 transition-all group hover:shadow-lg"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                       <Hash size={12} className="text-slate-300" /> {course.code}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors leading-tight">{course.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">{course.teacher}</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 font-display font-bold text-lg shadow-sm group-hover:bg-brand-50 group-hover:border-brand-100 group-hover:text-brand-600 transition-all">
                    {course.grade}
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      <span>Curriculum Progress</span>
                      <span className="text-slate-600">{course.progress}%</span>
                    </div>
                    <ProgressBar value={course.progress} colorClass={course.progress > 70 ? "bg-emerald-500" : "bg-amber-500"} />
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      <span>Session Attendance</span>
                      <span className={course.attendance >= 75 ? "text-emerald-600" : "text-rose-600"}>{course.attendance}%</span>
                    </div>
                    <ProgressBar value={course.attendance} colorClass={course.attendance >= 75 ? "bg-brand-600" : "bg-rose-500"} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-8">
          {/* Elite Achievement Card */}
          <div className="card-base p-8 bg-slate-900 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/10 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-6">Academic Excellence</p>
              <div className="flex items-center gap-5 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400 border border-white/5 shadow-inner">
                  <Award size={40} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-4xl font-display font-bold text-white tracking-tight">{gpa}</p>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Global Score Index</p>
                </div>
              </div>
              <div className="pt-6 border-t border-white/10">
                <p className="text-sm font-medium text-slate-300 leading-relaxed italic opacity-80">"Education is the most powerful weapon which you can use to change the world."</p>
              </div>
            </div>
          </div>

          {/* Actionable Deadlines */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 px-2 uppercase tracking-widest flex items-center gap-2">
               Upcoming Deadlines
               <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            </h3>
            <div className="space-y-3">
              {UPCOMING_EVENTS.map((event) => (
                <div 
                  key={event.id}
                  className="p-5 rounded-2xl bg-white border border-slate-100 hover:border-brand-200 transition-all cursor-pointer group flex items-center gap-5 hover:shadow-md"
                >
                  <div className={clsx(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm border",
                    event.type === 'exam' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                    event.type === 'assignment' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-brand-50 text-brand-600 border-brand-100'
                  )}>
                    {event.type === 'exam' ? <TrendingUp size={22} /> : event.type === 'assignment' ? <Clock size={22} /> : <Calendar size={22} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-brand-600 transition-colors">{event.title}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{event.subject} · {event.date}</p>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-brand-400 transition-colors" />
                </div>
              ))}
            </div>
          </div>
          
          {/* Intelligence Bulletins */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 px-2 uppercase tracking-widest">Recent Bulletins</h3>
            <div className="space-y-3">
              {notices.slice(0, 2).map((n) => (
                <div key={n.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all group cursor-pointer">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Calendar size={10} /> {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                    {n.urgent && <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">URGENT</span>}
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 truncate group-hover:text-brand-600 transition-colors">{n.title}</h4>
                </div>
              ))}
              <Link to="/student/notices" className="block text-center py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 text-[11px] font-bold uppercase tracking-widest hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50 transition-all">
                Open Notice Board
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
