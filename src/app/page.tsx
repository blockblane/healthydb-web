import { AuthTabs } from "@/components/auth/auth-tabs"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <AuthTabs />
    </main>
  )
}