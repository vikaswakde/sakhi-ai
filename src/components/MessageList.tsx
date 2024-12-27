import { cn } from "@/lib/utils";
import { Message } from "ai";
import { BotIcon, Loader2Icon, UserIcon } from "lucide-react";
import React from "react";

type Props = {
  isLoading: boolean;
  messages: Message[];
};

const MessageList = ({ isLoading, messages }: Props) => {
  if (isLoading) {
    return (
      <div className="flex w-full h-full justify-center items-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2Icon className="w-6 h-6 animate-spin text-blue-500" />
          <p className="text-sm text-gray-400">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (!messages?.length) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-gray-400">No messages yet</p>
          <p className="text-sm text-gray-500">Start a conversation below</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-4">
      {messages.map((message) => {
        const isUser = message.role === "user";
        return (
          <div
            key={message.id}
            className={cn("flex items-end gap-2", {
              "justify-end": isUser,
              "justify-start max-w-[75%]": !isUser,
            })}
          >
            {/* Avatar for assistant */}
            {!isUser && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                <BotIcon className="w-5 h-5 text-blue-500" />
              </div>
            )}

            {/* Message bubble */}
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-md",
                "transform transition-all duration-200",
                {
                  "bg-blue-600 text-white rounded-br-none": isUser,
                  "bg-gray-800 text-gray-100 rounded-bl-none": !isUser,
                }
              )}
            >
              {message.content}
            </div>

            {/* Avatar for user */}
            {isUser && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
