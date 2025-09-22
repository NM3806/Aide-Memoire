"use client";

import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import uuid4 from "uuid4";
import { toast } from "sonner";

export default function useCreateDocument(workspaceId, MAX_FILES, documentList) {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const createNewDocument = async () => {
    if (documentList?.length >= MAX_FILES) {
      toast("Upgrade your plan to add a new file", {
        description: "Upgrade your plan for unlimited access",
        action: { label: "Upgrade" },
      });
      return;
    }

    try {
      setLoading(true);
      const docId = uuid4();

      await setDoc(doc(db, "WorkspaceDocuments", docId.toString()), {
        workspaceId: Number(workspaceId),
        createdBy: user?.primaryEmailAddress?.emailAddress,
        coverImage: null,
        emoji: null,
        id: docId,
        documentName: "Untitled Document",
        documentOutput: [],
        createdAt: Date.now(),
      });

      await setDoc(doc(db, "DocumentOutput", docId.toString()), {
        docId: docId,
        output: [],
      });

      toast("New document created!", {
        action: {
          onClick: () => router.replace(`/workspace/${workspaceId}/${docId}`),
        },
      });

      router.replace(`/workspace/${workspaceId}/${docId}`);
    } catch (error) {
      console.error("Error creating document:", error);
      toast("Failed to create document. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return { createNewDocument, loading };
}