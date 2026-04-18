import { ObjectId } from "mongodb";

export interface Service {
  _id?: ObjectId;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  image?: string;
  category: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Doctor {
  _id?: ObjectId;
  userId: ObjectId;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  experience: number;
  rating: number;
  avatar?: string;
  bio?: string;
  education?: string[];
  certifications?: string[];
  workingHours: {
    day: string;
    start: string;
    end: string;
  }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Patient {
  _id?: ObjectId;
  userId: ObjectId;
  name: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  medicalHistory?: string[];
  allergies?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  _id?: ObjectId;
  patientId: ObjectId;
  patientName: string;
  patientPhone: string;
  doctorId: ObjectId;
  doctorName: string;
  serviceId: ObjectId;
  serviceName: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  result?: {
    diagnosis: string;
    treatment: string;
    prescription?: string;
    nextAppointment?: string;
    notes?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicalRecord {
  _id?: ObjectId;
  patientId: ObjectId;
  appointmentId: ObjectId;
  doctorId: ObjectId;
  doctorName: string;
  date: string;
  diagnosis: string;
  treatment: string;
  prescription?: string;
  notes?: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface KnowledgeBase {
  _id?: ObjectId;
  title: string;
  content: string;
  category: string;
  keywords: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  _id?: ObjectId;
  sessionId: string;
  patientId?: ObjectId;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}
