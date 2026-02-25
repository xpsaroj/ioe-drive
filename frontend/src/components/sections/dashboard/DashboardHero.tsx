"use client"
import { useUser } from "@clerk/nextjs"

const DashboardHero = () => {
    const { user } = useUser()

    return (
        <div>
            <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {user?.firstName || "User"}!</h1>
            <p className="text-foreground-secondary mt-2">What would you like to do today?</p>
        </div>
    )
}

export default DashboardHero