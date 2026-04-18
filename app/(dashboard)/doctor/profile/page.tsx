"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { User, Mail, Phone, Stethoscope, Award, Loader2 } from "lucide-react";
import axios from "axios";

interface DoctorProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  experience: number;
  rating: number;
  bio?: string;
  avatar?: string;
}

export default function DoctorProfilePage() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    specialty: "",
    experience: 0,
    bio: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/doctors");
        const doctors = response.data.doctors;
        if (doctors.length > 0) {
          const doctorProfile = doctors.find(
            (d: DoctorProfile) => d.email === user?.email
          );
          if (doctorProfile) {
            setProfile(doctorProfile);
            setFormData({
              name: doctorProfile.name || "",
              phone: doctorProfile.phone || "",
              specialty: doctorProfile.specialty || "",
              experience: doctorProfile.experience || 0,
              bio: doctorProfile.bio || "",
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.put("/api/doctors", {
        _id: profile?._id,
        ...formData,
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
        <h1 className="text-2xl font-bold">Ho so bac si</h1>
        <p className="text-muted-foreground">
          Quan ly thong tin ca nhan va chuyen mon
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <img
                src={profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                alt={user?.name || "Doctor"}
                className="h-24 w-24 rounded-full bg-muted mx-auto"
              />
            </div>
            <CardTitle>BS. {user?.name}</CardTitle>
            <CardDescription>{profile?.specialty}</CardDescription>
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
              <div className="flex items-center gap-3">
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
                <span>{formData.specialty || "Chua cap nhat"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span>{formData.experience} nam kinh nghiem</span>
              </div>
            </div>
            {profile && (
              <div className="mt-4 pt-4 border-t text-center">
                <div className="text-2xl font-bold text-yellow-500">
                  {"★".repeat(Math.floor(profile.rating))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Danh gia: {profile.rating}/5
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Chinh sua thong tin</CardTitle>
            <CardDescription>
              Cap nhat thong tin ca nhan va chuyen mon
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
                  <Label htmlFor="specialty">Chuyen khoa</Label>
                  <Input
                    id="specialty"
                    value={formData.specialty}
                    onChange={(e) =>
                      setFormData({ ...formData, specialty: e.target.value })
                    }
                    placeholder="Nha khoa tong quat"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Kinh nghiem (nam)</Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        experience: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Gioi thieu ban than</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  placeholder="Mo ta ve kinh nghiem va chuyen mon cua ban..."
                  rows={4}
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
