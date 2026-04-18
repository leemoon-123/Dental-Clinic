"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, Filter, CheckCircle, XCircle, Eye, Calendar } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"

interface Appointment {
  _id: string
  patientId: string
  patientName: string
  patientPhone: string
  doctorId: string
  doctorName: string
  serviceId: string
  serviceName: string
  date: string
  time: string
  status: string
  notes?: string
  createdAt: string
}

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)

  useEffect(() => {
    fetchAppointments()
  }, [statusFilter])

  const fetchAppointments = async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter !== "all") params.append("status", statusFilter)
      const res = await axios.get(`/api/appointments?${params.toString()}`)
      setAppointments(res.data.appointments || [])
    } catch (error) {
      console.error("Error fetching appointments:", error)
      toast.error("Lỗi khi tải danh sách lịch hẹn")
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      await axios.put("/api/appointments", { id, status })
      toast.success(`Đã cập nhật trạng thái thành "${getStatusLabel(status)}"`)
      fetchAppointments()
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Lỗi khi cập nhật trạng thái")
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Chờ xác nhận",
      confirmed: "Đã xác nhận",
      completed: "Hoàn thành",
      cancelled: "Đã hủy",
    }
    return labels[status] || status
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pending: { variant: "secondary" },
      confirmed: { variant: "default" },
      completed: { variant: "outline" },
      cancelled: { variant: "destructive" },
    }
    return (
      <Badge variant={config[status]?.variant || "secondary"}>
        {getStatusLabel(status)}
      </Badge>
    )
  }

  const filteredAppointments = appointments.filter((apt) => {
    const matchSearch =
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.patientPhone.includes(searchTerm)
    return matchSearch
  })

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Quản lý lịch hẹn</h1>
        <p className="text-muted-foreground">Xem và quản lý tất cả lịch hẹn trong hệ thống</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Danh sách lịch hẹn
          </CardTitle>
          <CardDescription>
            Tổng cộng {filteredAppointments.length} lịch hẹn
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, SĐT, dịch vụ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Lọc trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="pending">Chờ xác nhận</SelectItem>
                <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bệnh nhân</TableHead>
                  <TableHead>Bác sĩ</TableHead>
                  <TableHead>Dịch vụ</TableHead>
                  <TableHead>Ngày giờ</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Không tìm thấy lịch hẹn nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAppointments.map((apt) => (
                    <TableRow key={apt._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{apt.patientName}</p>
                          <p className="text-sm text-muted-foreground">{apt.patientPhone}</p>
                        </div>
                      </TableCell>
                      <TableCell>BS. {apt.doctorName}</TableCell>
                      <TableCell>{apt.serviceName}</TableCell>
                      <TableCell>
                        <div>
                          <p>{new Date(apt.date).toLocaleDateString("vi-VN")}</p>
                          <p className="text-sm text-muted-foreground">{apt.time}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(apt.status)}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedAppointment(apt)
                              setShowDetailDialog(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {apt.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-green-600 hover:text-green-700"
                                onClick={() => updateStatus(apt._id, "confirmed")}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => updateStatus(apt._id, "cancelled")}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {apt.status === "confirmed" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-blue-600 hover:text-blue-700"
                              onClick={() => updateStatus(apt._id, "completed")}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chi tiết lịch hẹn</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về lịch hẹn
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Bệnh nhân</p>
                  <p className="font-medium">{selectedAppointment.patientName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Số điện thoại</p>
                  <p className="font-medium">{selectedAppointment.patientPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bác sĩ</p>
                  <p className="font-medium">BS. {selectedAppointment.doctorName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dịch vụ</p>
                  <p className="font-medium">{selectedAppointment.serviceName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ngày khám</p>
                  <p className="font-medium">
                    {new Date(selectedAppointment.date).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Giờ khám</p>
                  <p className="font-medium">{selectedAppointment.time}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Trạng thái</p>
                  {getStatusBadge(selectedAppointment.status)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ngày đặt</p>
                  <p className="font-medium">
                    {new Date(selectedAppointment.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
              {selectedAppointment.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Ghi chú</p>
                  <p className="font-medium">{selectedAppointment.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
