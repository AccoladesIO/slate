"use client"
import Logo from "./Logo"
import { useRouter } from "next/navigation"

const NavBar = () => {
  const router = useRouter()

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="animate-fade-in">
          <Logo />
        </div>

        <button
          onClick={() => router.push("/auth/login")}
          className="px-6 py-2.5 bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium rounded-full text-sm transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
        >
          Join for free
        </button>
      </div>
    </div>
  )
}

export default NavBar
