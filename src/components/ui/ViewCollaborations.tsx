"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useContextValue } from "@/context/Context"

interface User {
  id: string
  name: string
  email: string
}

interface Presentation {
  id: string
  title: string
  description: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
  user: User
}

interface Share {
  id: string
  presentationId: string
  sharedWithUserId: string
  accessLevel: "read" | "write"
  sharedByUserId: string
  createdAt: string
  updatedAt: string
  presentation: Presentation
}

interface ShareGroup {
  period: string
  shares: Share[]
}

const ViewCollaborations: React.FC = () => {
  const [filterPeriod, setFilterPeriod] = useState<"all" | "7d" | "14d" | "30d">("all")
  const [shares, setShares] = useState<Share[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [forkingId, setForkingId] = useState<string | null>(null)

  const router = useRouter()
  const { duplicatePresentation } = useContextValue()

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

  useEffect(() => {
    fetchShares()
  }, [])

  const fetchShares = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${baseUrl}/sharing/shared-with-me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch shared presentations")
      }

      const result = await response.json()
      if (result.success && result.data.shares) {
        setShares(result.data.shares)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const getRoleColor = (accessLevel: string) => {
    switch (accessLevel) {
      case "write":
        return "oklch(0.45 0.18 300)"
      case "read":
        return "oklch(0.556 0 0)"
      default:
        return "oklch(0.556 0 0)"
    }
  }

  const getRoleLabel = (accessLevel: string) => {
    return accessLevel === "write" ? "Editor" : "Viewer"
  }

  const groupSharesByPeriod = (shares: Share[]): ShareGroup[] => {
    const now = new Date()
    const groups: ShareGroup[] = [
      { period: "Last 7 days", shares: [] },
      { period: "Last 14 days", shares: [] },
      { period: "Last 30 days", shares: [] },
      { period: "Earlier", shares: [] },
    ]

    shares.forEach((share) => {
      const createdDate = new Date(share.createdAt)
      const daysDiff = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff <= 7) {
        groups[0].shares.push(share)
      } else if (daysDiff <= 14) {
        groups[1].shares.push(share)
      } else if (daysDiff <= 30) {
        groups[2].shares.push(share)
      } else {
        groups[3].shares.push(share)
      }
    })

    return groups.filter((group) => group.shares.length > 0)
  }

  const getFilteredShares = () => {
    if (filterPeriod === "all") {
      return groupSharesByPeriod(shares)
    }

    const daysMap = {
      "7d": 7,
      "14d": 14,
      "30d": 30,
    }

    const days = daysMap[filterPeriod as keyof typeof daysMap]
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    const filteredShares = shares.filter((share) => {
      const createdDate = new Date(share.createdAt)
      return createdDate >= cutoffDate
    })

    return groupSharesByPeriod(filteredShares)
  }

  const handlePresentationClick = (presentationId: string) => {
    router.push(`/dashboard/canvas/${presentationId}`)
  }

  const handleForkPresentation = async (e: React.MouseEvent, presentationId: string) => {
    e.stopPropagation()
    
    try {
      setForkingId(presentationId)
      // ensure duplicatePresentation is callable at runtime and cast it to a function for TypeScript
      if (typeof duplicatePresentation !== "function") {
        throw new Error("duplicatePresentation is not available")
      }
      await (duplicatePresentation as unknown as (id: string) => Promise<void>)(presentationId)
    } catch (err) {
      console.error("Failed to fork presentation:", err)
      alert("Failed to fork presentation. Please try again.")
    } finally {
      setForkingId(null)
    }
  }

  const filteredData = getFilteredShares()

  if (loading) {
    return (
      <div className="w-full">
        <div
          className="rounded-lg p-8"
          style={{ backgroundColor: "white", border: "1px solid", borderColor: "oklch(0.92 0.01 70)" }}
        >
          <div className="text-center py-12">
            <p className="text-sm font-light" style={{ color: "oklch(0.556 0 0)" }}>
              Loading shared presentations...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full">
        <div
          className="rounded-lg p-8"
          style={{ backgroundColor: "white", border: "1px solid", borderColor: "oklch(0.92 0.01 70)" }}
        >
          <div className="text-center py-12">
            <p className="text-sm font-light" style={{ color: "oklch(0.577 0.245 27.325)" }}>
              Error: {error}
            </p>
            <button
              onClick={fetchShares}
              className="mt-4 px-4 py-2 rounded-lg font-medium text-sm"
              style={{
                backgroundColor: "oklch(0.45 0.18 300)",
                color: "white",
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div
        className="rounded-lg p-8"
        style={{ backgroundColor: "white", border: "1px solid", borderColor: "oklch(0.92 0.01 70)" }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-light tracking-tight mb-2" style={{ color: "oklch(0.145 0 0)" }}>
              Shared With Me
            </h2>
            <p className="text-sm font-light" style={{ color: "oklch(0.556 0 0)" }}>
              Presentations that others have shared with you
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

        {/* Shares List */}
        <div className="space-y-6">
          {filteredData.length > 0 ? (
            filteredData.map((group) => (
              <div key={group.period}>
                <h3 className="text-sm font-medium mb-4 uppercase tracking-wide" style={{ color: "oklch(0.556 0 0)" }}>
                  {group.period}
                </h3>
                <div className="space-y-3">
                  {group.shares.map((share) => (
                    <div
                      key={share.id}
                      onClick={() => handlePresentationClick(share.presentation.id)}
                      className="flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all hover:shadow-md"
                      style={{
                        backgroundColor: "oklch(0.98 0.01 70)",
                        border: "1px solid",
                        borderColor: "oklch(0.92 0.01 70)",
                      }}
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1" style={{ color: "oklch(0.145 0 0)" }}>
                          {share.presentation.title}
                        </h4>
                        <p className="text-xs font-light mb-1" style={{ color: "oklch(0.556 0 0)" }}>
                          {share.presentation.description}
                        </p>
                        <p className="text-xs font-light" style={{ color: "oklch(0.556 0 0)" }}>
                          Shared by: {share.presentation.user.name} ({share.presentation.user.email})
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <span
                          className="px-4 py-2.5 rounded text-xs font-medium"
                          style={{
                            backgroundColor: getRoleColor(share.accessLevel),
                            color: "white",
                          }}
                        >
                          {getRoleLabel(share.accessLevel)}
                        </span>
                        <button
                          onClick={(e) => handleForkPresentation(e, share.presentation.id)}
                          disabled={forkingId === share.presentation.id}
                          className="p-2 rounded transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{
                            backgroundColor: "oklch(0.92 0.01 70)",
                            color: "oklch(0.45 0.18 300)",
                          }}
                          title="Fork presentation"
                        >
                          {forkingId === share.presentation.id ? (
                            <span className="text-xs">...</span>
                          ) : (
                            <span className="text-xs font-medium">Fork</span>
                          )}
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
                No shared presentations found for the selected period.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ViewCollaborations