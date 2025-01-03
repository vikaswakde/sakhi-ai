"use client";
import { useSidebar } from "@/context/SidebarContext";
import ChatSideBar from "./ChatSideBar";
import { DrizzleChat } from "@/lib/db/schema";

type Props = {
  chatId: number;
  chats: DrizzleChat[];
  isPro: boolean;
};

export default function MobileSidebar({ chatId, chats, isPro }: Props) {
  const { isSidebarOpen, closeSidebar } = useSidebar();

  return (
    <div className="md:hidden">
      <ChatSideBar
        chatId={chatId}
        chats={chats}
        isPro={isPro}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />
    </div>
  );
} 