import { useState }   from "react"
import PageHeader     from "@/components/ui/PageHeader"

const mockAttendance = [
  { date: "2026-06-04", course: "Data Structures",   status: "PRESENT" },
  { date: "2026-06-04", course: "Operating Systems", status: "PRESENT" },
  { date: "2026-06-03", course: "Data Structures",   status: "ABSENT"  },
  { date: "2026-06-03", course: "Database Systems",  status: "LATE"    },
  { date: "2026-06-02", course: "Data Structures",   status: "PRESENT" },
  { date: "2026-06-02", course: "Operating Systems", status: "ABSENT"  },
]

const statusColor = {
  PRESENT: "bg-green-50 text-green-700",
  ABSENT:  "bg-red-50 text-red-700",
  LATE:    "bg-yellow-50 text-yellow-700",
}

export default function ParentAttendance() {
  const [filter, setFilter] = useState<"ALL" | "PRESENT" | "ABSENT" | "LATE">("ALL")

  const filtered = filter === "ALL"
    ? mockAttendance
    : mockAttendance.filter((a) => a.status === filter)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance Record"
        subtitle="Aarav Sharma — BCA001"
      />

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["ALL", "PRESENT", "ABSENT", "LATE"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Attendance list */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">
                Date
              </th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">
                Course
              </th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((record, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-600">
                  {record.date}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {record.course}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColor[record.status as keyof typeof statusColor]}`}>
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">
            No records found
          </div>
        )}
      </div>

    </div>
  )
}
