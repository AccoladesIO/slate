"use client"

import type React from "react"
import { useState } from "react"

interface AddProjectFormProps {
  onClose: () => void
}

const AddProjectForm: React.FC<AddProjectFormProps> = ({ onClose }) => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      setIsSubmitted(true)
      setTimeout(() => {
        setTitle("")
        setDescription("")
        setIsSubmitted(false)
        onClose()
      }, 1500)
    }
  }

  return (
    <div className="w-full max-w-2xl">
      <div
        className="rounded-lg p-8"
        style={{ backgroundColor: "white", border: "1px solid", borderColor: "oklch(0.92 0.01 70)" }}
      >
        <h2 className="text-3xl font-light tracking-tight mb-2" style={{ color: "oklch(0.145 0 0)" }}>
          Create New Project
        </h2>
        <p className="text-sm font-light mb-8" style={{ color: "oklch(0.556 0 0)" }}>
          Fill in the details to get started
        </p>

        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "oklch(0.45 0.18 300)" }}
            >
              <svg className="w-8 h-8" style={{ color: "white" }} fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-light" style={{ color: "oklch(0.145 0 0)" }}>
              Project Created
            </h3>
            <p className="text-sm font-light" style={{ color: "oklch(0.556 0 0)" }}>
              Your project "{title}" has been created successfully.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: "oklch(0.145 0 0)" }}>
                Project Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter project title"
                className="w-full px-4 py-3 rounded-lg border transition-all focus:outline-none text-sm"
                style={{
                  borderColor: "oklch(0.92 0.01 70)",
                  backgroundColor: "oklch(0.98 0.01 70)",
                  color: "oklch(0.145 0 0)",
                }}
              />
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: "oklch(0.145 0 0)" }}>
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter project description"
                rows={5}
                className="w-full px-4 py-3 rounded-lg border transition-all focus:outline-none resize-none text-sm"
                style={{
                  borderColor: "oklch(0.92 0.01 70)",
                  backgroundColor: "oklch(0.98 0.01 70)",
                  color: "oklch(0.145 0 0)",
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!title.trim()}
              className="w-full py-3 rounded-lg font-medium transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "oklch(0.45 0.18 300)",
                color: "white",
              }}
            >
              Create Project
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default AddProjectForm
