import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import sql from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Find valid token
    const tokens = await sql`
      SELECT * FROM password_reset_tokens
      WHERE token = ${token}
        AND used = FALSE
        AND expires_at > NOW()
      LIMIT 1
    `;

    if (tokens.length === 0) {
      return NextResponse.json(
        { error: "This reset link is invalid or has expired" },
        { status: 400 }
      );
    }

    const resetToken = tokens[0];

    // Hash new password and update user
    const hashedPassword = await bcrypt.hash(password, 12);

    await sql`
      UPDATE users SET password = ${hashedPassword}
      WHERE email = ${resetToken.email}
    `;

    // Mark token as used
    await sql`
      UPDATE password_reset_tokens SET used = TRUE
      WHERE id = ${resetToken.id}
    `;

    return NextResponse.json({ message: "Password reset successfully" });
  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

// Validate token endpoint (GET)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ valid: false }, { status: 400 });
  }

  const tokens = await sql`
    SELECT id FROM password_reset_tokens
    WHERE token = ${token}
      AND used = FALSE
      AND expires_at > NOW()
    LIMIT 1
  `;

  return NextResponse.json({ valid: tokens.length > 0 });
}