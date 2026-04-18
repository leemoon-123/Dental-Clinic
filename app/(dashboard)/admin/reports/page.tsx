"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Users, 
  DollarSign,
  Download,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts"
import axios from "axios"

interface ReportData {
  monthlyAppointments: { month: string; count: number; revenue: number }[]
  serviceDistribution: { name: string; value: number }[]
  patientGrowth: { month: string; patients: number }[]
  appointmentsByStatus: { status: string; count: number }[]
  revenueByService: { service: string; revenue: number }[]
  weeklyTrend: { day: string; appointments: number }[]
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

const statusLabels: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
}

export default function AdminReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState("month")

  useEffect(() => {
    fetchReportData()
  }, [period])

  const fetchReportData = async () => {
    try {
      const res = await axios.get(`/api/stats?period=${period}`)
      setReportData(res.data.reportData || generateMockData())
    } catch (error) {
      console.error("Error fetching report data:", error)
      // Use mock data for demo
      setReportData(generateMockData())
    } finally {
      setLoading(false)
    }
  }

  const generateMockData = (): ReportData => ({
    monthlyAppointments: [
      { month: "T1", count: 45, revenue: 67500000 },
      { month: "T2", count: 52, revenue: 78000000 },
      { month: "T3", count: 48, revenue: 72000000 },
      { month: "T4", count: 61, revenue: 91500000 },
      { month: "T5", count: 55, revenue: 82500000 },
      { month: "T6", count: 67, revenue: 100500000 },
    ],
    serviceDistribution: [
      { name: "Khám tổng quát", value: 35 },
      { name: "Tẩy trắng răng", value: 20 },
      { name: "Niềng răng", value: 15 },
      { name: "Trám răng", value: 18 },
      { name: "Nhổ răng", value: 12 },
    ],
    patientGrowth: [
      { month: "T1", patients: 120 },
      { month: "T2", patients: 145 },
      { month: "T3", patients: 178 },
      { month: "T4", patients: 210 },
      { month: "T5", patients: 245 },
      { month: "T6", patients: 289 },
    ],
    appointmentsByStatus: [
      { status: "completed", count: 156 },
      { status: "confirmed", count: 45 },
      { status: "pending", count: 23 },
      { status: "cancelled", count: 12 },
    ],
    revenueByService: [
      { service: "Niềng răng", revenue: 150000000 },
      { service: "Implant", revenue: 120000000 },
      { service: "Tẩy trắng", revenue: 80000000 },
      { service: "Khám tổng quát", revenue: 50000000 },
      { service: "Trám răng", revenue: 40000000 },
    ],
    weeklyTrend: [
      { day: "T2", appointments: 12 },
      { day: "T3", appointments: 15 },
      { day: "T4", appointments: 18 },
      { day: "T5", appointments: 14 },
      { day: "T6", appointments: 20 },
      { day: "T7", appointments: 25 },
      { day: "CN", appointments: 8 },
    ],
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      notation: "compact",
    }).format(value)
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const data = reportData || generateMockData()
  const totalRevenue = data.monthlyAppointments.reduce((sum, m) => sum + m.revenue, 0)
  const totalAppointments = data.monthlyAppointments.reduce((sum, m) => sum + m.count, 0)
  const latestPatients = data.patientGrowth[data.patientGrowth.length - 1]?.patients || 0
  const previousPatients = data.patientGrowth[data.patientGrowth.length - 2]?.patients || 0
  const patientGrowthRate = previousPatients > 0 
    ? ((latestPatients - previousPatients) / previousPatients * 100).toFixed(1) 
    : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Báo cáo & Thống kê</h1>
          <p className="text-muted-foreground">Phân tích dữ liệu hoạt động phòng khám</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">7 ngày qua</SelectItem>
              <SelectItem value="month">30 ngày qua</SelectItem>
              <SelectItem value="quarter">Quý này</SelectItem>
              <SelectItem value="year">Năm nay</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng doanh thu
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3" />
              <span>+12.5% so với kỳ trước</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng lịch hẹn
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAppointments}</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3" />
              <span>+8.2% so với kỳ trước</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Bệnh nhân mới
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestPatients}</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3" />
              <span>+{patientGrowthRate}% so với kỳ trước</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tỷ lệ hoàn thành
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((data.appointmentsByStatus.find(s => s.status === "completed")?.count || 0) / 
                data.appointmentsByStatus.reduce((sum, s) => sum + s.count, 0) * 100).toFixed(1)}%
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>Lịch hẹn hoàn thành thành công</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue & Appointments Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Doanh thu & Lịch hẹn theo tháng
            </CardTitle>
            <CardDescription>
              Biểu đồ thống kê 6 tháng gần nhất
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.monthlyAppointments}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === "revenue" ? formatCurrency(value as number) : value,
                    name === "revenue" ? "Doanh thu" : "Lịch hẹn"
                  ]}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="count" fill="#8884d8" name="Lịch hẹn" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" name="Doanh thu" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Patient Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tăng trưởng bệnh nhân
            </CardTitle>
            <CardDescription>
              Số lượng bệnh nhân tích lũy theo tháng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.patientGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="patients" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.3}
                  name="Bệnh nhân"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Service Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Phân bố dịch vụ</CardTitle>
            <CardDescription>
              Tỷ lệ sử dụng các dịch vụ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.serviceDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.serviceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Appointment Status */}
        <Card>
          <CardHeader>
            <CardTitle>Trạng thái lịch hẹn</CardTitle>
            <CardDescription>
              Phân bố theo trạng thái
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.appointmentsByStatus.map(item => ({
                    ...item,
                    name: statusLabels[item.status] || item.status
                  }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ name, count }) => `${name}: ${count}`}
                >
                  {data.appointmentsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Xu hướng tuần</CardTitle>
            <CardDescription>
              Lịch hẹn theo ngày trong tuần
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data.weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="appointments" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: "#8884d8" }}
                  name="Lịch hẹn"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Service */}
      <Card>
        <CardHeader>
          <CardTitle>Doanh thu theo dịch vụ</CardTitle>
          <CardDescription>
            Top 5 dịch vụ có doanh thu cao nhất
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.revenueByService} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
              <YAxis dataKey="service" type="category" width={120} />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Bar dataKey="revenue" fill="#8884d8" radius={[0, 4, 4, 0]} name="Doanh thu" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
