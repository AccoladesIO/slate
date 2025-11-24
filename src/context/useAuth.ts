"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"

export const useAuth = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const base = process.env.NEXT_PUBLIC_API_URL || ""

    const fetchUser = async () => {
        try {
            const res = await fetch(`${base}/auth/me`, { credentials: 'include' })
            if (!res.ok) throw new Error("Unauthorized")
            const data = await res.json()
            setUser(data.data)
        } catch {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    const login = async (email: string, password: string) => {
        const res = await fetch(`${base}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include"
        })
        if (!res.ok) {
            const data = await res.json()
            throw new Error(data?.message || "Login failed")
        }
        await fetchUser()
        router.push("/dashboard")
    }

    const signup = async (name: string, email: string, password: string) => {
        const res = await fetch(`${base}/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
            credentials: "include"
        })
        if (!res.ok) {
            const data = await res.json()
            throw new Error(data?.message || "Signup failed")
        }
        await fetchUser()
        router.push("/dashboard")
    }

    const logout = async () => {
        await fetch(`${base}/auth/logout`, { method: 'POST', credentials: 'include' })
        setUser(null)
        router.push("/auth/login")
    }

    useEffect(() => {
        fetchUser()
    }, [])

    return { user, loading, login, signup, logout }
}
