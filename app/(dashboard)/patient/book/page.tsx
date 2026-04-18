"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Calendar, Clock, User, Loader2, CheckCircle } from "lucide-react";
import axios from "axios";

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}

interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  rating: number;
  avatar?: string;
}

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "13:30", "14:00", "14:30", "15:00",
  "15:30", "16:00", "16:30", "17:00", "17:30", "18:00",
];

export default function BookAppointmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [formData, setFormData] = useState({
    serviceId: "",
    doctorId: "",
    date: "",
    time: "",
    notes: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [servicesRes, doctorsRes] = await Promise.all([
          axios.get("/api/services"),
          axios.get("/api/doctors"),
        ]);
        setServices(servicesRes.data.services);
        setDoctors(doctorsRes.data.doctors);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Khong the tai du lieu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!formData.serviceId || !formData.doctorId || !formData.date || !formData.time) {
      toast.error("Vui long chon day du thong tin");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post("/api/appointments", formData);
      toast.success("Dat lich hen thanh cong!");
      router.push("/patient/appointments");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Dat lich that bai";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedService = services.find((s) => s._id === formData.serviceId);
  const selectedDoctor = doctors.find((d) => d._id === formData.doctorId);

  // Get min date (today)
  const today = new Date();
  const minDate = today.toISOString().split("T")[0];

  // Get max date (30 days from now)
  const maxDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

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
        <h1 className="text-2xl font-bold">Dat lich hen</h1>
        <p className="text-muted-foreground">
          Chon dich vu, bac si va thoi gian phu hop
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                step >= s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step > s ? <CheckCircle className="h-4 w-4" /> : s}
            </div>
            {s < 4 && (
              <div
                className={`h-1 w-12 ${
                  step > s ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Choose Service */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Chon dich vu</CardTitle>
            <CardDescription>Chon dich vu ban muon su dung</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={formData.serviceId}
              onValueChange={(value) =>
                setFormData({ ...formData, serviceId: value })
              }
              className="grid gap-4 sm:grid-cols-2"
            >
              {services.map((service) => (
                <div key={service._id}>
                  <RadioGroupItem
                    value={service._id}
                    id={service._id}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={service._id}
                    className="flex flex-col items-start gap-2 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer"
                  >
                    <span className="font-semibold">{service.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {service.description}
                    </span>
                    <span className="text-sm font-medium text-primary">
                      {service.price.toLocaleString()}d - {service.duration} phut
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {services.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Chua co dich vu nao. Vui long quay lai sau.
              </p>
            )}
            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => setStep(2)}
                disabled={!formData.serviceId}
              >
                Tiep tuc
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Choose Doctor */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Chon bac si</CardTitle>
            <CardDescription>Chon bac si ban muon kham</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={formData.doctorId}
              onValueChange={(value) =>
                setFormData({ ...formData, doctorId: value })
              }
              className="grid gap-4 sm:grid-cols-2"
            >
              {doctors.map((doctor) => (
                <div key={doctor._id}>
                  <RadioGroupItem
                    value={doctor._id}
                    id={doctor._id}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={doctor._id}
                    className="flex items-center gap-4 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer"
                  >
                    <img
                      src={doctor.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor._id}`}
                      alt={doctor.name}
                      className="h-12 w-12 rounded-full bg-muted"
                    />
                    <div>
                      <span className="font-semibold block">{doctor.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {doctor.specialty}
                      </span>
                      <div className="text-sm text-yellow-500">
                        {"★".repeat(Math.floor(doctor.rating))} {doctor.rating}
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {doctors.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Chua co bac si nao. Vui long quay lai sau.
              </p>
            )}
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Quay lai
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!formData.doctorId}
              >
                Tiep tuc
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Choose Date & Time */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Chon ngay va gio</CardTitle>
            <CardDescription>Chon thoi gian phu hop</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Chon ngay</Label>
                <input
                  type="date"
                  min={minDate}
                  max={maxDate}
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label>Chon gio</Label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      type="button"
                      variant={formData.time === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFormData({ ...formData, time })}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 space-y-2">
              <Label>Ghi chu (tuy chon)</Label>
              <Textarea
                placeholder="Mo ta trieu chung hoac yeu cau dac biet..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Quay lai
              </Button>
              <Button
                onClick={() => setStep(4)}
                disabled={!formData.date || !formData.time}
              >
                Tiep tuc
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Xac nhan thong tin</CardTitle>
            <CardDescription>Kiem tra lai thong tin truoc khi dat lich</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-lg border p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dich vu</p>
                  <p className="font-medium">{selectedService?.name}</p>
                  <p className="text-sm text-primary">
                    {selectedService?.price.toLocaleString()}d
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-lg border p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bac si</p>
                  <p className="font-medium">{selectedDoctor?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedDoctor?.specialty}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-lg border p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ngay kham</p>
                  <p className="font-medium">{formData.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-lg border p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gio kham</p>
                  <p className="font-medium">{formData.time}</p>
                </div>
              </div>

              {formData.notes && (
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Ghi chu</p>
                  <p className="font-medium">{formData.notes}</p>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setStep(3)}>
                Quay lai
              </Button>
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Dang xu ly...
                  </>
                ) : (
                  "Xac nhan dat lich"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
