import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import sql from "@/lib/db";

const PYTHON_BACKEND = process.env.PYTHON_BACKEND_URL ?? "http://127.0.0.1:8000";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    // ── Auth check ──────────────────────────────────────────────────────────
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages, conversationId } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages array required" }, { status: 400 });
    }

    // ── Get user from DB ────────────────────────────────────────────────────
    const users = await sql`
      SELECT id FROM users WHERE email = ${session.user.email} LIMIT 1
    `;
    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const userId = users[0].id;

    // ── Resolve / create conversation ────────────────────────────────────────
    let convId: number = conversationId;

    if (!convId) {
      const firstUserMsg = messages.find((m: ChatMessage) => m.role === "user");
      const raw = firstUserMsg?.content ?? "New conversation";
      const title = raw.length > 60 ? raw.slice(0, 60) + "…" : raw;

      const newConv = await sql`
        INSERT INTO conversations (user_id, title)
        VALUES (${userId}, ${title})
        RETURNING id
      `;
      convId = newConv[0].id;
    }

    // ── Save user message to DB ─────────────────────────────────────────────
    const latestMsg = messages[messages.length - 1];
    if (latestMsg?.role === "user") {
      await sql`
        INSERT INTO messages (conversation_id, role, content)
        VALUES (${convId}, 'user', ${latestMsg.content})
      `;
    }

    // ── Call Python FastAPI backend ─────────────────────────────────────────
    let reply: string;
    try {
      const backendRes = await fetch(`${PYTHON_BACKEND}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });

      if (!backendRes.ok) {
        const err = await backendRes.json().catch(() => ({}));
        return NextResponse.json(
          { error: (err as { detail?: string }).detail ?? "AI backend error" },
          { status: backendRes.status }
        );
      }

      const backendData = await backendRes.json();
      reply = backendData.reply ?? "";
    } catch {
      return NextResponse.json(
        { error: "Could not reach AI backend. Is the Python server running?" },
        { status: 502 }
      );
    }

    // ── Save assistant reply to DB ──────────────────────────────────────────
    await sql`
      INSERT INTO messages (conversation_id, role, content)
      VALUES (${convId}, 'assistant', ${reply})
    `;

    await sql`
      UPDATE conversations SET updated_at = NOW() WHERE id = ${convId}
    `;

    return NextResponse.json({ reply, conversationId: convId });
  } catch (err) {
    console.error("Chat route error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}