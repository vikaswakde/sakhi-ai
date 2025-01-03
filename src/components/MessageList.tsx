import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Message } from "ai";
import { BotIcon, Loader2Icon, UserIcon } from "lucide-react";
import React from "react";
import ReactMarkdown from "react-markdown";

type Props = {
  isLoading: boolean;
  messages: Message[];
};

const MessageList = ({ isLoading, messages }: Props) => {
  const { user } = useUser();
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
              "justify-start lg:max-w-[85%]": !isUser,
            })}
          >
            {/* Avatar for assistant */}
            {!isUser && (
              <div className="h-8 w-8 rounded-full flex items-center justify-center">
                <img
                  src="/ai-logo-no-bg.png"
                  alt="AI Assistant"
                  className="h-[2.5rem] w-[2.5rem]"
                />
              </div>
            )}

            {/* Message bubble */}
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-md",
                "transform transition-all duration-200",
                {
                  "bg-blue-600/20 text-white rounded-br-none border border-blue-600/10":
                    isUser,
                  "bg-gray-800 text-gray-100 rounded-bl-none prose prose-invert prose-sm border border-gray-700":
                    !isUser,
                }
              )}
            >
              {isUser ? (
                message.content
              ) : (
                <ReactMarkdown
                  components={{
                    // Style different markdown elements
                    h1: ({ children }) => (
                      <h1 className="text-xl font-bold mb-2">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-lg font-semibold mb-2">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-md font-medium mb-1">{children}</h3>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc ml-4 mb-2">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal ml-4 mb-2">{children}</ol>
                    ),
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    p: ({ children }) => <p className="mb-2">{children}</p>,
                    strong: ({ children }) => (
                      <strong className="font-semibold">{children}</strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic">{children}</em>
                    ),
                    code: ({ children }) => (
                      <code className="bg-gray-700 rounded px-1 py-0.5">
                        {children}
                      </code>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              )}
            </div>

            {/* Avatar for user */}
            {isUser && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full  flex items-center justify-center">
                <img
                  src={user?.imageUrl}
                  alt="User"
                  className="w-7 h-7 rounded-full"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
