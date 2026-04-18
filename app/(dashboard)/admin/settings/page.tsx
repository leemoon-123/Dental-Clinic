"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { 
  Settings, 
  Building2, 
  Clock, 
  Mail, 
  Phone,
  MapPin,
  Bell,
  Shield
} from "lucide-react"
import { toast } from "sonner"

export default function AdminSettingsPage() {
  const [clinicSettings, setClinicSettings] = useState({
    name: "DentaCare",
    address: "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
    phone: "1900-xxxx",
    email: "contact@dentacare.vn",
    workingHours: "08:00 - 20:00",
    workingDays: "Thứ 2 - Thứ 7",
    description: "Phòng khám nha khoa chất lượng cao với đội ngũ bác sĩ chuyên nghiệp.",
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    marketingEmails: false,
  })

  const handleSaveClinicSettings = () => {
    toast.success("Đã lưu cài đặt phòng khám")
  }

  const handleSaveNotifications = () => {
    toast.success("Đã lưu cài đặt thông báo")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Cài đặt hệ thống</h1>
        <p className="text-muted-foreground">Quản lý các cài đặt chung của phòng khám</p>
      </div>

      {/* Clinic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Thông tin phòng khám
          </CardTitle>
          <CardDescription>
            Cập nhật thông tin hiển thị trên trang web
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Tên phòng khám</Label>
              <Input
                id="name"
                value={clinicSettings.name}
                onChange={(e) => setClinicSettings({ ...clinicSettings, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Số điện thoại
              </Label>
              <Input
                id="phone"
                value={clinicSettings.phone}
                onChange={(e) => setClinicSettings({ ...clinicSettings, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={clinicSettings.email}
                onChange={(e) => setClinicSettings({ ...clinicSettings, email: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Địa chỉ
              </Label>
              <Input
                id="address"
                value={clinicSettings.address}
                onChange={(e) => setClinicSettings({ ...clinicSettings, address: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="workingHours" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Giờ làm việc
              </Label>
              <Input
                id="workingHours"
                value={clinicSettings.workingHours}
                onChange={(e) => setClinicSettings({ ...clinicSettings, workingHours: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="workingDays">Ngày làm việc</Label>
              <Input
                id="workingDays"
                value={clinicSettings.workingDays}
                onChange={(e) => setClinicSettings({ ...clinicSettings, workingDays: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={clinicSettings.description}
              onChange={(e) => setClinicSettings({ ...clinicSettings, description: e.target.value })}
              rows={3}
            />
          </div>

          <Button onClick={handleSaveClinicSettings}>Lưu thay đổi</Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Cài đặt thông báo
          </CardTitle>
          <CardDescription>
            Quản lý cách gửi thông báo đến người dùng
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Thông báo qua Email</Label>
              <p className="text-sm text-muted-foreground">
                Gửi email xác nhận khi đặt lịch hẹn
              </p>
            </div>
            <Switch
              checked={notifications.emailNotifications}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, emailNotifications: checked })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Thông báo qua SMS</Label>
              <p className="text-sm text-muted-foreground">
                Gửi tin nhắn SMS nhắc nhở lịch hẹn
              </p>
            </div>
            <Switch
              checked={notifications.smsNotifications}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, smsNotifications: checked })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Nhắc nhở lịch hẹn</Label>
              <p className="text-sm text-muted-foreground">
                Tự động gửi nhắc nhở trước lịch hẹn 24 giờ
              </p>
            </div>
            <Switch
              checked={notifications.appointmentReminders}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, appointmentReminders: checked })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Marketing</Label>
              <p className="text-sm text-muted-foreground">
                Gửi email khuyến mãi và thông tin mới
              </p>
            </div>
            <Switch
              checked={notifications.marketingEmails}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, marketingEmails: checked })
              }
            />
          </div>
          <Button onClick={handleSaveNotifications}>Lưu cài đặt</Button>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Bảo mật
          </CardTitle>
          <CardDescription>
            Cài đặt bảo mật cho hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Đổi mật khẩu Admin</p>
                <p className="text-sm text-muted-foreground">
                  Cập nhật mật khẩu đăng nhập của bạn
                </p>
              </div>
              <Button variant="outline">Đổi mật khẩu</Button>
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Xác thực 2 yếu tố</p>
                <p className="text-sm text-muted-foreground">
                  Bảo vệ tài khoản với xác thực 2 yếu tố
                </p>
              </div>
              <Button variant="outline">Thiết lập</Button>
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Nhật ký hoạt động</p>
                <p className="text-sm text-muted-foreground">
                  Xem lịch sử đăng nhập và hoạt động
                </p>
              </div>
              <Button variant="outline">Xem nhật ký</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
