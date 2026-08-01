import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import sql from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const convId = parseInt(id);
  if (isNaN(convId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const users = await sql`
    SELECT id FROM users WHERE email = ${session.user.email} LIMIT 1
  `;
  const userId = users[0]?.id;

  const conv = await sql`
    SELECT id FROM conversations WHERE id = ${convId} AND user_id = ${userId} LIMIT 1
  `;
  if (conv.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const messages = await sql`
    SELECT id, role, content, created_at
    FROM messages
    WHERE conversation_id = ${convId}
    ORDER BY created_at ASC
  `;

  return NextResponse.json({ messages });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; 
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const convId = parseInt(id);
  if (isNaN(convId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const users = await sql`
    SELECT id FROM users WHERE email = ${session.user.email} LIMIT 1
  `;
  const userId = users[0]?.id;

  await sql`
    DELETE FROM conversations WHERE id = ${convId} AND user_id = ${userId}
  `;

  return NextResponse.json({ success: true });
}