"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { BotIcon, Loader2Icon } from "lucide-react";
import Markdown from "react-markdown";
import { Message } from "./Chat";

function ChatMessage({ message }: { message: Message }) {
  const isHuman = message.role === "human";
  const { user } = useUser();

  return (
    <div
      className={`flex items-start mb-4 py-2 px-4 ${
        isHuman ? "justify-end" : "justify-start"
      }`}
    >
      {/* AI Avatar on the LEFT */}
      {!isHuman && (
        <div className="mr-3">
          <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center shadow-md">
            <BotIcon className="text-black h-6 w-6" />
          </div>
        </div>
      )}

      {/* Chat Bubble */}
      <div
        className={`max-w-[75%] rounded-xl text-sm px-4 py-3 leading-relaxed shadow-md ${
          isHuman
            ? "bg-yellow-500 text-black rounded-br-none"
            : "bg-[#1a1a1a] text-yellow-300 rounded-bl-none"
        }`}
      >
        {message.message === "Thinking..." ? (
          <div className="flex items-center justify-center">
            <Loader2Icon
              className={`animate-spin h-5 w-5 ${
                isHuman ? "text-black" : "text-yellow-400"
              }`}
            />
          </div>
        ) : (
          <Markdown>{message.message}</Markdown>
        )}
      </div>

      {/* Human Avatar on the RIGHT */}
      {isHuman && (
        <div className="ml-3">
          {user?.imageUrl ? (
            <Image
              src={user.imageUrl}
              alt="User Avatar"
              width={40}
              height={40}
              className="rounded-full border border-yellow-400 shadow-sm"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-500 rounded-full" />
          )}
        </div>
      )}
    </div>
  );
}

export default ChatMessage;
