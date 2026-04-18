"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Plus, Pencil, Trash2, Stethoscope } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"

interface Doctor {
  _id: string
  name: string
  email: string
  phone: string
  specialization: string
  experience: number
  bio?: string
  isActive: boolean
  createdAt: string
}

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    specialization: "",
    experience: 0,
    bio: "",
  })

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("/api/doctors")
      setDoctors(res.data.doctors || [])
    } catch (error) {
      console.error("Error fetching doctors:", error)
      toast.error("Lỗi khi tải danh sách bác sĩ")
    } finally {
      setLoading(false)
    }
  }

  const handleAddDoctor = async () => {
    try {
      await axios.post("/api/doctors", formData)
      toast.success("Đã thêm bác sĩ mới")
      setShowAddDialog(false)
      resetForm()
      fetchDoctors()
    } catch (error) {
      console.error("Error adding doctor:", error)
      toast.error("Lỗi khi thêm bác sĩ")
    }
  }

  const handleEditDoctor = async () => {
    if (!selectedDoctor) return
    try {
      await axios.put("/api/doctors", {
        id: selectedDoctor._id,
        ...formData,
      })
      toast.success("Đã cập nhật thông tin bác sĩ")
      setShowEditDialog(false)
      resetForm()
      fetchDoctors()
    } catch (error) {
      console.error("Error updating doctor:", error)
      toast.error("Lỗi khi cập nhật bác sĩ")
    }
  }

  const handleDeleteDoctor = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa bác sĩ này?")) return
    try {
      await axios.delete(`/api/doctors?id=${id}`)
      toast.success("Đã xóa bác sĩ")
      fetchDoctors()
    } catch (error) {
      console.error("Error deleting doctor:", error)
      toast.error("Lỗi khi xóa bác sĩ")
    }
  }

  const toggleDoctorStatus = async (doctor: Doctor) => {
    try {
      await axios.put("/api/doctors", {
        id: doctor._id,
        isActive: !doctor.isActive,
      })
      toast.success(`Đã ${doctor.isActive ? "tắt" : "bật"} trạng thái bác sĩ`)
      fetchDoctors()
    } catch (error) {
      console.error("Error toggling status:", error)
      toast.error("Lỗi khi cập nhật trạng thái")
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      specialization: "",
      experience: 0,
      bio: "",
    })
    setSelectedDoctor(null)
  }

  const openEditDialog = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    setFormData({
      name: doctor.name,
      email: doctor.email,
      phone: doctor.phone,
      password: "",
      specialization: doctor.specialization,
      experience: doctor.experience,
      bio: doctor.bio || "",
    })
    setShowEditDialog(true)
  }

  const filteredDoctors = doctors.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý bác sĩ</h1>
          <p className="text-muted-foreground">Thêm, sửa, xóa thông tin bác sĩ trong hệ thống</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm bác sĩ
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Thêm bác sĩ mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin bác sĩ mới vào hệ thống
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Họ và tên</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="doctor@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0901234567"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Nhập mật khẩu"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="specialization">Chuyên khoa</Label>
                  <Input
                    id="specialization"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    placeholder="Nha khoa tổng quát"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="experience">Kinh nghiệm (năm)</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                    placeholder="5"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bio">Giới thiệu</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Mô tả ngắn về bác sĩ..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Hủy
              </Button>
              <Button onClick={handleAddDoctor}>Thêm bác sĩ</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Danh sách bác sĩ
          </CardTitle>
          <CardDescription>
            Tổng cộng {filteredDoctors.length} bác sĩ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm bác sĩ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bác sĩ</TableHead>
                  <TableHead>Chuyên khoa</TableHead>
                  <TableHead>Kinh nghiệm</TableHead>
                  <TableHead>Liên hệ</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDoctors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Không tìm thấy bác sĩ nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDoctors.map((doctor) => (
                    <TableRow key={doctor._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Stethoscope className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">BS. {doctor.name}</p>
                            <p className="text-sm text-muted-foreground">{doctor.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{doctor.specialization}</TableCell>
                      <TableCell>{doctor.experience} năm</TableCell>
                      <TableCell>{doctor.phone}</TableCell>
                      <TableCell>
                        <Badge
                          variant={doctor.isActive ? "default" : "secondary"}
                          className="cursor-pointer"
                          onClick={() => toggleDoctorStatus(doctor)}
                        >
                          {doctor.isActive ? "Hoạt động" : "Tạm nghỉ"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(doctor)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteDoctor(doctor._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa bác sĩ</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin bác sĩ
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Họ và tên</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Số điện thoại</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-specialization">Chuyên khoa</Label>
                <Input
                  id="edit-specialization"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-experience">Kinh nghiệm (năm)</Label>
                <Input
                  id="edit-experience"
                  type="number"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-bio">Giới thiệu</Label>
              <Textarea
                id="edit-bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleEditDoctor}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
