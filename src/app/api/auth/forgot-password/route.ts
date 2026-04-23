import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import sql from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const users = await sql`
      SELECT id, email FROM users WHERE email = ${email.toLowerCase()} LIMIT 1
    `;

    // Always return success to prevent email enumeration
    if (users.length === 0) {
      return NextResponse.json({
        message: "If an account exists with this email, a reset link has been sent.",
      });
    }

    // Delete old tokens for this email
    await sql`
      DELETE FROM password_reset_tokens WHERE email = ${email.toLowerCase()}
    `;

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await sql`
      INSERT INTO password_reset_tokens (email, token, expires_at)
      VALUES (${email.toLowerCase()}, ${token}, ${expiresAt.toISOString()})
    `;

    // Send email
    await sendPasswordResetEmail(email, token);

    return NextResponse.json({
      message: "If an account exists with this email, a reset link has been sent.",
    });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}