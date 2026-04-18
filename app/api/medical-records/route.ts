import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patientId");

    const db = await getDatabase();
    const query: Record<string, unknown> = {};

    if (session.role === "patient") {
      const patient = await db
        .collection("patients")
        .findOne({ userId: new ObjectId(session.userId) });
      if (patient) {
        query.patientId = patient._id;
      }
    } else if (patientId) {
      query.patientId = new ObjectId(patientId);
    }

    const records = await db
      .collection("medical_records")
      .find(query)
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json({ records });
  } catch (error) {
    console.error("Get medical records error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role === "patient") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      patientId,
      appointmentId,
      diagnosis,
      treatment,
      prescription,
      notes,
    } = body;

    if (!patientId || !appointmentId || !diagnosis || !treatment) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Get doctor info
    const doctor = await db
      .collection("doctors")
      .findOne({ userId: new ObjectId(session.userId) });

    const record = {
      patientId: new ObjectId(patientId),
      appointmentId: new ObjectId(appointmentId),
      doctorId: doctor?._id,
      doctorName: doctor?.name || session.name,
      date: new Date().toISOString().split("T")[0],
      diagnosis,
      treatment,
      prescription: prescription || "",
      notes: notes || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("medical_records").insertOne(record);

    // Update appointment with result
    await db.collection("appointments").updateOne(
      { _id: new ObjectId(appointmentId) },
      {
        $set: {
          status: "completed",
          result: {
            diagnosis,
            treatment,
            prescription,
            notes,
          },
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      recordId: result.insertedId.toString(),
    });
  } catch (error) {
    console.error("Create medical record error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
