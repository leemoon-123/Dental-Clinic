"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Sidebar } from "@/components/layout/sidebar"
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Stethoscope, 
  Wrench,
  Database,
  BarChart3,
  Settings
} from "lucide-react"

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/appointments", label: "Quản lý lịch hẹn", icon: Calendar },
  { href: "/admin/doctors", label: "Quản lý bác sĩ", icon: Stethoscope },
  { href: "/admin/patients", label: "Quản lý bệnh nhân", icon: Users },
  { href: "/admin/services", label: "Quản lý dịch vụ", icon: Wrench },
  { href: "/admin/knowledge", label: "Knowledge Base", icon: Database },
  { href: "/admin/reports", label: "Báo cáo & Thống kê", icon: BarChart3 },
  { href: "/admin/settings", label: "Cài đặt", icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar items={adminNavItems} role="admin" />
      <main className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
