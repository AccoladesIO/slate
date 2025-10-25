"use client"

import type React from "react"
import { useState } from "react"
import { MdRemove } from "react-icons/md"

interface Collaborator {
  id: string
  name: string
  email: string
  role: "Admin" | "Editor" | "Viewer"
  joinedDate: string
}

interface CollaborationGroup {
  period: string
  collaborators: Collaborator[]
}

const ViewCollaborations: React.FC = () => {
  const [filterPeriod, setFilterPeriod] = useState<"all" | "7d" | "14d" | "30d">("all")

  const allCollaborations: CollaborationGroup[] = [
    {
      period: "Last 7 days",
      collaborators: [
        {
          id: "1",
          name: "Sarah Johnson",
          email: "sarah@example.com",
          role: "Editor",
          joinedDate: "2024-10-20",
        },
        {
          id: "2",
          name: "Mike Chen",
          email: "mike@example.com",
          role: "Viewer",
          joinedDate: "2024-10-18",
        },
      ],
    },
    {
      period: "Last 14 days",
      collaborators: [
        {
          id: "3",
          name: "Emma Davis",
          email: "emma@example.com",
          role: "Admin",
          joinedDate: "2024-10-12",
        },
      ],
    },
    {
      period: "Last 30 days",
      collaborators: [
        {
          id: "4",
          name: "Alex Rodriguez",
          email: "alex@example.com",
          role: "Editor",
          joinedDate: "2024-10-01",
        },
      ],
    },
    {
      period: "Earlier",
      collaborators: [
        {
          id: "5",
          name: "Lisa Wang",
          email: "lisa@example.com",
          role: "Viewer",
          joinedDate: "2024-08-15",
        },
        {
          id: "6",
          name: "James Wilson",
          email: "james@example.com",
          role: "Editor",
          joinedDate: "2024-07-20",
        },
      ],
    },
  ]

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "oklch(0.45 0.18 300)"
      case "Editor":
        return "oklch(0.65 0.25 330)"
      default:
        return "oklch(0.556 0 0)"
    }
  }

  const getFilteredCollaborations = () => {
    if (filterPeriod === "all") {
      return allCollaborations
    }

    const daysMap = {
      "7d": 7,
      "14d": 14,
      "30d": 30,
    }

    const days = daysMap[filterPeriod as keyof typeof daysMap]
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    return allCollaborations
      .map((group) => ({
        ...group,
        collaborators: group.collaborators.filter((collab) => {
          const joinDate = new Date(collab.joinedDate)
          return joinDate >= cutoffDate
        }),
      }))
      .filter((group) => group.collaborators.length > 0)
  }

  const filteredData = getFilteredCollaborations()

  return (
    <div className="w-full">
      <div
        className="rounded-lg p-8"
        style={{ backgroundColor: "white", border: "1px solid", borderColor: "oklch(0.92 0.01 70)" }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-light tracking-tight mb-2" style={{ color: "oklch(0.145 0 0)" }}>
              Collaborations
            </h2>
            <p className="text-sm font-light" style={{ color: "oklch(0.556 0 0)" }}>
              Manage your team members and their permissions
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            {(["all", "7d", "14d", "30d"] as const).map((period) => (
              <button
                key={period}
                onClick={() => setFilterPeriod(period)}
                className="px-4 py-2 rounded-lg font-medium transition-all text-sm"
                style={{
                  backgroundColor: filterPeriod === period ? "oklch(0.45 0.18 300)" : "oklch(0.98 0.01 70)",
                  color: filterPeriod === period ? "white" : "oklch(0.145 0 0)",
                  border: filterPeriod === period ? "none" : "1px solid",
                  borderColor: filterPeriod === period ? "transparent" : "oklch(0.92 0.01 70)",
                }}
              >
                {period === "all" ? "All" : period}
              </button>
            ))}
          </div>
        </div>

        {/* Collaborations List */}
        <div className="space-y-6">
          {filteredData.length > 0 ? (
            filteredData.map((group) => (
              <div key={group.period}>
                <h3 className="text-sm font-medium mb-4 uppercase tracking-wide" style={{ color: "oklch(0.556 0 0)" }}>
                  {group.period}
                </h3>
                <div className="space-y-3">
                  {group.collaborators.map((collab) => (
                    <div
                      key={collab.id}
                      className="flex items-center justify-between p-4 rounded-lg"
                      style={{
                        backgroundColor: "oklch(0.98 0.01 70)",
                        border: "1px solid",
                        borderColor: "oklch(0.92 0.01 70)",
                      }}
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-sm" style={{ color: "oklch(0.145 0 0)" }}>
                          {collab.name}
                        </h4>
                        <p className="text-xs font-light" style={{ color: "oklch(0.556 0 0)" }}>
                          {collab.email}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <span
                          className="px-3 py-1 rounded text-xs font-medium"
                          style={{
                            backgroundColor: getRoleColor(collab.role),
                            color: "white",
                          }}
                        >
                          {collab.role}
                        </span>
                        <button
                          className="p-2 rounded transition-all hover:scale-110"
                          style={{
                            backgroundColor: "oklch(0.92 0.01 70)",
                            color: "oklch(0.577 0.245 27.325)",
                          }}
                          title="Remove collaborator"
                        >
                          <MdRemove size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-sm font-light" style={{ color: "oklch(0.556 0 0)" }}>
                No collaborations found for the selected period.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ViewCollaborations
