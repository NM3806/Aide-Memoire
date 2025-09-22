import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import DocumentOptions from "./DocumentOptions";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { toast } from "sonner";
import { motion } from "framer-motion";

function DocumentList({ documentList, params }) {
  const router = useRouter();

  const deleteDocument = async (docId) => {
    await deleteDoc(doc(db, "WorkspaceDocuments", docId));
    toast("Document deleted.");

    if (params?.documentId === docId) {
      router.push(`/workspace/${params?.workspaceId}`);
    }
  };


  return (
    <div className="mt-4 space-y-2">
      {documentList.length === 0 && (
        <p className="text-sm text-gray-500 italic text-center">
          No documents yet. Create one to get started!
        </p>
      )}

      {documentList.map((doc, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() =>
            router.push(`/workspace/${params?.workspaceId}/${doc?.id}`)
          }
          className={`group p-3 rounded-xl cursor-pointer flex justify-between items-center transition-all
            ${doc?.id === params?.documentId
              ? "bg-[#6C63FF]/10 border border-[#6C63FF]"
              : "hover:bg-gray-100"
            }`}
        >
          {/* Left side */}
          <div className="flex gap-2 items-center">
            {!doc.emoji && (
              <Image
                src={"/amdoc2.png"}
                width={22}
                height={22}
                alt="document-logo"
                unoptimized
                className="p-0.5 opacity-80 group-hover:opacity-100"
              />
            )}
            <h2
              className={`flex gap-2 text-sm font-medium truncate ${doc?.id === params?.documentId
                  ? "text-[#6C63FF]"
                  : "text-gray-700 group-hover:text-gray-900"
                }`}
            >
              {doc?.emoji} {doc.documentName}
            </h2>
          </div>

          {/* Right side (options) */}
          <DocumentOptions
            doc={doc}
            deleteDocument={(docId) => deleteDocument(docId)}
          />
        </motion.div>
      ))}
    </div>
  );
}

export default DocumentList;
