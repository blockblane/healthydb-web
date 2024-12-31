'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { LucideIcon, Home, Activity, Settings, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from "sonner"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

interface SidebarItem {
  title: string
  href: string
  icon: LucideIcon
}

const items: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Activity",
    href: "/dashboard/activity",
    icon: Activity,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClientComponentClient()

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      toast.success('Signed out successfully')
      router.replace('/')
    } catch (error) {
      toast.error('Error signing out')
      console.error('Error:', error)
    }
  }

  return (
    <div className={cn("flex flex-col h-screen border-r bg-gray-50/40", className)}>
      <div className="flex-1 space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            HealthyDB
          </h2>
          <div className="space-y-1">
            {items.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="sticky bottom-0 p-4 border-t bg-gray-50/40">
        <div className="flex flex-col gap-2">
          <p className="px-2 text-sm text-muted-foreground truncate">
            {user?.email}
          </p>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}
