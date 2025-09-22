"use client";

import React, { useState } from "react";
import { use } from "react";
import SideNav from "../_components/SideNav";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import useCreateDocument from "@/app/hooks/useCreateDocument";

function Workspace({ params }) {
  const resolvedParams = use(params);

  const MAX_FILES = 5;
  const [documentList, setDocumentList] = useState([]); // optional, can come from context
  const { createNewDocument, loading: creating } = useCreateDocument(
    resolvedParams?.workspaceId,
    MAX_FILES,
    documentList
  );

  return (
    <div className="flex">
      {/* Sidebar */}
      <SideNav params={resolvedParams} />

      {/* Main Content */}
      <div className="flex-1 md:ml-72 p-8 bg-gradient-to-br from-white via-[#F9F9FF] to-[#F3F1FF] min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-semibold tracking-tight text-gray-800"
          >
            Workspace Dashboard
          </motion.h1>

          <Button
            onClick={createNewDocument}
            disabled={creating}
            className="flex items-center gap-2 bg-[#6C63FF] hover:bg-[#5b54d6] text-white rounded-xl shadow-md cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            {creating ? "Creating..." : "New Document"}
          </Button>

        </div>

        {/* Illustration Section */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full flex flex-col items-center justify-center text-center m-4"
        >
          <Image
            src="/undraw_ideas-flow.svg"
            alt="Character illustration"
            width={350}
            height={350}
            priority
            className="drop-shadow-lg"
          />

          <p className="text-gray-500 mt-4 max-w-md">
            Select a document from the sidebar to begin editing or create a new one.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Workspace;
