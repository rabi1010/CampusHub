import { User } from "lucide-react"
import PageHeader from "@/components/ui/PageHeader"

export default function ParentProfile() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        subtitle="Your account information"
      />

      {/* Parent info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <User size={28} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Ram Sharma
            </h2>
            <p className="text-sm text-gray-500">
              parent@example.com
            </p>
            <span className="inline-flex px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium mt-1">
              Parent
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400 text-xs mb-1">Phone</p>
            <p className="font-medium text-gray-900">+977 9800000000</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-1">Member since</p>
            <p className="font-medium text-gray-900">June 2026</p>
          </div>
        </div>
      </div>

      {/* Linked children */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          My Children
        </h3>
        <div className="space-y-3">
          {[
            {
              name:       "Aarav Sharma",
              rollNo:     "BCA001",
              department: "Computer Science",
              batch:      "2023-2026",
            },
          ].map((child, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <User size={18} className="text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  {child.name}
                </p>
                <p className="text-xs text-gray-500">
                  {child.rollNo} · {child.department}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
