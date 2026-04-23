import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import sql from "@/lib/db";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const SYSTEM_PROMPT = "Talk casually with the user.";

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

    const { messages, conversationId } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "messages array required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY not set" }, { status: 500 });
    }

    // Get user id
    const users = await sql`
      SELECT id FROM users WHERE email = ${session.user.email} LIMIT 1
    `;
    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const userId = users[0].id;

    // Resolve or create conversation
    let convId: number = conversationId;

    if (!convId) {
      // First message — create conversation, use first 60 chars as title
      const firstUserMsg = messages.find((m: ChatMessage) => m.role === "user");
      const title = firstUserMsg
        ? firstUserMsg.content.slice(0, 60) + (firstUserMsg.content.length > 60 ? "…" : "")
        : "New conversation";

      const newConv = await sql`
        INSERT INTO conversations (user_id, title)
        VALUES (${userId}, ${title})
        RETURNING id
      `;
      convId = newConv[0].id;
    }

    // Save the latest user message to DB
    const latestUserMsg = messages[messages.length - 1];
    if (latestUserMsg?.role === "user") {
      await sql`
        INSERT INTO messages (conversation_id, role, content)
        VALUES (${convId}, 'user', ${latestUserMsg.content})
      `;
    }

    // Call Gemini
    const geminiMessages = messages.map((msg: ChatMessage) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const body = {
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: geminiMessages,
      generationConfig: { temperature: 1, maxOutputTokens: 2048 },
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errData = await response.json();
      return NextResponse.json(
        { error: errData?.error?.message ?? "Gemini API failed" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    // Save assistant reply to DB
    await sql`
      INSERT INTO messages (conversation_id, role, content)
      VALUES (${convId}, 'assistant', ${reply})
    `;

    // Bump conversation updated_at
    await sql`
      UPDATE conversations SET updated_at = NOW() WHERE id = ${convId}
    `;

    return NextResponse.json({ reply, conversationId: convId });
  } catch (err) {
    console.error("Chat route error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}