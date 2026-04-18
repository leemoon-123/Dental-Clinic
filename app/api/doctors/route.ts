import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const specialty = searchParams.get("specialty");

    const db = await getDatabase();
    const query: Record<string, unknown> = { isActive: true };

    if (specialty) {
      query.specialty = specialty;
    }

    const doctors = await db.collection("doctors").find(query).toArray();

    return NextResponse.json({ doctors });
  } catch (error) {
    console.error("Get doctors error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone, specialty, experience, bio, avatar } = body;

    if (!name || !email || !phone || !specialty) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Create user account for doctor
    const userResult = await db.collection("users").insertOne({
      name,
      email,
      phone,
      role: "doctor",
      avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create doctor record
    const doctorResult = await db.collection("doctors").insertOne({
      userId: userResult.insertedId,
      name,
      email,
      phone,
      specialty,
      experience: experience || 0,
      rating: 5.0,
      bio: bio || "",
      avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      isActive: true,
      workingHours: [
        { day: "Monday", start: "08:00", end: "17:00" },
        { day: "Tuesday", start: "08:00", end: "17:00" },
        { day: "Wednesday", start: "08:00", end: "17:00" },
        { day: "Thursday", start: "08:00", end: "17:00" },
        { day: "Friday", start: "08:00", end: "17:00" },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      doctorId: doctorResult.insertedId.toString(),
    });
  } catch (error) {
    console.error("Create doctor error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "admin" && session.role !== "doctor")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json(
        { error: "Doctor ID is required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    await db.collection("doctors").updateOne(
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
    console.error("Update doctor error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Doctor ID is required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    await db.collection("doctors").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          isActive: false,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete doctor error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
