// edge runtime

import { db } from "@/lib/db";
import { chats, messages as _messages } from "@/lib/db/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message } from "ai/react";
import { StreamingTextResponse } from "ai";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getContext } from "@/lib/context";

export const runtime = "edge";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: Request) {
  try {
    const { messages, chatId } = await req.json();
    const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
    if (_chats.length != 1) {
      return NextResponse.json({ error: "chat not found" }, { status: 404 });
    }
    const fileKey = _chats[0].fileKey;
    // console.log("this is fileKey", fileKey); // [works correctly]
    const lastMessage = messages[messages.length - 1];
    // console.log("this is last message", lastMessage); // [works correctly]
    const context = await getContext(lastMessage.content, fileKey);
    // console.log("this is context", context);

    const prompt = `You are an AI assistant designed to help with questions about the provided context.
      Please follow these rules strictly:
      1. Only answer the current question based on the given context
      2. Do not include information from previous questions
      3. If the context doesn't contain the answer, respond with "I'm sorry, but I don't know the answer to that question"
      4. Do not make up or infer information not directly stated in the context
      5. Keep responses clear and concise

      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK

      Focus only on the most recent question and current context.
      `;

    const userMessage = messages
      .filter((message: Message) => message.role === "user")
      .map((msg: Message) => msg.content)
      .slice(-1);

    console.log("this is userMessage", userMessage);

    const chatHistory = [prompt, ...userMessage].join("\n");

    console.log("this is chatHistoy", chatHistory);

    const result = await model.generateContentStream(chatHistory);

    console.log("this is result", result);

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

        // Save messages to database after a full response is generated
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

    // return a streaming response
    console.log("this is stream", stream);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Gemini API Error", error);
    return NextResponse.json({ error: "An Error occured" }, { status: 500 });
  }
}
