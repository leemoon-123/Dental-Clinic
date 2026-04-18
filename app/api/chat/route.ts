import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";

// Simple RAG-based chatbot using knowledge base
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const session = await getSession();
    const db = await getDatabase();

    // Save user message
    const chatSessionId = sessionId || new ObjectId().toString();
    await db.collection("chat_messages").insertOne({
      sessionId: chatSessionId,
      patientId: session ? new ObjectId(session.userId) : null,
      role: "user",
      content: message,
      createdAt: new Date(),
    });

    // Search knowledge base for relevant information
    const keywords = message.toLowerCase().split(" ").filter((w: string) => w.length > 2);
    
    const knowledgeResults = await db
      .collection("knowledge")
      .find({
        isActive: true,
        $or: [
          { title: { $regex: keywords.join("|"), $options: "i" } },
          { content: { $regex: keywords.join("|"), $options: "i" } },
          { keywords: { $in: keywords } },
        ],
      })
      .limit(3)
      .toArray();

    // Generate response based on knowledge base
    let response = "";

    if (knowledgeResults.length > 0) {
      response = generateResponse(message, knowledgeResults);
    } else {
      response = getDefaultResponse(message);
    }

    // Save assistant message
    await db.collection("chat_messages").insertOne({
      sessionId: chatSessionId,
      patientId: session ? new ObjectId(session.userId) : null,
      role: "assistant",
      content: response,
      createdAt: new Date(),
    });

    return NextResponse.json({
      response,
      sessionId: chatSessionId,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function generateResponse(
  message: string,
  knowledge: Array<{ title: string; content: string }>
): string {
  const lowerMessage = message.toLowerCase();

  // Check for specific intents
  if (
    lowerMessage.includes("đặt lịch") ||
    lowerMessage.includes("đặt hẹn") ||
    lowerMessage.includes("book")
  ) {
    return "Để đặt lịch hẹn khám, bạn có thể:\n1. Đăng nhập vào tài khoản của bạn\n2. Vào mục 'Đặt lịch hẹn'\n3. Chọn dịch vụ, bác sĩ và thời gian phù hợp\n\nBạn cũng có thể gọi điện trực tiếp đến số hotline: 1900-xxxx để được hỗ trợ đặt lịch.";
  }

  if (
    lowerMessage.includes("giá") ||
    lowerMessage.includes("chi phí") ||
    lowerMessage.includes("bao nhiêu tiền")
  ) {
    return "Giá dịch vụ tại DentaCare:\n- Khám tổng quát: 200.000đ - 500.000đ\n- Trám răng: 300.000đ - 800.000đ\n- Nhổ răng: 200.000đ - 1.500.000đ\n- Tẩy trắng răng: 1.500.000đ - 3.000.000đ\n- Niềng răng: 20.000.000đ - 80.000.000đ\n\nGiá có thể thay đổi tùy theo tình trạng cụ thể. Vui lòng đặt lịch khám để được tư vấn chi tiết.";
  }

  if (
    lowerMessage.includes("thời gian") ||
    lowerMessage.includes("giờ làm việc") ||
    lowerMessage.includes("mở cửa")
  ) {
    return "Giờ làm việc của DentaCare:\n- Thứ 2 - Thứ 6: 8:00 - 20:00\n- Thứ 7: 8:00 - 17:00\n- Chủ nhật: 8:00 - 12:00\n\nChúng tôi khuyên bạn nên đặt lịch hẹn trước để được phục vụ tốt nhất.";
  }

  if (
    lowerMessage.includes("địa chỉ") ||
    lowerMessage.includes("ở đâu") ||
    lowerMessage.includes("vị trí")
  ) {
    return "DentaCare có các chi nhánh tại:\n1. Chi nhánh 1: 123 Nguyễn Huệ, Quận 1, TP.HCM\n2. Chi nhánh 2: 456 Lê Văn Việt, Quận 9, TP.HCM\n3. Chi nhánh 3: 789 Cách Mạng Tháng 8, Quận 3, TP.HCM\n\nVui lòng chọn chi nhánh gần bạn nhất khi đặt lịch hẹn.";
  }

  // Use knowledge base content
  if (knowledge.length > 0) {
    const relevantContent = knowledge[0].content;
    return `Dựa trên thông tin từ hệ thống:\n\n${relevantContent}\n\nNếu bạn cần thêm thông tin chi tiết, vui lòng đặt lịch khám hoặc liên hệ hotline: 1900-xxxx.`;
  }

  return getDefaultResponse(message);
}

function getDefaultResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes("xin chào") ||
    lowerMessage.includes("hello") ||
    lowerMessage.includes("hi")
  ) {
    return "Xin chào! Tôi là trợ lý ảo của DentaCare. Tôi có thể giúp bạn:\n- Tìm hiểu về các dịch vụ nha khoa\n- Hướng dẫn đặt lịch hẹn\n- Giải đáp thắc mắc về chăm sóc răng miệng\n\nBạn cần tôi hỗ trợ gì?";
  }

  if (
    lowerMessage.includes("cảm ơn") ||
    lowerMessage.includes("thank")
  ) {
    return "Không có gì! Rất vui được hỗ trợ bạn. Nếu có thêm câu hỏi nào, đừng ngại hỏi nhé!";
  }

  return "Cảm ơn bạn đã liên hệ DentaCare! Tôi có thể giúp bạn:\n- Tìm hiểu về dịch vụ nha khoa\n- Hướng dẫn đặt lịch hẹn\n- Tư vấn chăm sóc răng miệng\n- Thông tin về giá và ưu đãi\n\nBạn muốn tìm hiểu về vấn đề gì?";
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    const db = await getDatabase();
    const query: Record<string, unknown> = {};

    if (sessionId) {
      query.sessionId = sessionId;
    } else {
      query.patientId = new ObjectId(session.userId);
    }

    const messages = await db
      .collection("chat_messages")
      .find(query)
      .sort({ createdAt: 1 })
      .toArray();

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Get chat history error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
