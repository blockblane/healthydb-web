'use client'

import { Sidebar } from "@/components/layout/sidebar"
import { useAuth } from "@/lib/auth-context"
import { redirect } from "next/navigation"
import { useEffect } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      redirect('/')
    }
  }, [user, loading])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar className="w-64 border-r bg-gray-50/40" />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
