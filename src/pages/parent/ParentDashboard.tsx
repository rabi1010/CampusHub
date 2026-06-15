import { User, CalendarCheck, BookOpen, Bell } from "lucide-react"
import StatCard    from "@/components/ui/StatCard"
import PageHeader  from "@/components/ui/PageHeader"

// Mock data — will connect to real API later
const mockChild = {
  name:         "Aarav Sharma",
  rollNo:       "BCA001",
  department:   "Computer Science",
  batch:        "2023-2026",
  profileImage: null,
}

const mockStats = {
  totalClasses:   48,
  present:        42,
  absent:         4,
  late:           2,
  attendancePct:  87.5,
}

export default function ParentDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Parent Dashboard"
        subtitle={`Monitoring ${mockChild.name}`}
      />

      {/* Child info card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <User size={28} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {mockChild.name}
            </h2>
            <p className="text-sm text-gray-500">
              Roll No: {mockChild.rollNo}
            </p>
            <p className="text-sm text-gray-500">
              {mockChild.department} · {mockChild.batch}
            </p>
          </div>
          <div className="ml-auto text-right">
            <div className="text-3xl font-bold text-green-600">
              {mockStats.attendancePct}%
            </div>
            <div className="text-xs text-gray-400">Overall Attendance</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Classes"
          value={mockStats.totalClasses}
          icon={BookOpen}
          color="brand"
        />
        <StatCard
          label="Present"
          value={mockStats.present}
          icon={CalendarCheck}
          color="emerald"
        />
        <StatCard
          label="Absent"
          value={mockStats.absent}
          icon={CalendarCheck}
          color="rose"
        />
        <StatCard
          label="Late"
          value={mockStats.late}
          icon={CalendarCheck}
          color="amber"
        />
      </div>

      {/* Recent absences */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          Recent Absences
        </h3>
        <div className="space-y-3">
          {[
            { date: "2026-06-03", course: "Data Structures",  teacher: "Mr. Sharma" },
            { date: "2026-05-28", course: "Operating Systems", teacher: "Ms. Thapa" },
          ].map((absence, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {absence.course}
                </p>
                <p className="text-xs text-gray-400">
                  {absence.teacher}
                </p>
              </div>
              <div className="text-right">
                <span className="inline-flex px-2 py-1 rounded-full bg-red-50 text-red-600 text-xs font-medium">
                  Absent
                </span>
                <p className="text-xs text-gray-400 mt-1">
                  {absence.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
