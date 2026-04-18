"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { User, Mail, Phone, MapPin, Calendar, Loader2 } from "lucide-react";
import axios from "axios";

interface PatientProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  medicalHistory?: string[];
  allergies?: string[];
}

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    medicalHistory: "",
    allergies: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/patients");
        const patients = response.data.patients;
        if (patients.length > 0) {
          const patientProfile = patients[0];
          setProfile(patientProfile);
          setFormData({
            name: patientProfile.name || "",
            phone: patientProfile.phone || "",
            dateOfBirth: patientProfile.dateOfBirth || "",
            gender: patientProfile.gender || "",
            address: patientProfile.address || "",
            medicalHistory: patientProfile.medicalHistory?.join(", ") || "",
            allergies: patientProfile.allergies?.join(", ") || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.put("/api/patients", {
        _id: profile?._id,
        ...formData,
        medicalHistory: formData.medicalHistory
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        allergies: formData.allergies
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      toast.success("Cap nhat ho so thanh cong!");
      refreshUser();
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Cap nhat that bai");
    } finally {
      setSaving(false);
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
        <h1 className="text-2xl font-bold">Ho so ca nhan</h1>
        <p className="text-muted-foreground">
          Quan ly thong tin ca nhan va lich su y te
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                alt={user?.name || "User"}
                className="h-24 w-24 rounded-full bg-muted mx-auto"
              />
            </div>
            <CardTitle>{user?.name}</CardTitle>
            <CardDescription>{user?.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{formData.phone || "Chua cap nhat"}</span>
              </div>
              {formData.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{formData.address}</span>
                </div>
              )}
              {formData.dateOfBirth && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formData.dateOfBirth}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Chinh sua thong tin</CardTitle>
            <CardDescription>
              Cap nhat thong tin ca nhan va lich su y te
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Ho va ten</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Nguyen Van A"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">So dien thoai</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="0901234567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Ngay sinh</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      setFormData({ ...formData, dateOfBirth: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gioi tinh</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      setFormData({ ...formData, gender: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chon gioi tinh" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Nam</SelectItem>
                      <SelectItem value="female">Nu</SelectItem>
                      <SelectItem value="other">Khac</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Dia chi</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="123 Nguyen Hue, Quan 1, TP.HCM"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medicalHistory">Tien su benh (cach nhau bang dau phay)</Label>
                <Textarea
                  id="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={(e) =>
                    setFormData({ ...formData, medicalHistory: e.target.value })
                  }
                  placeholder="Vd: Tieu duong, Huyet ap cao"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="allergies">Di ung (cach nhau bang dau phay)</Label>
                <Textarea
                  id="allergies"
                  value={formData.allergies}
                  onChange={(e) =>
                    setFormData({ ...formData, allergies: e.target.value })
                  }
                  placeholder="Vd: Penicillin, Aspirin"
                  rows={2}
                />
              </div>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Dang luu...
                  </>
                ) : (
                  "Luu thay doi"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
