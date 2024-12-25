import { DrizzleChat } from "@/lib/db/schema";
import Link from "next/link";
// import React, { useState } from "react";
import { Button } from "./ui/button";
import { MessageCircleIcon, PlusCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  chats: DrizzleChat[];
  chatId: number;
  //   isPro?
};

const ChatSideBar = ({ chatId, chats }: Props) => {
  //   const [loading, setIsLoading] = useState(false);

  return (
    <div className="w-full min-h-screen overflow-scroll p-4 text-gray-200 border-gray-600  scrollbar-hide  border-r-2">
      {/* Button */}
      <Link href={"/"}>
        <Button className="w-full border-dashed border-white border">
          <PlusCircleIcon className="mr-2 w-4 h-4" />
          New Chat
        </Button>
      </Link>
      {/* ChatsList */}
      <div className="flex max-h-screen overflow-scroll pb-20 flex-col gap-2 mt-4 scrollbar-hide">
        {chats.map((chat) => (
          <Link key={chat.id} href={`/chat/${chat.id}`}>
            <div
              className={cn("rounded-lg p-3 text-slate-300 flex items-center", {
                "bg-blue-600 text-white": chat.id === chatId,
                "hover:text-white": chat.id !== chatId,
              })}
            >
              <MessageCircleIcon className="mr-2" />
              <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                {chat.pdfName}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChatSideBar;
