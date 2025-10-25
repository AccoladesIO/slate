"use client"

import { useState } from "react"
import { GiBookshelf } from "react-icons/gi"
import { IoAddOutline, IoPeopleOutline } from "react-icons/io5"
import { MdClose } from "react-icons/md"
import Layout from "@/components/Layout/Layout"
import AddProjectForm from "@/components/ui/AddProjectForm"
import BrowseArchive from "@/components/ui/BrowseArchive"
import ViewCollaborations from "@/components/ui/ViewCollaborations"


type ViewType = "home" | "add-project" | "browse-archive" | "collaborations"

const Dashboard = () => {
    const [activeView, setActiveView] = useState<ViewType>("home")

    const handleCardClick = (view: ViewType) => {
        setActiveView(view)
    }

    const handleClose = () => {
        setActiveView("home")
    }

    return (
        <Layout active="Dashboard">
            <div className="w-full min-h-screen" style={{ backgroundColor: "oklch(0.98 0.01 70)" }}>
                {/* Header Section */}
                <div className="w-full px-8 py-12 border-b" style={{ borderColor: "oklch(0.92 0.01 70)" }}>
                    <h1 className="text-5xl font-light tracking-tight" style={{ color: "oklch(0.145 0 0)" }}>
                        Dashboard
                    </h1>
                    <p className="text-base mt-3 font-light" style={{ color: "oklch(0.556 0 0)" }}>
                        Manage your projects, archive, and collaborations
                    </p>
                </div>

                {/* Main Content */}
                <div className="w-full px-8 py-12">
                    {activeView === "home" && (
                        <div className="w-full">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                {/* Create Project Card */}
                                <button
                                    onClick={() => handleCardClick("add-project")}
                                    className="group text-left p-8 rounded-lg transition-all duration-300 hover:shadow-sm focus:outline-none"
                                    style={{
                                        backgroundColor: "white",
                                        border: "1px solid",
                                        borderColor: "oklch(0.92 0.01 70)",
                                    }}
                                >
                                    <div className="flex flex-col h-full">
                                        <div
                                            className="w-12 h-12 rounded-lg mb-6 transition-all duration-300 group-hover:scale-105 flex items-center justify-center"
                                            style={{ backgroundColor: "oklch(0.45 0.18 300)" }}
                                        >
                                            <IoAddOutline size={24} color="white" />
                                        </div>
                                        <h3
                                            className="text-lg font-semibold mb-2 transition-colors duration-300"
                                            style={{ color: "oklch(0.145 0 0)" }}
                                        >
                                            Create Project
                                        </h3>
                                        <p className="text-sm font-light" style={{ color: "oklch(0.556 0 0)" }}>
                                            Start a new project and begin collaborating
                                        </p>
                                    </div>
                                </button>

                                {/* Browse Archive Card */}
                                <button
                                    onClick={() => handleCardClick("browse-archive")}
                                    className="group text-left p-8 rounded-lg transition-all duration-300 hover:shadow-sm focus:outline-none"
                                    style={{
                                        backgroundColor: "white",
                                        border: "1px solid",
                                        borderColor: "oklch(0.92 0.01 70)",
                                    }}
                                >
                                    <div className="flex flex-col h-full">
                                        <div
                                            className="w-12 h-12 rounded-lg mb-6 transition-all duration-300 group-hover:scale-105 flex items-center justify-center"
                                            style={{ backgroundColor: "oklch(0.65 0.25 330)" }}
                                        >
                                            <GiBookshelf size={24} color="white" />
                                        </div>
                                        <h3
                                            className="text-lg font-semibold mb-2 transition-colors duration-300"
                                            style={{ color: "oklch(0.145 0 0)" }}
                                        >
                                            Browse Archive
                                        </h3>
                                        <p className="text-sm font-light" style={{ color: "oklch(0.556 0 0)" }}>
                                            Access your saved files and previous work
                                        </p>
                                    </div>
                                </button>

                                {/* View Collaborations Card */}
                                <button
                                    onClick={() => handleCardClick("collaborations")}
                                    className="group text-left p-8 rounded-lg transition-all duration-300 hover:shadow-sm focus:outline-none"
                                    style={{
                                        backgroundColor: "white",
                                        border: "1px solid",
                                        borderColor: "oklch(0.92 0.01 70)",
                                    }}
                                >
                                    <div className="flex flex-col h-full">
                                        <div
                                            className="w-12 h-12 rounded-lg mb-6 transition-all duration-300 group-hover:scale-105 flex items-center justify-center"
                                            style={{ backgroundColor: "oklch(0.145 0 0)" }}
                                        >
                                            <IoPeopleOutline size={24} color="white" />
                                        </div>
                                        <h3
                                            className="text-lg font-semibold mb-2 transition-colors duration-300"
                                            style={{ color: "oklch(0.145 0 0)" }}
                                        >
                                            View Collaborations
                                        </h3>
                                        <p className="text-sm font-light" style={{ color: "oklch(0.556 0 0)" }}>
                                            Manage team members and permissions
                                        </p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Add Project View */}
                    {activeView === "add-project" && (
                        <div className="w-full">
                            <button
                                onClick={handleClose}
                                className="mb-8 flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium"
                                style={{
                                    backgroundColor: "white",
                                    color: "oklch(0.145 0 0)",
                                    border: "1px solid",
                                    borderColor: "oklch(0.92 0.01 70)",
                                }}
                            >
                                <MdClose size={18} />
                                Back
                            </button>
                            <div className="w-full flex items-center justify-center">
                                <AddProjectForm onClose={handleClose} />
                            </div>
                        </div>
                    )}

                    {/* Browse Archive View */}
                    {activeView === "browse-archive" && (
                        <div className="w-full">
                            <button
                                onClick={handleClose}
                                className="mb-8 flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium"
                                style={{
                                    backgroundColor: "white",
                                    color: "oklch(0.145 0 0)",
                                    border: "1px solid",
                                    borderColor: "oklch(0.92 0.01 70)",
                                }}
                            >
                                <MdClose size={18} />
                                Back
                            </button>
                            <BrowseArchive />
                        </div>
                    )}

                    {/* Collaborations View */}
                    {activeView === "collaborations" && (
                        <div className="w-full">
                            <button
                                onClick={handleClose}
                                className="mb-8 flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium"
                                style={{
                                    backgroundColor: "white",
                                    color: "oklch(0.145 0 0)",
                                    border: "1px solid",
                                    borderColor: "oklch(0.92 0.01 70)",
                                }}
                            >
                                <MdClose size={18} />
                                Back
                            </button>
                            <ViewCollaborations />
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    )
}

export default Dashboard
