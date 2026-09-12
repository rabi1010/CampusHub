import { useState } from "react"
import PageHeader from "@/components/ui/PageHeader"
import { useParentMe } from "@/features/parents/useParents"
import { useStudentAttendance } from "@/features/attendance/useAttendance"

const filters = ["ALL", "PRESENT", "ABSENT", "LATE"] as const
type AttendanceFilter = (typeof filters)[number]

const statusColor = {
  PRESENT: "bg-green-50 text-green-700",
  ABSENT: "bg-red-50 text-red-700",
  LATE: "bg-yellow-50 text-yellow-700",
}

export default function ParentAttendance() {
  const [filter, setFilter] = useState<AttendanceFilter>("ALL")
  const [selectedChildId, setSelectedChildId] = useState<string>()
  const parentQuery = useParentMe()
  const children = parentQuery.data?.children ?? []
  const selectedChild =
    children.find((child) => child.id === selectedChildId) ?? children[0]
  const attendanceQuery = useStudentAttendance(selectedChild?.id)
  const attendance = attendanceQuery.data ?? []
  const filtered = filter === "ALL"
    ? attendance
    : attendance.filter((record) => record.status === filter)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance Record"
        subtitle={selectedChild
          ? `${selectedChild.user.fullName} · ${selectedChild.rollNo}`
          : "Attendance for your linked students"}
      />

      {children.length > 1 && (
        <div className="flex items-center gap-3">
          <label htmlFor="attendance-child" className="text-sm font-medium text-gray-600">
            Student
          </label>
          <select
            id="attendance-child"
            value={selectedChild?.id ?? ""}
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

      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === item
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
        {parentQuery.isLoading ? (
          <div className="py-12 text-center text-gray-400 text-sm">Loading linked students...</div>
        ) : parentQuery.isError ? (
          <div className="py-12 text-center text-red-600 text-sm">Unable to load your parent account.</div>
        ) : !selectedChild ? (
          <div className="py-12 text-center text-gray-400 text-sm">No students are linked to this parent account.</div>
        ) : attendanceQuery.isLoading ? (
          <div className="py-12 text-center text-gray-400 text-sm">Loading attendance records...</div>
        ) : attendanceQuery.isError ? (
          <div className="py-12 text-center text-red-600 text-sm">Unable to load attendance records.</div>
        ) : (
          <>
            <table className="w-full min-w-lg text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Date</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Course</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-600">{record.date}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {record.course.name}
                      <span className="block text-xs font-normal text-gray-400">{record.course.code}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColor[record.status]}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="py-12 text-center text-gray-400 text-sm">
                {attendance.length === 0
                  ? "No attendance records are available for this student."
                  : `No ${filter.toLowerCase()} attendance records found.`}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
