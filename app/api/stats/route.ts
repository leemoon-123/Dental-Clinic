import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDatabase();

    if (session.role === "admin") {
      // Admin stats
      const [
        totalPatients,
        totalDoctors,
        totalAppointments,
        pendingAppointments,
        completedAppointments,
        totalServices,
        recentAppointments,
        monthlyStats,
      ] = await Promise.all([
        db.collection("patients").countDocuments(),
        db.collection("doctors").countDocuments({ isActive: true }),
        db.collection("appointments").countDocuments(),
        db.collection("appointments").countDocuments({ status: "pending" }),
        db.collection("appointments").countDocuments({ status: "completed" }),
        db.collection("services").countDocuments({ isActive: true }),
        db
          .collection("appointments")
          .find()
          .sort({ createdAt: -1 })
          .limit(10)
          .toArray(),
        getMonthlyStats(db),
      ]);

      return NextResponse.json({
        totalPatients,
        totalDoctors,
        totalAppointments,
        pendingAppointments,
        completedAppointments,
        totalServices,
        recentAppointments,
        monthlyStats,
      });
    } else if (session.role === "doctor") {
      // Doctor stats
      const doctor = await db
        .collection("doctors")
        .findOne({ userId: new ObjectId(session.userId) });

      if (!doctor) {
        return NextResponse.json(
          { error: "Doctor not found" },
          { status: 404 }
        );
      }

      const [
        totalPatients,
        totalAppointments,
        pendingAppointments,
        completedAppointments,
        todayAppointments,
        recentAppointments,
      ] = await Promise.all([
        db.collection("appointments").distinct("patientId", {
          doctorId: doctor._id,
        }),
        db.collection("appointments").countDocuments({ doctorId: doctor._id }),
        db.collection("appointments").countDocuments({
          doctorId: doctor._id,
          status: "pending",
        }),
        db.collection("appointments").countDocuments({
          doctorId: doctor._id,
          status: "completed",
        }),
        db.collection("appointments").countDocuments({
          doctorId: doctor._id,
          date: new Date().toISOString().split("T")[0],
        }),
        db
          .collection("appointments")
          .find({ doctorId: doctor._id })
          .sort({ createdAt: -1 })
          .limit(10)
          .toArray(),
      ]);

      return NextResponse.json({
        totalPatients: totalPatients.length,
        totalAppointments,
        pendingAppointments,
        completedAppointments,
        todayAppointments,
        recentAppointments,
      });
    } else {
      // Patient stats
      const patient = await db
        .collection("patients")
        .findOne({ userId: new ObjectId(session.userId) });

      if (!patient) {
        return NextResponse.json({
          totalAppointments: 0,
          upcomingAppointments: 0,
          completedAppointments: 0,
          recentAppointments: [],
        });
      }

      const [
        totalAppointments,
        upcomingAppointments,
        completedAppointments,
        recentAppointments,
      ] = await Promise.all([
        db.collection("appointments").countDocuments({
          patientId: patient._id,
        }),
        db.collection("appointments").countDocuments({
          patientId: patient._id,
          status: { $in: ["pending", "confirmed"] },
          date: { $gte: new Date().toISOString().split("T")[0] },
        }),
        db.collection("appointments").countDocuments({
          patientId: patient._id,
          status: "completed",
        }),
        db
          .collection("appointments")
          .find({ patientId: patient._id })
          .sort({ createdAt: -1 })
          .limit(5)
          .toArray(),
      ]);

      return NextResponse.json({
        totalAppointments,
        upcomingAppointments,
        completedAppointments,
        recentAppointments,
      });
    }
  } catch (error) {
    console.error("Get stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function getMonthlyStats(db: ReturnType<typeof db.collection> extends (...args: unknown[]) => infer R ? { collection: (...args: unknown[]) => R } : never) {
  const months = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

    const count = await db.collection("appointments").countDocuments({
      createdAt: {
        $gte: date,
        $lt: nextMonth,
      },
    });

    months.push({
      month: date.toLocaleString("vi-VN", { month: "short" }),
      appointments: count,
    });
  }

  return months;
}
