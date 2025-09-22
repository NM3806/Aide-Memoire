"use client";
import Logo from "@/app/_components/Logo";
import { Button } from "@/components/ui/button";
import {
    collection,
    doc,
    onSnapshot,
    query,
    setDoc,
    where,
} from "firebase/firestore";
import { Bell, Loader2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";
import DocumentList from "./DocumentList";
import { db } from "@/config/firebaseConfig";
import uuid4 from "uuid4";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import NotificationBox from "./NotificationBox";
import Link from "next/link";
import { motion } from "framer-motion";
import useCreateDocument from "@/app/hooks/useCreateDocument";

function SideNav({ params }) {
    const MAX_FILES = 5;
    const { user } = useUser();
    const router = useRouter();
    const [documentList, setDocumentList] = useState([]);
    const [workspaceInfo, setWorkspaceInfo] = useState(null);

    const { createNewDocument, loading: creating } = useCreateDocument(
        params?.workspaceId,
        MAX_FILES,
        documentList
    );

    useEffect(() => {
        if (!params) return;
        getDocumentList();
        getWorkspaceInfo();
    }, [params]);

    const getWorkspaceInfo = () => {
        if (!params?.workspaceId) return;
        const docRef = doc(db, "Workspace", params.workspaceId.toString());

        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setWorkspaceInfo(docSnap.data());
            }
        });

        return () => unsubscribe();
    };

    const getDocumentList = () => {
        const q = query(
            collection(db, "WorkspaceDocuments"),
            where("workspaceId", "==", Number(params?.workspaceId))
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const docs = [];
            querySnapshot.forEach((doc) => docs.push(doc.data()));
            setDocumentList(docs);
        });

        return () => unsubscribe();
    };


    return (
        <motion.div
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="h-screen md:w-72 hidden md:block fixed bg-white border-r border-gray-200 p-5 shadow-sm"
        >
            {/* Top Section */}
            <div className="flex justify-between items-center">
                <Link href="/dashboard" className="cursor-pointer">
                    <Logo />
                </Link>

                {params?.documentId && (
                    <NotificationBox params={params}>
                        <Bell className="h-5 w-5 text-gray-500 cursor-pointer" />
                    </NotificationBox>
                )}
            </div>

            <hr className="my-5 border-gray-200" />

            {/* Workspace Info */}
            <div className="flex justify-between items-center">
                {!workspaceInfo ? (
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                    <h2 className="font-medium truncate text-gray-800">
                        {workspaceInfo?.emoji} {workspaceInfo?.workspaceName}
                    </h2>
                )}

                <Button
                    size="sm"
                    className="cursor-pointer bg-[#6C63FF] hover:bg-[#5b54d6] text-white rounded-lg"
                    onClick={createNewDocument}
                >
                    {creating ? <Loader2Icon className="h-4 w-4 animate-spin" /> : "+"}
                </Button>
            </div>

            {/* Document List */}
            <DocumentList documentList={documentList} params={params} />
            {documentList.length === 0 && (
                <p className="text-gray-500 text-sm mt-4 italic">
                    No documents yet. Create your first one!
                </p>
            )}

            {/* Progress Bar */}
            <div className="absolute bottom-10 w-[85%]">
                <Progress
                    value={(documentList?.length * 100) / MAX_FILES}
                    className="bg-gray-200"
                />
                <h2 className="text-sm font-light my-2 text-gray-600">
                    <strong>{documentList?.length}</strong> out of{" "}
                    <strong>{MAX_FILES}</strong> files used
                </h2>
                <h2 className="text-xs font-light text-[#6C63FF]"> <strong>Upgrade your plan for unlimited access</strong> </h2>
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-[#6C63FF] text-[#6C63FF] hover:bg-[#f4f3ff] cursor-pointer"
                >
                    Upgrade Plan
                </Button>
            </div>
        </motion.div>
    );
}

export default SideNav;