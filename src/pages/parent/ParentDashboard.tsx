import { useState } from "react"
import { User, CalendarCheck, BookOpen, Award } from "lucide-react"
import StatCard from "@/components/ui/StatCard"
import PageHeader from "@/components/ui/PageHeader"
import { useParentMe } from "@/features/parents/useParents"
import { useStudentAttendance } from "@/features/attendance/useAttendance"
import { useStudentMarks } from "@/features/marks/useMarks"

export default function ParentDashboard() {
  const [selectedChildId, setSelectedChildId] = useState<string>()
  const parentQuery = useParentMe()
  const children = parentQuery.data?.children ?? []
  const selectedChild =
    children.find((child) => child.id === selectedChildId) ?? children[0]
  const attendanceQuery = useStudentAttendance(selectedChild?.id)
  const marksQuery = useStudentMarks(selectedChild?.id)

  const attendance = attendanceQuery.data ?? []
  const present = attendance.filter((record) => record.status === "PRESENT").length
  const absent = attendance.filter((record) => record.status === "ABSENT").length
  const late = attendance.filter((record) => record.status === "LATE").length
  const attendancePercentage = attendance.length
    ? ((present / attendance.length) * 100).toFixed(1)
    : null

  const marks = marksQuery.data ?? []
  const totalMarks = marks.reduce((sum, mark) => sum + mark.totalMarks, 0)
  const marksPercentage = totalMarks
    ? `${((marks.reduce((sum, mark) => sum + mark.marksObtained, 0) / totalMarks) * 100).toFixed(1)}%`
    : "No marks"

  const recentAbsences = attendance
    .filter((record) => record.status === "ABSENT")
    .toSorted((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)

  if (parentQuery.isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Parent Dashboard" subtitle="Loading your linked students" />
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-sm text-gray-400">
          Loading dashboard...
        </div>
      </div>
    )
  }

  if (parentQuery.isError) {
    return (
      <div className="space-y-6">
        <PageHeader title="Parent Dashboard" subtitle="Student overview" />
        <div className="bg-red-50 rounded-2xl border border-red-100 p-6 text-sm text-red-700">
          Unable to load your parent account. Please try again.
        </div>
      </div>
    )
  }

  if (!selectedChild) {
    return (
      <div className="space-y-6">
        <PageHeader title="Parent Dashboard" subtitle="Student overview" />
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-sm text-gray-400">
          No students are linked to this parent account.
        </div>
      </div>
    )
  }

  const recordsLoading = attendanceQuery.isLoading || marksQuery.isLoading
  const recordsError = attendanceQuery.isError || marksQuery.isError

  return (
    <div className="space-y-6">
      <PageHeader
        title="Parent Dashboard"
        subtitle={`Monitoring ${selectedChild.user.fullName}`}
      />

      {children.length > 1 && (
        <div className="flex items-center gap-3">
          <label htmlFor="dashboard-child" className="text-sm font-medium text-gray-600">
            Student
          </label>
          <select
            id="dashboard-child"
            value={selectedChild.id}
            onChange={(event) => setSelectedChildId(event.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500"
          >
            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.user.fullName} ({child.rollNo})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <User size={28} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900">{selectedChild.user.fullName}</h2>
            <p className="text-sm text-gray-500">Roll No: {selectedChild.rollNo}</p>
            <p className="text-sm text-gray-500">
              {selectedChild.department.name} · {selectedChild.batch.name}
            </p>
          </div>
          <div className="sm:ml-auto sm:text-right">
            <div className="text-3xl font-medium text-green-600">
              {attendanceQuery.isLoading ? "..." : attendancePercentage ? `${attendancePercentage}%` : "No data"}
            </div>
            <div className="text-xs text-gray-400">Attendance from loaded records</div>
          </div>
        </div>
      </div>

      {recordsError && (
        <div className="bg-red-50 rounded-2xl border border-red-100 p-4 text-sm text-red-700">
          Some student records could not be loaded. The available figures are shown below.
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Attendance Records" value={attendanceQuery.isLoading ? "..." : attendance.length} icon={BookOpen} color="brand" />
        <StatCard label="Present" value={attendanceQuery.isLoading ? "..." : present} icon={CalendarCheck} color="emerald" />
        <StatCard label="Absent" value={attendanceQuery.isLoading ? "..." : absent} icon={CalendarCheck} color="rose" />
        <StatCard label="Late" value={attendanceQuery.isLoading ? "..." : late} icon={CalendarCheck} color="amber" />
        <StatCard label="Marks Average" value={marksQuery.isLoading ? "..." : marksPercentage} icon={Award} color="indigo" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-medium text-gray-900 mb-4">Recent Absences</h3>
        {attendanceQuery.isLoading ? (
          <p className="py-8 text-center text-sm text-gray-400">Loading attendance records...</p>
        ) : attendanceQuery.isError ? (
          <p className="py-8 text-center text-sm text-red-600">Unable to load attendance records.</p>
        ) : recentAbsences.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">
            {attendance.length === 0 ? "No attendance records are available." : "No absences found in the available records."}
          </p>
        ) : (
          <div className="space-y-3">
            {recentAbsences.map((absence) => (
              <div key={absence.id} className="flex items-center justify-between gap-4 py-3 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{absence.course.name}</p>
                  <p className="text-xs text-gray-400">Marked by {absence.markedBy.fullName}</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex px-2 py-1 rounded-full bg-red-50 text-red-600 text-xs font-medium">Absent</span>
                  <p className="text-xs text-gray-400 mt-1">{absence.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {recordsLoading && <span className="sr-only">Loading student records</span>}
    </div>
  )
}
