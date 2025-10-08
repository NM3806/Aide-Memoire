import React, { useState, useRef } from "react";
import DocumentHeader from "./DocumentHeader";
import DocumentInfo from "./DocumentInfo";
import { Button } from "@/components/ui/button";
import { MessageCircle, Sparkles, X } from "lucide-react";
import CommentBox from "./CommentBox";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import GenerateAITemplate from "./GenerateAITemplate";

const RichDocumentEditor = dynamic(() => import("./RichDocumentEditor"), {
  ssr: false,
});

function DocumentEditorSection({ params }) {
  const [openComments, setOpenComments] = useState(false);
  const editorRef = useRef(null);

  const appendAiOutput = (output) => {
    if (!editorRef.current || !output.blocks || output.blocks.length === 0) {
      console.error("Editor is not ready or AI output is empty.");
      return;
    }
    const currentIndex = editorRef.current.blocks.getCurrentBlockIndex();
    const currentBlock = editorRef.current.blocks.get(currentIndex);
    const isEmptyPlaceholder = currentBlock.isEmpty && currentBlock.name === 'paragraph';

    output.blocks.forEach((block, index) => {
      editorRef.current.blocks.insert(
        block.type,
        block.data,
        {},
        (isEmptyPlaceholder ? currentIndex : currentIndex + 1) + index,
        true
      );
    });

    if (isEmptyPlaceholder) {
      editorRef.current.blocks.delete(currentIndex + output.blocks.length);
    }
  };

  return (
    <div>
      <DocumentHeader />

      <div className="p-1">
        <DocumentInfo params={params} />

        <div className="grid grid-cols-4">
          <div className="col-span-4">
            <RichDocumentEditor params={params} editorRef={editorRef} />
          </div>

          {/* === Floating Actions === */}
          <div className="fixed left-5 bottom-5 md:left-[calc(theme(spacing.72)+theme(spacing.5))] z-50">
            <GenerateAITemplate setGenerateAIOutput={appendAiOutput} />
          </div>

          {/* Comment Button remains at the bottom-right */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="fixed right-5 bottom-5 z-50"
          >
            <Button
              onClick={() => setOpenComments(!openComments)}
              className="rounded-full h-12 w-12 p-3 shadow-md bg-[#6C63FF] text-white hover:bg-[#5b54d6] cursor-pointer"
            >
              {openComments ? <X /> : <MessageCircle />}
            </Button>
          </motion.div>

          <AnimatePresence>
            {openComments && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.25 }}
                className="fixed right-8 bottom-20 z-40"
              >
                <CommentBox onClose={() => setOpenComments(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default DocumentEditorSection;