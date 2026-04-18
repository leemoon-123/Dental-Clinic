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
    const status = searchParams.get("status");
    const date = searchParams.get("date");

    const db = await getDatabase();
    const query: Record<string, unknown> = {};

    // Filter by role
    if (session.role === "patient") {
      const patient = await db
        .collection("patients")
        .findOne({ userId: new ObjectId(session.userId) });
      if (patient) {
        query.patientId = patient._id;
      }
    } else if (session.role === "doctor") {
      const doctor = await db
        .collection("doctors")
        .findOne({ userId: new ObjectId(session.userId) });
      if (doctor) {
        query.doctorId = doctor._id;
      }
    }

    if (status) {
      query.status = status;
    }

    if (date) {
      query.date = date;
    }

    const appointments = await db
      .collection("appointments")
      .find(query)
      .sort({ date: -1, time: -1 })
      .toArray();

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error("Get appointments error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { doctorId, serviceId, date, time, notes } = body;

    if (!doctorId || !serviceId || !date || !time) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Get patient info
    let patient;
    if (session.role === "patient") {
      patient = await db
        .collection("patients")
        .findOne({ userId: new ObjectId(session.userId) });
    }

    if (!patient && session.role === "patient") {
      // Create patient record if not exists
      const user = await db
        .collection("users")
        .findOne({ _id: new ObjectId(session.userId) });
      if (user) {
        const result = await db.collection("patients").insertOne({
          userId: new ObjectId(session.userId),
          name: user.name,
          email: user.email,
          phone: user.phone,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        patient = { _id: result.insertedId, name: user.name, phone: user.phone };
      }
    }

    // Get doctor and service info
    const doctor = await db
      .collection("doctors")
      .findOne({ _id: new ObjectId(doctorId) });
    const service = await db
      .collection("services")
      .findOne({ _id: new ObjectId(serviceId) });

    if (!doctor || !service) {
      return NextResponse.json(
        { error: "Doctor or service not found" },
        { status: 404 }
      );
    }

    // Check for existing appointment at same time
    const existingAppointment = await db.collection("appointments").findOne({
      doctorId: new ObjectId(doctorId),
      date,
      time,
      status: { $in: ["pending", "confirmed"] },
    });

    if (existingAppointment) {
      return NextResponse.json(
        { error: "This time slot is already booked" },
        { status: 400 }
      );
    }

    const appointment = {
      patientId: patient?._id,
      patientName: patient?.name || session.name,
      patientPhone: patient?.phone || "",
      doctorId: new ObjectId(doctorId),
      doctorName: doctor.name,
      serviceId: new ObjectId(serviceId),
      serviceName: service.name,
      date,
      time,
      status: "pending",
      notes: notes || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("appointments").insertOne(appointment);

    return NextResponse.json({
      success: true,
      appointmentId: result.insertedId.toString(),
    });
  } catch (error) {
    console.error("Create appointment error:", error);
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
        { error: "Appointment ID is required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    await db.collection("appointments").updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update appointment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Appointment ID is required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    await db.collection("appointments").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "cancelled",
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete appointment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
