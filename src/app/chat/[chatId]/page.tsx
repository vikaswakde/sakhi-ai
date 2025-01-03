import ChatComponent from "@/components/ChatComponent";
import ChatSideBar from "@/components/ChatSideBar";
import PDFViewer from "@/components/PDFViewer";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";
import MobileSidebarToggle from "@/components/MobileSidebarToggle";

import MobileSidebar from "@/components/MobileSidebar";

type Props = {
  params: {
    chatId: string;
  };
};

const ChatPage = async ({ params: { chatId } }: Props) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }
  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  if (!_chats) {
    return redirect("/");
  }
  if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
    return redirect("/");
  }

  const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));
  const isPro = await checkSubscription();

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <MobileSidebarToggle />

      {/* Mobile Sidebar */}
      <MobileSidebar chatId={parseInt(chatId)} chats={_chats} isPro={isPro} />

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-80 min-h-screen bg-gray-900 border-r border-gray-800">
        <ChatSideBar chatId={parseInt(chatId)} chats={_chats} isPro={isPro} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 max-h-screen">
          <ChatComponent chatId={parseInt(chatId)} />
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="hidden xl:block w-[20%] border-l border-gray-800 bg-gray-900">
        <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
      </div>
    </div>
  );
};

export default ChatPage;
