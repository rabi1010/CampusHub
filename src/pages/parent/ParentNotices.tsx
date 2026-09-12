import PageHeader from "@/components/ui/PageHeader"
import Badge from "@/Component/ui/Badge"
import { useMyNotices } from "@/features/notices/useNotices"

export default function ParentNotices() {
  const noticesQuery = useMyNotices()
  const notices = (noticesQuery.data ?? []).filter(
    (notice) => notice.forRole === "ALL" || notice.forRole === "PARENT",
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notices"
        subtitle="Important announcements from the college"
      />

      {noticesQuery.isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-sm text-gray-400">
          Loading notices...
        </div>
      ) : noticesQuery.isError ? (
        <div className="bg-red-50 rounded-2xl border border-red-100 p-6 text-sm text-red-700">
          Unable to load notices. Please try again.
        </div>
      ) : notices.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-sm text-gray-400">
          No notices are available for parents.
        </div>
      ) : (
        <div className="space-y-3">
          {notices.map((notice) => (
            <div key={notice.id} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900">{notice.title}</h3>
                    {notice.urgent && <Badge variant="danger" label="Urgent" />}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{notice.content}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-gray-50">
                <span className="text-xs text-gray-400">Posted by {notice.createdBy.fullName}</span>
                <span className="text-xs text-gray-300">·</span>
                <span className="text-xs text-gray-400">
                  {new Date(notice.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
