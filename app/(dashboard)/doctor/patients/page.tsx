"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Search, Phone, Mail, Calendar, FileText, Loader2 } from "lucide-react";
import axios from "axios";

interface Patient {
  _id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: string;
  medicalHistory?: string[];
  allergies?: string[];
}

interface MedicalRecord {
  _id: string;
  date: string;
  diagnosis: string;
  treatment: string;
  prescription?: string;
}

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientRecords, setPatientRecords] = useState<MedicalRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  const fetchPatients = async () => {
    try {
      const params = search ? `?search=${search}` : "";
      const response = await axios.get(`/api/patients${params}`);
      setPatients(response.data.patients);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [search]);

  const handleViewPatient = async (patient: Patient) => {
    setSelectedPatient(patient);
    setLoadingRecords(true);
    try {
      const response = await axios.get(`/api/medical-records?patientId=${patient._id}`);
      setPatientRecords(response.data.records);
    } catch (error) {
      console.error("Failed to fetch records:", error);
    } finally {
      setLoadingRecords(false);
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
          <h1 className="text-2xl font-bold">Benh nhan</h1>
          <p className="text-muted-foreground">Danh sach benh nhan cua ban</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tim kiem benh nhan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {patients.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Chua co benh nhan</p>
            <p className="text-muted-foreground">
              Benh nhan se xuat hien sau khi co lich hen
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {patients.map((patient) => (
            <Dialog key={patient._id}>
              <DialogTrigger asChild>
                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleViewPatient(patient)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{patient.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      {patient.phone}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {patient.email}
                    </div>
                    {patient.dateOfBirth && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                        <Calendar className="h-4 w-4" />
                        {patient.dateOfBirth}
                      </div>
                    )}
                    {patient.allergies && patient.allergies.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {patient.allergies.map((allergy, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{selectedPatient?.name}</DialogTitle>
                  <DialogDescription>
                    Thong tin chi tiet va lich su kham benh
                  </DialogDescription>
                </DialogHeader>
                {selectedPatient && (
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <p>{selectedPatient.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">So dien thoai</p>
                        <p>{selectedPatient.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Ngay sinh</p>
                        <p>{selectedPatient.dateOfBirth || "Chua cap nhat"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Gioi tinh</p>
                        <p>{selectedPatient.gender === "male" ? "Nam" : selectedPatient.gender === "female" ? "Nu" : "Chua cap nhat"}</p>
                      </div>
                    </div>

                    {selectedPatient.medicalHistory && selectedPatient.medicalHistory.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Tien su benh</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedPatient.medicalHistory.map((history, idx) => (
                            <Badge key={idx} variant="secondary">
                              {history}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedPatient.allergies && selectedPatient.allergies.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Di ung</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedPatient.allergies.map((allergy, idx) => (
                            <Badge key={idx} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              {allergy}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Lich su kham benh
                      </p>
                      {loadingRecords ? (
                        <div className="flex justify-center py-4">
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                      ) : patientRecords.length > 0 ? (
                        <ScrollArea className="h-48">
                          <div className="space-y-3">
                            {patientRecords.map((record) => (
                              <Card key={record._id}>
                                <CardContent className="p-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <p className="font-medium">{record.diagnosis}</p>
                                    <span className="text-xs text-muted-foreground">
                                      {record.date}
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Dieu tri: {record.treatment}
                                  </p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </ScrollArea>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Chua co lich su kham benh
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}
    </div>
  );
}
