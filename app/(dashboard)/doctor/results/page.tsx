"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Calendar, Clock, User, FileText, Loader2, CheckCircle } from "lucide-react";
import axios from "axios";

interface Appointment {
  _id: string;
  patientId: string;
  patientName: string;
  serviceName: string;
  date: string;
  time: string;
  status: string;
  notes?: string;
  result?: {
    diagnosis: string;
    treatment: string;
    prescription?: string;
    notes?: string;
  };
}

export default function DoctorResultsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [resultForm, setResultForm] = useState({
    diagnosis: "",
    treatment: "",
    prescription: "",
    notes: "",
  });

  const fetchAppointments = async () => {
    try {
      const response = await axios.get("/api/appointments?status=confirmed");
      setAppointments(response.data.appointments);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleSelectAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    if (appointment.result) {
      setResultForm({
        diagnosis: appointment.result.diagnosis || "",
        treatment: appointment.result.treatment || "",
        prescription: appointment.result.prescription || "",
        notes: appointment.result.notes || "",
      });
    } else {
      setResultForm({
        diagnosis: "",
        treatment: "",
        prescription: "",
        notes: "",
      });
    }
  };

  const handleSubmitResult = async () => {
    if (!selectedAppointment) return;

    if (!resultForm.diagnosis || !resultForm.treatment) {
      toast.error("Vui long nhap chan doan va phuong phap dieu tri");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post("/api/medical-records", {
        patientId: selectedAppointment.patientId,
        appointmentId: selectedAppointment._id,
        ...resultForm,
      });
      toast.success("Luu ket qua kham thanh cong!");
      setSelectedAppointment(null);
      fetchAppointments();
    } catch (error) {
      console.error("Failed to save result:", error);
      toast.error("Luu ket qua that bai");
    } finally {
      setSubmitting(false);
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
      <div>
        <h1 className="text-2xl font-bold">Cap nhat ket qua kham</h1>
        <p className="text-muted-foreground">
          Nhap ket qua kham benh va don thuoc cho benh nhan
        </p>
      </div>

      {appointments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Khong co lich hen can xu ly</p>
            <p className="text-muted-foreground">
              Cac lich hen da xac nhan se xuat hien o day
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
                    <CardDescription>{appointment.serviceName}</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Da xac nhan
                  </Badge>
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
                    Ghi chu benh nhan: {appointment.notes}
                  </p>
                )}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={() => handleSelectAppointment(appointment)}>
                      <FileText className="mr-2 h-4 w-4" />
                      Nhap ket qua
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Ket qua kham benh</DialogTitle>
                      <DialogDescription>
                        Nhap ket qua kham cho benh nhan {selectedAppointment?.patientName}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="diagnosis">Chan doan *</Label>
                        <Input
                          id="diagnosis"
                          value={resultForm.diagnosis}
                          onChange={(e) =>
                            setResultForm({ ...resultForm, diagnosis: e.target.value })
                          }
                          placeholder="Nhap chan doan benh"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="treatment">Phuong phap dieu tri *</Label>
                        <Textarea
                          id="treatment"
                          value={resultForm.treatment}
                          onChange={(e) =>
                            setResultForm({ ...resultForm, treatment: e.target.value })
                          }
                          placeholder="Mo ta phuong phap dieu tri"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="prescription">Don thuoc</Label>
                        <Textarea
                          id="prescription"
                          value={resultForm.prescription}
                          onChange={(e) =>
                            setResultForm({ ...resultForm, prescription: e.target.value })
                          }
                          placeholder="Ke don thuoc (ten thuoc, lieu luong, cach dung)"
                          rows={4}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Ghi chu them</Label>
                        <Textarea
                          id="notes"
                          value={resultForm.notes}
                          onChange={(e) =>
                            setResultForm({ ...resultForm, notes: e.target.value })
                          }
                          placeholder="Ghi chu hoac loi dan cho benh nhan"
                          rows={2}
                        />
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button
                          onClick={handleSubmitResult}
                          disabled={submitting}
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Dang luu...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Luu ket qua
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
