import React, { useState } from "react";
import DocumentHeader from "./DocumentHeader";
import DocumentInfo from "./DocumentInfo";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";
import CommentBox from "./CommentBox";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

const RichDocumentEditor = dynamic(() => import("./RichDocumentEditor"), {
  ssr: false,
});

function DocumentEditorSection({ params }) {
  const [openComments, setOpenComments] = useState(false);

  return (
    <div>
      {/* Header */}
      <DocumentHeader />

      {/* Document Info */}
      <DocumentInfo params={params} />

      {/* Rich Text Editor */}
      <div className="grid grid-cols-4">
        <div className="col-span-4">
          <RichDocumentEditor params={params} />
        </div>

        {/* Floating Comment Toggle Button */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="fixed right-5 bottom-5 cursor-pointer z-50"
        >
          <Button
            onClick={() => setOpenComments(!openComments)}
            className="rounded-full p-3 shadow-md bg-[#6C63FF] text-white hover:bg-[#5b54d6]"
          >
            {openComments ? <X /> : <MessageCircle />}
          </Button>
        </motion.div>

        {/* Floating Comment Window */}
        <AnimatePresence>
          {openComments && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25 }}
              className="fixed right-8 bottom-20 z-50"
            >
              <CommentBox onClose={() => setOpenComments(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default DocumentEditorSection;
