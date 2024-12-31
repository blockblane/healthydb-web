'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to your health dashboard
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Daily Steps</CardTitle>
            <CardDescription>Your step count for today</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">8,234</p>
            <p className="text-xs text-muted-foreground">
              +20% from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sleep</CardTitle>
            <CardDescription>Last night&apos;s sleep duration</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">7h 23m</p>
            <p className="text-xs text-muted-foreground">
              +45m from previous night
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Heart Rate</CardTitle>
            <CardDescription>Average BPM today</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">72 BPM</p>
            <p className="text-xs text-muted-foreground">
              Normal range
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your health activities from the past week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              "Completed 30 minutes of cardio",
              "Logged 8 glasses of water",
              "Achieved sleep goal",
              "New personal record: 10,000 steps",
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <span>{activity}</span>
                <span className="text-sm text-muted-foreground">
                  {index === 0 ? "Today" : `${index}d ago`}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
