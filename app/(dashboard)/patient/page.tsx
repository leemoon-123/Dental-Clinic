"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  ArrowRight,
  Loader2,
} from "lucide-react";
import axios from "axios";

interface Stats {
  totalAppointments: number;
  upcomingAppointments: number;
  completedAppointments: number;
  recentAppointments: Array<{
    _id: string;
    doctorName: string;
    serviceName: string;
    date: string;
    time: string;
    status: string;
  }>;
}

export default function PatientDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("/api/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Xin chao, {user?.name}!
        </h1>
        <p className="text-muted-foreground">
          Chao mung ban quay tro lai. Day la tong quan ve lich hen cua ban.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tong lich hen
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalAppointments || 0}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sap toi
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {stats?.upcomingAppointments || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Hoan thanh
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats?.completedAppointments || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow bg-primary text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              Dat lich moi
            </CardTitle>
            <Calendar className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              asChild
            >
              <Link href="/patient/book">
                Dat ngay
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Appointments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lich hen gan day</CardTitle>
                <CardDescription>Cac lich hen cua ban</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/patient/appointments">Xem tat ca</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {stats?.recentAppointments && stats.recentAppointments.length > 0 ? (
              <div className="space-y-4">
                {stats.recentAppointments.slice(0, 5).map((appointment) => (
                  <div
                    key={appointment._id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{appointment.serviceName}</p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.doctorName} - {appointment.date} luc {appointment.time}
                      </p>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">Chua co lich hen nao</p>
                <Button className="mt-4" asChild>
                  <Link href="/patient/book">Dat lich ngay</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Truy cap nhanh</CardTitle>
            <CardDescription>Cac tinh nang thuong dung</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/patient/book"
              className="flex items-center gap-3 rounded-lg border p-4 hover:bg-muted transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Dat lich hen</p>
                <p className="text-sm text-muted-foreground">
                  Chon dich vu va bac si phu hop
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </Link>

            <Link
              href="/patient/history"
              className="flex items-center gap-3 rounded-lg border p-4 hover:bg-muted transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Lich su kham</p>
                <p className="text-sm text-muted-foreground">
                  Xem ket qua kham va don thuoc
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </Link>

            <Link
              href="/patient/chat"
              className="flex items-center gap-3 rounded-lg border p-4 hover:bg-muted transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Tu van truc tuyen</p>
                <p className="text-sm text-muted-foreground">
                  Hoi dap voi tro ly ao
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
