"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Calendar, Clock, User, CheckCircle, Loader2 } from "lucide-react";
import axios from "axios";

interface Appointment {
  _id: string;
  patientName: string;
  patientPhone: string;
  serviceName: string;
  date: string;
  time: string;
  status: string;
  notes?: string;
}

export default function DoctorSchedulePage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const fetchAppointments = async () => {
    try {
      let params = "";
      if (filter !== "all") params += `status=${filter}&`;
      if (dateFilter) params += `date=${dateFilter}`;
      const response = await axios.get(`/api/appointments?${params}`);
      setAppointments(response.data.appointments);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
      toast.error("Khong the tai du lieu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [filter, dateFilter]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await axios.put("/api/appointments", { _id: id, status: newStatus });
      toast.success("Cap nhat trang thai thanh cong");
      fetchAppointments();
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Cap nhat that bai");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Cho kham</Badge>;
      case "confirmed":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Da xac nhan</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Hoan thanh</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Da huy</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Lich kham</h1>
          <p className="text-muted-foreground">Quan ly lich kham benh cua ban</p>
        </div>
        <div className="flex gap-3">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Trang thai" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tat ca</SelectItem>
              <SelectItem value="pending">Cho kham</SelectItem>
              <SelectItem value="confirmed">Da xac nhan</SelectItem>
              <SelectItem value="completed">Hoan thanh</SelectItem>
              <SelectItem value="cancelled">Da huy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {appointments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Khong co lich kham</p>
            <p className="text-muted-foreground">
              Khong co cuoc hen nao phu hop voi bo loc
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {appointments.map((appointment) => (
            <Card key={appointment._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {appointment.patientName}
                    </CardTitle>
                    <CardDescription>
                      {appointment.serviceName} - SDT: {appointment.patientPhone}
                    </CardDescription>
                  </div>
                  {getStatusBadge(appointment.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{appointment.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{appointment.time}</span>
                  </div>
                </div>
                {appointment.notes && (
                  <p className="text-sm text-muted-foreground mb-4">
                    Ghi chu: {appointment.notes}
                  </p>
                )}
                {appointment.status !== "completed" && appointment.status !== "cancelled" && (
                  <div className="flex gap-2">
                    {appointment.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(appointment._id, "confirmed")}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Xac nhan
                      </Button>
                    )}
                    {appointment.status === "confirmed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(appointment._id, "completed")}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Hoan thanh
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
