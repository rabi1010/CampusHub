import { User } from "lucide-react"
import PageHeader from "@/components/ui/PageHeader"
import { useParentMe } from "@/features/parents/useParents"

export default function ParentProfile() {
  const parentQuery = useParentMe()
  const parent = parentQuery.data

  return (
    <div className="space-y-6">
      <PageHeader title="My Profile" subtitle="Your account information" />

      {parentQuery.isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-sm text-gray-400">
          Loading profile...
        </div>
      ) : parentQuery.isError || !parent ? (
        <div className="bg-red-50 rounded-2xl border border-red-100 p-6 text-sm text-red-700">
          Unable to load your profile. Please try again.
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <User size={28} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900">{parent.fullName}</h2>
                <p className="text-sm text-gray-500">{parent.email}</p>
                <span className="inline-flex px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium mt-1">
                  Parent
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-400 text-xs mb-1">Phone</p>
                <p className="font-medium text-gray-900">{parent.phone || "Not provided"}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Relationship</p>
                <p className="font-medium text-gray-900">{parent.relationship || "Not provided"}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Member since</p>
                <p className="font-medium text-gray-900">
                  {parent.createdAt
                    ? new Date(parent.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })
                    : "Not available"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-medium text-gray-900 mb-4">My Children</h3>
            {parent.children.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-400">
                No students are linked to this parent account.
              </p>
            ) : (
              <div className="space-y-3">
                {parent.children.map((child) => (
                  <div key={child.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <User size={18} className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{child.user.fullName}</p>
                      <p className="text-xs text-gray-500">
                        {child.rollNo} · {child.department.name} · {child.batch.name}
                      </p>
                      <p className="text-xs text-gray-400">{child.user.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
