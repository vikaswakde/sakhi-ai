import { cn } from "@/lib/utils";
import { Message } from "ai";
import { Loader2Icon } from "lucide-react";
import React from "react";

type Props = {
  isLoading: boolean;
  messages: Message[];
};

const MessageList = ({ isLoading, messages }: Props) => {
  if (isLoading) {
    return (
      <div className="flex w-full h-full justify-center items-center">
        <Loader2Icon className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!messages) return <></>;

  return (
    <div className="flex flex-col gap-2 px-4">
      {messages.map((message) => {
        return (
          <div
            key={message.id}
            className={cn("flex", {
              "justify-end pl-10": message.role === "user",
              "justify-start pr-10": message.role === "assistant",
            })}
          >
            <div
              className={cn(
                "rounded-lg px-3 text-sm py-1 shadow-md ring-1 ring-gray-900/10",
                {
                  "bg-blue-600 text-white": message.role === "user",
                }
              )}
            >
              {message.content}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
