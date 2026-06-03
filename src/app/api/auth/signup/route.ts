import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { CollegeRepository } from "@/lib/db/collegeRepository";
import { signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await CollegeRepository.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await CollegeRepository.createUser(email, passwordHash, name);

    // Sign JWT
    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name
    });

    // Set cookie
    const response = NextResponse.json(
      {
        message: "User registered successfully",
        user: { id: user.id, email: user.email, name: user.name }
      },
      { status: 201 }
    );

    // Set token cookie
    response.headers.set(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`
    );

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
