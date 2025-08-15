"use client";
import React, { use, useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from '@editorjs/header';
import Delimiter from '@editorjs/delimiter';
import Alert from 'editorjs-alert';
import List from "@editorjs/list";
import NestedList from '@editorjs/nested-list';
import Checklist from '@editorjs/checklist'
import Embed from '@editorjs/embed';
import SimpleImage from 'simple-image-editorjs';
import Table from '@editorjs/table'
import CodeTool from '@editorjs/code';
import { TextVariantTune } from '@editorjs/text-variant-tune';
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { useUser } from "@clerk/nextjs";

function RichDocumentEditor({ params }) {
  const editorRef = useRef(null);
  const { user } = useUser();
  const [documentOutput, setDocumentOutput] = useState([]);
  let isFetched = false;

  useEffect(() => {
    user && InitEditor();
    return () => {
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, [user]);

  const saveDocument = () => {
    editorRef.current.save()
      .then(async (outputData) => {
        const docRef = doc(db, 'DocumentOutput', params?.documentId);

        await updateDoc(docRef, {
          output: outputData,
          editedBy: user?.primaryEmailAddress?.emailAddress,

        })
      }
      )
  }

  const getDocumentOutput = () => {
    const unsubscribe = onSnapshot(doc(db, 'DocumentOutput', params?.documentId),
      (doc) => {
        if ((!isFetched) || doc.data()?.editedBy != user?.primaryEmailAddress?.emailAddress)
          doc.data()?.output && editorRef.current?.render(doc.data()?.output);

        isFetched = true;
      }
    )
  }

  const InitEditor = () => {
    if (!editorRef?.current) {
      editorRef.current = new EditorJS({
        onChange: (api, event) => {
          saveDocument();
        },
        onReady: () => {
          getDocumentOutput();
        },

        holder: "editorjs",
        tools: {
          header: Header,
          delimiter: Delimiter,
          alert: {
            class: Alert,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+A',
            config: {
              alertTypes: ['primary', 'secondary', 'info', 'success', 'warning', 'danger', 'light', 'dark'],
              defaultType: 'primary',
              messagePlaceholder: 'Enter something',
            }
          },
          table: Table,
          checklist: {
            class: Checklist,
            shortcut: 'CMD+SHIFT+C',
            inlineToolbar: true,
            toolbox: {
              title: 'Checklist',
            }
          },
          list: {
            class: List,
            shortcut: 'CMD+SHIFT+L',
            inlineToolbar: true,
            config: {
              defaultStyle: 'unordered'
            },
            toolbox: {
              title: 'Bullet List',
            }
          },

          image: SimpleImage,
          code: {
            class: CodeTool,
            shortcut: 'CMD+SHIFT+P'
          },

        },
      });
    }
  };

  return (
    <div className="lg:-ml-20 ">
      <div id="editorjs"></div>
    </div>
  );
}

export default RichDocumentEditor;
