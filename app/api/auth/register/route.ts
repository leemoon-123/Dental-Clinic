import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { hashPassword, setSession, JWTPayload } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone, role = "patient" } = body;

    if (!name || !email || !password || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const usersCollection = db.collection("users");

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const newUser = {
      name,
      email,
      password: hashedPassword,
      phone,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    // Create patient or doctor record
    if (role === "patient") {
      await db.collection("patients").insertOne({
        userId: result.insertedId,
        name,
        email,
        phone,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else if (role === "doctor") {
      await db.collection("doctors").insertOne({
        userId: result.insertedId,
        name,
        email,
        phone,
        specialty: "General Dentistry",
        experience: 0,
        rating: 5.0,
        isActive: true,
        workingHours: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Set session
    const payload: JWTPayload = {
      userId: result.insertedId.toString(),
      email,
      role,
      name,
    };
    await setSession(payload);

    return NextResponse.json({
      success: true,
      user: {
        _id: result.insertedId.toString(),
        name,
        email,
        phone,
        role,
        avatar: newUser.avatar,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
