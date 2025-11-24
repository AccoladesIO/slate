import React, { useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import Header from "../ui/Header"
import SideBar from "../ui/SideBar"
import { useContextValue } from "@/context/Context"
import { useAuth } from "@/context/useAuth"
import { useRouter } from "next/router"

interface LayoutProp {
    children: React.ReactNode
    active: string
}

const Layout: React.FC<LayoutProp> = ({ children, active }) => {
    const { sideBarOpen } = useContextValue()
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) router.push("/auth/login")
    }, [user, loading, router])

    if (loading || !user) return null

    return (
        <div className="w-full flex relative">
            <AnimatePresence>{sideBarOpen && <SideBar active={active} />}</AnimatePresence>
            <div className="w-full sm:mb-0 mb-10">
                <Header />
                {children}
            </div>
        </div>
    )
}

export default Layout
