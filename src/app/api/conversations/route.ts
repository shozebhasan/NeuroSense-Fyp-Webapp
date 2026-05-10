import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import sql from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await sql`
    SELECT id FROM users WHERE email = ${session.user.email} LIMIT 1
  `;
  if (users.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const conversations = await sql`
    SELECT id, title, created_at, updated_at
    FROM conversations
    WHERE user_id = ${users[0].id}
    ORDER BY updated_at DESC
    LIMIT 100
  `;

  return NextResponse.json({ conversations });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await sql`
    SELECT id FROM users WHERE email = ${session.user.email} LIMIT 1
  `;
  if (users.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { title } = await req.json().catch(() => ({}));
  const result = await sql`
    INSERT INTO conversations (user_id, title)
    VALUES (${users[0].id}, ${title ?? "New conversation"})
    RETURNING id, title, created_at, updated_at
  `;

  return NextResponse.json({ conversation: result[0] }, { status: 201 });
}