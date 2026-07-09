import PageHeader from "@/components/ui/PageHeader"
import Badge      from "@/Component/ui/Badge"

const mockNotices = [
  {
    id: "1",
    title:     "Semester Exam Schedule Released",
    content:   "Final exams will begin from June 15th. Check the timetable on the notice board.",
    urgent:    true,
    createdAt: "2026-06-04",
    postedBy:  "Admin",
  },
  {
    id: "2",
    title:     "College Closed on Monday",
    content:   "College will remain closed on Monday June 8th due to a public holiday.",
    urgent:    false,
    createdAt: "2026-06-03",
    postedBy:  "Admin",
  },
]

export default function ParentNotices() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Notices"
        subtitle="Important announcements from the college"
      />

      <div className="space-y-3">
        {mockNotices.map((notice) => (
          <div
            key={notice.id}
            className="bg-white rounded-2xl border border-gray-100 p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-900">
                    {notice.title}
                  </h3>
                  {notice.urgent && (
                    <Badge color="red" label="Urgent" />
                  )}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {notice.content}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50">
              <span className="text-xs text-gray-400">
                Posted by {notice.postedBy}
              </span>
              <span className="text-xs text-gray-300">·</span>
              <span className="text-xs text-gray-400">
                {notice.createdAt}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
