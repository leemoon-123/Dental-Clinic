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
    const search = searchParams.get("search");

    const db = await getDatabase();
    let query: Record<string, unknown> = {};

    if (session.role === "doctor") {
      // Get patients who have appointments with this doctor
      const doctor = await db
        .collection("doctors")
        .findOne({ userId: new ObjectId(session.userId) });

      if (doctor) {
        const appointments = await db
          .collection("appointments")
          .find({ doctorId: doctor._id })
          .toArray();

        const patientIds = [...new Set(appointments.map((a) => a.patientId))];
        query._id = { $in: patientIds };
      }
    }

    if (search) {
      query = {
        ...query,
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ],
      };
    }

    const patients = await db.collection("patients").find(query).toArray();

    return NextResponse.json({ patients });
  } catch (error) {
    console.error("Get patients error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json(
        { error: "Patient ID is required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Verify patient can update own profile or admin/doctor can update
    if (session.role === "patient") {
      const patient = await db
        .collection("patients")
        .findOne({ userId: new ObjectId(session.userId) });
      if (!patient || patient._id.toString() !== _id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    await db.collection("patients").updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      }
    );

    // Also update user record
    const patient = await db
      .collection("patients")
      .findOne({ _id: new ObjectId(_id) });
    if (patient) {
      await db.collection("users").updateOne(
        { _id: patient.userId },
        {
          $set: {
            name: updateData.name,
            phone: updateData.phone,
            updatedAt: new Date(),
          },
        }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update patient error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
