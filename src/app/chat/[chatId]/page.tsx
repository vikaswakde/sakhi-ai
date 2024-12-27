import ChatComponent from "@/components/ChatComponent";
import ChatSideBar from "@/components/ChatSideBar";
import PDFViewer from "@/components/PDFViewer";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    chatId: string;
  };
};

const ChatPage = async ({ params: { chatId } }: Props) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("sign-in");
  }
  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  if (!_chats) {
    return redirect("/");
  }
  if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
    return redirect("/");
  }

  const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="flex w-full max-h-screen">
        {/* Chat Sidebar - Refined width and styling */}
        <div className="w-80 bg-gray-900 border-r border-gray-800">
          <ChatSideBar chatId={parseInt(chatId)} chats={_chats} />
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1">
          {/* Chat Component - Improved layout */}
          <div className="flex-1 max-h-screen">
            <ChatComponent chatId={parseInt(chatId)} />
          </div>

          {/* PDF Viewer - Better integration */}
          <div className="w-[35%] border-l border-gray-800 bg-gray-900">
            <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
