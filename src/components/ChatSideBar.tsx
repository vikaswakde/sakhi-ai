import { DrizzleChat } from "@/lib/db/schema";
import Link from "next/link";
// import React, { useState } from "react";
import { Button } from "./ui/button";
import { MessageCircleIcon, PlusCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import SubscriptionButton from "./SubscriptionButton";

type Props = {
  chats: DrizzleChat[];
  chatId: number;
  isPro: boolean;
};

const ChatSideBar = ({ chatId, chats, isPro }: Props) => {
  return (
    <div className="flex flex-col h-screen p-4">
      {/* New Chat Button */}
      <Link href="/" className="mb-4">
        <Button
          className="w-full bg-blue-200 hover:bg-blue-700 text-black shadow-sm border-dashed
          transition-all duration-200 ease-in-out transform hover:scale-[1.02] "
        >
          <PlusCircleIcon className="mr-2 w-5 h-5" />
          New Chat
        </Button>
      </Link>

      {/* Chats List with ScrollArea */}
      <ScrollArea className="flex-1 -mr-4 pr-4 mt-6">
        <div className="space-y-2">
          {chats.map((chat) => (
            <Link key={chat.id} href={`/chat/${chat.id}`}>
              <div
                className={cn(
                  "rounded-lg p-3 transition-all duration-200 ease-in-out",
                  "hover:bg-gray-800/60 group flex items-center mb-2",
                  {
                    "bg-blue-600 text-white": chat.id === chatId,
                    "text-gray-300 hover:text-white border border-gray-600":
                      chat.id !== chatId,
                  }
                )}
              >
                <MessageCircleIcon className="mr-3 w-5 h-5" />
                <p className="text-sm font-medium truncate">{chat.pdfName}</p>
              </div>
            </Link>
          ))}
        </div>
      </ScrollArea>
      <div>
        <SubscriptionButton isPro={isPro} />
      </div>
    </div>
  );
};

export default ChatSideBar;
