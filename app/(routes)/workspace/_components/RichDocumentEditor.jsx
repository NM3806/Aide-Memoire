"use client";
import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Delimiter from "@editorjs/delimiter";
import Alert from "editorjs-alert";
import List from "@editorjs/list";
import Checklist from "@editorjs/checklist";
import SimpleImage from "simple-image-editorjs";
import Table from "@editorjs/table";
import CodeTool from "@editorjs/code";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { useUser } from "@clerk/nextjs";
import GenerateAITemplate from "./GenerateAITemplate";

function RichDocumentEditor({ params }) {
  const editorRef = useRef(null);
  const { user } = useUser();
  const isFetched = useRef(false);

  const appendAiOutput = (output) => {
    if (!editorRef.current || !output.blocks || output.blocks.length === 0) {
      console.error("Editor is not ready or AI output is empty.");
      return;
    }
    const lastBlockIndex = editorRef.current.blocks.getBlocksCount();

    output.blocks.forEach((block, index) => {
      editorRef.current.blocks.insert(
        block.type,
        block.data,
        {},
        lastBlockIndex + index,
        false
      );
    });
  };

  useEffect(() => {
    if (user) InitEditor();
    return () => {
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, [user]);

  const saveDocument = () => {
    editorRef.current
      ?.save()
      .then(async (outputData) => {
        const docRef = doc(db, "DocumentOutput", params?.documentId);
        await updateDoc(docRef, {
          output: JSON.stringify(outputData),
          editedBy: user?.primaryEmailAddress?.emailAddress,
        });
      })
      .catch((err) => console.error("Save failed:", err));
  };

  const getDocumentOutput = () => {
    return onSnapshot(doc(db, "DocumentOutput", params?.documentId), (docSnap) => {
      if (
        (!isFetched.current ||
          docSnap.data()?.editedBy !== user?.primaryEmailAddress?.emailAddress) &&
        docSnap.data()?.output
      ) {
        editorRef.current?.render(JSON.parse(docSnap.data()?.output));
      }
      isFetched.current = true;
    });
  };

  const InitEditor = () => {
    if (!editorRef.current) {
      editorRef.current = new EditorJS({
        holder: "editorjs",
        onChange: () => {
          saveDocument();
        },
        onReady: () => {
          getDocumentOutput();
        },
        tools: {
          header: Header,
          delimiter: Delimiter,
          alert: {
            class: Alert,
            inlineToolbar: true,
            shortcut: "CMD+SHIFT+A",
            config: {
              alertTypes: [
                "primary",
                "secondary",
                "info",
                "success",
                "warning",
                "danger",
                "light",
                "dark",
              ],
              defaultType: "primary",
              messagePlaceholder: "Enter something",
            },
          },
          table: Table,
          checklist: {
            class: Checklist,
            shortcut: "CMD+SHIFT+C",
            inlineToolbar: true,
            toolbox: {
              title: "Checklist",
            },
          },
          list: {
            class: List,
            shortcut: "CMD+SHIFT+L",
            inlineToolbar: true,
            config: {
              defaultStyle: "unordered",
            },
            toolbox: {
              title: "Bullet List",
            },
          },
          image: SimpleImage,
          code: {
            class: CodeTool,
            shortcut: "CMD+SHIFT+P",
          },
        },
      });
    }
  };

  return (
    <div className="lg:-ml-20">
      <div id="editorjs"></div>
      <div className="fixed bottom-10 md:ml-80 left-0 z-10">
        <GenerateAITemplate
          setGenerateAIOutput={appendAiOutput}
        />
      </div>
    </div>
  );
}

export default RichDocumentEditor;