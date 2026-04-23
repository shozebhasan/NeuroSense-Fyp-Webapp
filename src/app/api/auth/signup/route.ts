import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import sql from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();

    // Validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (username.length < 3 || username.length > 50) {
      return NextResponse.json(
        { error: "Username must be between 3 and 50 characters" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Check for existing user
    const existingEmail = await sql`
      SELECT id FROM users WHERE email = ${email.toLowerCase()} LIMIT 1
    `;
    if (existingEmail.length > 0) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const existingUsername = await sql`
      SELECT id FROM users WHERE username = ${username} LIMIT 1
    `;
    if (existingUsername.length > 0) {
      return NextResponse.json(
        { error: "This username is already taken" },
        { status: 409 }
      );
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await sql`
      INSERT INTO users (username, email, password)
      VALUES (${username}, ${email.toLowerCase()}, ${hashedPassword})
      RETURNING id, username, email, created_at
    `;

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id: newUser[0].id,
          username: newUser[0].username,
          email: newUser[0].email,
          createdAt: newUser[0].created_at,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}