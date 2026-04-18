"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Users, 
  Stethoscope, 
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import Link from "next/link"
import axios from "axios"

interface Stats {
  totalAppointments: number
  pendingAppointments: number
  completedAppointments: number
  cancelledAppointments: number
  totalPatients: number
  totalDoctors: number
  totalRevenue: number
  todayAppointments: number
  weeklyGrowth: number
  monthlyGrowth: number
}

interface RecentAppointment {
  _id: string
  patientName: string
  doctorName: string
  serviceName: string
  date: string
  time: string
  status: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentAppointments, setRecentAppointments] = useState<RecentAppointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, appointmentsRes] = await Promise.all([
          axios.get("/api/stats"),
          axios.get("/api/appointments?limit=5")
        ])
        setStats(statsRes.data)
        setRecentAppointments(appointmentsRes.data.appointments || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pending: { label: "Chờ xác nhận", variant: "secondary" },
      confirmed: { label: "Đã xác nhận", variant: "default" },
      completed: { label: "Hoàn thành", variant: "outline" },
      cancelled: { label: "Đã hủy", variant: "destructive" },
    }
    const config = statusConfig[status] || { label: status, variant: "secondary" }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const statCards = [
    {
      title: "Tổng lịch hẹn",
      value: stats?.totalAppointments || 0,
      icon: Calendar,
      description: "Tất cả lịch hẹn",
      trend: stats?.weeklyGrowth || 0,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Bệnh nhân",
      value: stats?.totalPatients || 0,
      icon: Users,
      description: "Tổng số bệnh nhân",
      trend: 12,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Bác sĩ",
      value: stats?.totalDoctors || 0,
      icon: Stethoscope,
      description: "Đang hoạt động",
      trend: 0,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Doanh thu",
      value: `${((stats?.totalRevenue || 0) / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      description: "Tháng này",
      trend: stats?.monthlyGrowth || 0,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Admin</h1>
          <p className="text-muted-foreground">Tổng quan hệ thống phòng khám nha khoa</p>
        </div>
        <Button asChild>
          <Link href="/admin/reports">
            <BarChart3 className="mr-2 h-4 w-4" />
            Xem báo cáo
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {stat.trend > 0 ? (
                  <>
                    <ArrowUpRight className="h-3 w-3 text-green-500" />
                    <span className="text-green-500">+{stat.trend}%</span>
                  </>
                ) : stat.trend < 0 ? (
                  <>
                    <ArrowDownRight className="h-3 w-3 text-red-500" />
                    <span className="text-red-500">{stat.trend}%</span>
                  </>
                ) : null}
                <span>{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Clock className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-base">Chờ xác nhận</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">
              {stats?.pendingAppointments || 0}
            </div>
            <p className="text-sm text-muted-foreground">lịch hẹn cần xử lý</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <CardTitle className="text-base">Hoàn thành</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {stats?.completedAppointments || 0}
            </div>
            <p className="text-sm text-muted-foreground">lịch hẹn thành công</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <CardTitle className="text-base">Đã hủy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {stats?.cancelledAppointments || 0}
            </div>
            <p className="text-sm text-muted-foreground">lịch hẹn bị hủy</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Appointments & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Lịch hẹn gần đây</CardTitle>
            <CardDescription>5 lịch hẹn mới nhất trong hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            {recentAppointments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Chưa có lịch hẹn nào
              </p>
            ) : (
              <div className="space-y-4">
                {recentAppointments.map((apt) => (
                  <div
                    key={apt._id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{apt.patientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {apt.serviceName} - BS. {apt.doctorName}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm font-medium">
                        {new Date(apt.date).toLocaleDateString("vi-VN")} - {apt.time}
                      </p>
                      {getStatusBadge(apt.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/admin/appointments">Xem tất cả lịch hẹn</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thao tác nhanh</CardTitle>
            <CardDescription>Các chức năng thường dùng</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/appointments">
                <Calendar className="mr-2 h-4 w-4" />
                Quản lý lịch hẹn
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/doctors">
                <Stethoscope className="mr-2 h-4 w-4" />
                Thêm bác sĩ mới
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/services">
                <TrendingUp className="mr-2 h-4 w-4" />
                Quản lý dịch vụ
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/knowledge">
                <Database className="mr-2 h-4 w-4" />
                Cập nhật Knowledge Base
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
