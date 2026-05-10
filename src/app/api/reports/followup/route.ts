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
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { analysis, messages, conversationId, reportId } = await req.json();

    if (!analysis || !messages?.length) {
      return NextResponse.json({ error: "analysis and messages required" }, { status: 400 });
    }

    // Get user
    const users = await sql`
      SELECT id FROM users WHERE email = ${session.user.email} LIMIT 1
    `;
    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const userId = users[0].id;

    // Save user message to DB
    const latestMsg = messages[messages.length - 1];
    if (latestMsg?.role === "user" && conversationId) {
      await sql`
        INSERT INTO messages (conversation_id, role, content)
        VALUES (${conversationId}, 'user', ${latestMsg.content})
      `;
    }

    // Proxy follow-up to Python backend
    let reply: string;
    try {
      const backendRes = await fetch(`${PYTHON_BACKEND}/reports/followup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis, messages }),
      });

      if (!backendRes.ok) {
        const err = await backendRes.json().catch(() => ({}));
        return NextResponse.json(
          { error: (err as { detail?: string }).detail ?? "AI backend error" },
          { status: backendRes.status }
        );
      }

      const data = await backendRes.json();
      reply = data.reply ?? "";
    } catch {
      return NextResponse.json(
        { error: "Could not reach AI backend. Is the Python server running?" },
        { status: 502 }
      );
    }

    // Save assistant reply to DB
    if (conversationId) {
      await sql`
        INSERT INTO messages (conversation_id, role, content)
        VALUES (${conversationId}, 'assistant', ${reply})
      `;
      await sql`
        UPDATE conversations SET updated_at = NOW() WHERE id = ${conversationId}
      `;
    }

    return NextResponse.json({ reply, conversationId });
  } catch (err) {
    console.error("Report followup error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}