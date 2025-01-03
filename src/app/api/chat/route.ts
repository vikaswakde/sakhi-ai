// edge runtime

import { db } from "@/lib/db";
import { chats, messages as _messages } from "@/lib/db/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message } from "ai/react";
import { StreamingTextResponse } from "ai";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getContext } from "@/lib/context";
import { checkSubscription } from "@/lib/subscription";

// export const runtime = "edge";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: Request) {
  try {
    const { messages, chatId } = await req.json();

    // Check if messages length exceeds 10 and user is not subscribed
    if (messages.length > 14) {
      const isPro = await checkSubscription();
      if (!isPro) {
        const stream = new ReadableStream({
          start(controller) {
            const message =
              "You have used your free trial. Please upgrade to pro and continue using the service. [Click here to upgrade](/api/stripe)";
            controller.enqueue(message);
            controller.close();
          },
        });
        return new StreamingTextResponse(stream);
      }
    }

    const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
    if (_chats.length != 1) {
      return NextResponse.json({ error: "chat not found" }, { status: 404 });
    }
    const fileKey = _chats[0].fileKey;
    const lastMessage = messages[messages.length - 1];
    const context = await getContext(lastMessage.content, fileKey);

    const prompt = `You are an intelligent, a friendly and enthusiastic AI assistant assistant designed to help users interact seamlessly with information & who loves helping people understand documents. You have a warm, engaging personality and enjoy making learning fun.

    When answering questions:
    1. Start with a friendly greeting or acknowledgment
    2. Provide a clear, detailed answer based on the context
    3. Use an encouraging and optimistic tone
    4. Add relevant examples or analogies when helpful
    5. End with an invitation for follow-up questions
    6. If you can't find the answer in the context, say: "I wish I could help with that! Unfortunately, I don't see that information in the document. Would you like to ask something else about what's in the text?"
    7. Keep your personality consistent - be warm, helpful and engaging throughout

    Context for this question:
    ${context}

    Remember to maintain your friendly demeanor while staying focused on providing accurate, helpful information from the context.`;

    const userMessage = messages
      .filter((message: Message) => message.role === "user")
      .map((msg: Message) => msg.content)
      .slice(-1);

    // console.log("this is userMessage", userMessage);

    const chatHistory = [prompt, ...userMessage].join("\n");

    // console.log("this is chatHistoy", chatHistory);

    const result = await model.generateContentStream(chatHistory);

    // Create a ReadableStream for the response
    const stream = new ReadableStream({
      async start(controller) {
        let fullResponse = "";
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          fullResponse += chunkText;
          console.log("this is full response", fullResponse);
          controller.enqueue(chunkText);
        }
        controller.close();

        await db.insert(_messages).values({
          chatId,
          content: lastMessage.content,
          role: "user",
        });

        await db.insert(_messages).values({
          chatId,
          content: fullResponse,
          role: "system",
        });
      },
    });

    console.log("this is stream", stream);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Gemini API Error", error);
    return NextResponse.json({ error: "An Error occured" }, { status: 500 });
  }
}
