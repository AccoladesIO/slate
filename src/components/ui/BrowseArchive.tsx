"use client"

import type React from "react"
import { useState } from "react"
import { MdDelete, MdDownload } from "react-icons/md"

interface ArchivedFile {
  id: string
  name: string
  size: string
  date: string
  type: string
}

const BrowseArchive: React.FC = () => {
  const [files] = useState<ArchivedFile[]>([
    {
      id: "1",
      name: "Project Proposal Q4",
      size: "2.4 MB",
      date: "2024-10-15",
      type: "PDF",
    },
    {
      id: "2",
      name: "Design System v2",
      size: "5.1 MB",
      date: "2024-10-10",
      type: "Figma",
    },
    {
      id: "3",
      name: "Budget Spreadsheet",
      size: "1.2 MB",
      date: "2024-10-05",
      type: "Excel",
    },
    {
      id: "4",
      name: "Meeting Notes",
      size: "0.8 MB",
      date: "2024-09-28",
      type: "Document",
    },
    {
      id: "5",
      name: "Analytics Report",
      size: "3.7 MB",
      date: "2024-09-20",
      type: "PDF",
    },
  ])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="w-full">
      <div
        className="rounded-lg p-8"
        style={{ backgroundColor: "white", border: "1px solid", borderColor: "oklch(0.92 0.01 70)" }}
      >
        <h2 className="text-3xl font-light tracking-tight mb-2" style={{ color: "oklch(0.145 0 0)" }}>
          Archived Files
        </h2>
        <p className="text-sm font-light mb-8" style={{ color: "oklch(0.556 0 0)" }}>
          {files.length} files in your archive
        </p>

        {/* Files Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                style={{
                  borderBottomWidth: "1px",
                  borderBottomColor: "oklch(0.92 0.01 70)",
                }}
              >
                <th className="text-left py-4 px-4 font-medium" style={{ color: "oklch(0.145 0 0)" }}>
                  File Name
                </th>
                <th className="text-left py-4 px-4 font-medium" style={{ color: "oklch(0.145 0 0)" }}>
                  Type
                </th>
                <th className="text-left py-4 px-4 font-medium" style={{ color: "oklch(0.145 0 0)" }}>
                  Size
                </th>
                <th className="text-left py-4 px-4 font-medium" style={{ color: "oklch(0.145 0 0)" }}>
                  Date
                </th>
                <th className="text-center py-4 px-4 font-medium" style={{ color: "oklch(0.145 0 0)" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr
                  key={file.id}
                  className="hover:bg-opacity-50 transition-colors"
                  style={{
                    borderBottomWidth: "1px",
                    borderBottomColor: "oklch(0.92 0.01 70)",
                  }}
                >
                  <td className="py-4 px-4 font-medium" style={{ color: "oklch(0.145 0 0)" }}>
                    {file.name}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className="px-2 py-1 rounded text-xs font-medium"
                      style={{
                        backgroundColor: "oklch(0.98 0.01 70)",
                        color: "oklch(0.45 0.18 300)",
                      }}
                    >
                      {file.type}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm" style={{ color: "oklch(0.556 0 0)" }}>
                    {file.size}
                  </td>
                  <td className="py-4 px-4 text-sm" style={{ color: "oklch(0.556 0 0)" }}>
                    {formatDate(file.date)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="p-2 rounded transition-all hover:scale-110"
                        style={{
                          backgroundColor: "oklch(0.98 0.01 70)",
                          color: "oklch(0.45 0.18 300)",
                        }}
                        title="Download"
                      >
                        <MdDownload size={16} />
                      </button>
                      <button
                        className="p-2 rounded transition-all hover:scale-110"
                        style={{
                          backgroundColor: "oklch(0.98 0.01 70)",
                          color: "oklch(0.577 0.245 27.325)",
                        }}
                        title="Delete"
                      >
                        <MdDelete size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default BrowseArchive
