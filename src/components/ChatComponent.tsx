"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useRef } from "react";
import { useChat, Message } from "ai/react";
import { Button } from "./ui/button";
import { SendIcon } from "lucide-react";
import MessageList from "./MessageList";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {
  chatId: number;
};

const ChatComponent = ({ chatId }: Props) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/get-messages", {
        chatId,
      });
      return response.data;
    },
  });

  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: "/api/chat",
    body: {
      chatId,
    },
    initialMessages: data || [],
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-850">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-lg bg-gray-900/80 border-b border-gray-800">
        <div className="px-6 py-4">
          <h3 className="text-xl font-semibold text-gray-100">Chat</h3>
        </div>
      </div>

      {/* Messages Area with ScrollArea */}
      <ScrollArea className="flex-1 px-6 py-4">
        <MessageList isLoading={isLoading} messages={messages} />
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-gray-800 bg-gray-900 p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-1 bg-gray-800 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <SendIcon className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatComponent;
