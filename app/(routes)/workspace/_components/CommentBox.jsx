"use client";
import { useThreads } from "@liveblocks/react";
import { Composer, Thread } from "@liveblocks/react-ui";
import React from "react";

function CommentBox({ onClose }) {
  const { threads } = useThreads();

  return (
    <div className="w-[320px] h-[400px] bg-white shadow-2xl rounded-2xl border border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-3 py-2 border-b bg-[#6C63FF]/10">
        <span className="font-medium text-sm text-[#6C63FF]">Comments</span>
      </div>

      {/* Threads */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {threads?.map((thread) => (
          <Thread key={thread.id} thread={thread} />
        ))}
      </div>

      {/* Composer */}
      <div className="border-t p-2">
        <Composer />
      </div>
    </div>
  );
}

export default CommentBox;
