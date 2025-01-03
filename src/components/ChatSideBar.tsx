"use client";
import { DrizzleChat } from "@/lib/db/schema";
import Link from "next/link";
import { Button } from "./ui/button";
import { MessageCircleIcon, PlusCircleIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import SubscriptionButton from "./SubscriptionButton";

type Props = {
  chats: DrizzleChat[];
  chatId: number;
  isPro: boolean;
  isOpen?: boolean;
  onClose?: () => void;
};

const ChatSideBar = ({ chatId, chats, isPro, isOpen, onClose }: Props) => {
  return (
    <div
      className={cn(
        "flex flex-col h-screen p-4 bg-gray-900",
        "fixed inset-y-0 left-0 z-50 w-72 md:w-80 md:relative",
        "transform transition-transform duration-200 ease-in-out",
        "md:transform-none",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      {/* Mobile Close Button */}
      <div className="md:hidden absolute top-4 right-4 z-50 bg-red-400/70 rounded-xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="hover:bg-gray-800"
        >
          <XIcon className="h-5 w-5 text-white" />
        </Button>
      </div>

      {/* New Chat Button */}
      <Link href="/" className="mb-4">
        <Button
          className=" w-[50%] lg:w-full bg-blue-200 hover:bg-blue-700 text-black shadow-sm border-dashed
          transition-all duration-200 ease-in-out transform hover:scale-[1.02]"
        >
          <PlusCircleIcon className="mr-2 w-5 h-5" />
          New Chat
        </Button>
      </Link>

      {/* Chats List */}
      <ScrollArea className="flex-1 -mr-4 pr-4 mt-6">
        <div className="space-y-2">
          {chats.map((chat) => (
            <Link key={chat.id} href={`/chat/${chat.id}`}>
              <div
                className={cn(
                  "rounded-lg p-3 text-sm",
                  "transition-all duration-200 ease-in-out",
                  "hover:bg-gray-800/60 group flex items-center mb-2",
                  "break-all line-clamp-1",
                  {
                    "bg-blue-600/30 text-white": chat.id === chatId,
                    "text-gray-300 hover:text-white border border-gray-600":
                      chat.id !== chatId,
                  }
                )}
              >
                <MessageCircleIcon className="mr-3 w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium truncate">{chat.pdfName}</p>
              </div>
            </Link>
          ))}
        </div>
      </ScrollArea>

      {/* Subscription Button */}
      <div className="mt-4">
        <SubscriptionButton isPro={isPro} />
      </div>
    </div>
  );
};

export default ChatSideBar;
