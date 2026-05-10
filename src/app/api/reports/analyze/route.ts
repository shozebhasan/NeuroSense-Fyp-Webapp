import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import sql from "@/lib/db";

const PYTHON_BACKEND = process.env.PYTHON_BACKEND_URL ?? "http://127.0.0.1:8000";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user
    const users = await sql`
      SELECT id FROM users WHERE email = ${session.user.email} LIMIT 1
    `;
    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const userId = users[0].id;

    // Forward the multipart form (PDF file) to Python backend
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Proxy to Python
    const proxyForm = new FormData();
    proxyForm.append("file", file, file.name);

    let backendData: { extracted_text: string; analysis: string; summary_title: string };

    try {
      const backendRes = await fetch(`${PYTHON_BACKEND}/reports/analyze`, {
        method: "POST",
        body: proxyForm,
      });

      if (!backendRes.ok) {
        const err = await backendRes.json().catch(() => ({}));
        return NextResponse.json(
          { error: (err as { detail?: string }).detail ?? "AI backend error" },
          { status: backendRes.status }
        );
      }

      backendData = await backendRes.json();
    } catch {
      return NextResponse.json(
        { error: "Could not reach AI backend. Is the Python server running?" },
        { status: 502 }
      );
    }

    const { extracted_text, analysis, summary_title } = backendData;

    // Create a conversation for this report's follow-up chat
    const conv = await sql`
      INSERT INTO conversations (user_id, title)
      VALUES (${userId}, ${summary_title})
      RETURNING id
    `;
    const convId = conv[0].id;

    // Save initial analysis as the first assistant message
    await sql`
      INSERT INTO messages (conversation_id, role, content)
      VALUES (${convId}, 'assistant', ${analysis})
    `;

    // Save report record in DB
    const report = await sql`
      INSERT INTO reports
        (user_id, original_name, file_size_bytes, extracted_text,
         extraction_ok, analysis, summary, analysis_ok, conversation_id)
      VALUES
        (${userId}, ${file.name}, ${file.size}, ${extracted_text},
         TRUE, ${analysis}, ${summary_title}, TRUE, ${convId})
      RETURNING id
    `;

    await sql`UPDATE conversations SET updated_at = NOW() WHERE id = ${convId}`;

    return NextResponse.json({
      reportId: report[0].id,
      conversationId: convId,
      analysis,
      summaryTitle: summary_title,
    });
  } catch (err) {
    console.error("Report analyze route error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}