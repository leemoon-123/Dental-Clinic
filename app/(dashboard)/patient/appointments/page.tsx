"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Calendar, Clock, User, X, Loader2, Plus } from "lucide-react";
import axios from "axios";

interface Appointment {
  _id: string;
  doctorName: string;
  serviceName: string;
  date: string;
  time: string;
  status: string;
  notes?: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchAppointments = async () => {
    try {
      const params = filter !== "all" ? `?status=${filter}` : "";
      const response = await axios.get(`/api/appointments${params}`);
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
  }, [filter]);

  const handleCancel = async (id: string) => {
    try {
      await axios.delete(`/api/appointments?id=${id}`);
      toast.success("Da huy lich hen");
      fetchAppointments();
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
      toast.error("Khong the huy lich hen");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Cho xac nhan</Badge>;
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
          <h1 className="text-2xl font-bold">Lich hen cua toi</h1>
          <p className="text-muted-foreground">Quan ly cac lich hen cua ban</p>
        </div>
        <div className="flex gap-3">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Trang thai" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tat ca</SelectItem>
              <SelectItem value="pending">Cho xac nhan</SelectItem>
              <SelectItem value="confirmed">Da xac nhan</SelectItem>
              <SelectItem value="completed">Hoan thanh</SelectItem>
              <SelectItem value="cancelled">Da huy</SelectItem>
            </SelectContent>
          </Select>
          <Button asChild>
            <Link href="/patient/book">
              <Plus className="mr-2 h-4 w-4" />
              Dat lich moi
            </Link>
          </Button>
        </div>
      </div>

      {appointments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Chua co lich hen nao</p>
            <p className="text-muted-foreground mb-4">
              Dat lich hen de bat dau cham soc suc khoe rang mieng
            </p>
            <Button asChild>
              <Link href="/patient/book">Dat lich ngay</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {appointments.map((appointment) => (
            <Card key={appointment._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{appointment.serviceName}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {appointment.doctorName}
                    </CardDescription>
                  </div>
                  {getStatusBadge(appointment.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm">
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
                  <p className="mt-3 text-sm text-muted-foreground">
                    Ghi chu: {appointment.notes}
                  </p>
                )}
                {(appointment.status === "pending" || appointment.status === "confirmed") && (
                  <div className="mt-4 flex gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                          <X className="mr-2 h-4 w-4" />
                          Huy lich
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Xac nhan huy lich hen</AlertDialogTitle>
                          <AlertDialogDescription>
                            Ban co chac chan muon huy lich hen nay khong? Hanh dong nay khong the hoan tac.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Khong</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleCancel(appointment._id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Xac nhan huy
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
