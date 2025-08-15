"use client"
import Logo from '@/app/_components/Logo'
import { Button } from '@/components/ui/button'
import { collection, doc, onSnapshot, query, setDoc, where } from 'firebase/firestore'
import { Bell, Loader2Icon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import DocumentList from './DocumentList'
import { db } from '@/config/firebaseConfig'
import uuid4 from 'uuid4'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

function SideNav({ params }) {
    const MAX_FILES = Number(5);
    const { user } = useUser();
    const router = useRouter();
    const [documentList, setDocumentList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        params && getDocumentList();
    }, [params]);

    const getDocumentList = () => {
        const q = query(collection(db, 'WorkspaceDocuments'),
            where("workspaceId", "==", Number(params?.workspaceId)));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setDocumentList([]);

            querySnapshot.forEach((doc) => {
                setDocumentList(documentList => [...documentList, doc.data()])
            })
        })
    }

    const createNewDocument = async () => {
        if (documentList?.length >= MAX_FILES) {
            toast("Upgrade your plan to add a new file", {
                description: "Upgrade your plan for unlimited access",
                action: {
                    label: "Upgrade",
                    // onClick: () => console.log("Undo"),
                },
            })
            return;
        }

        setLoading(true);
        const docId = uuid4();

        await setDoc(doc(db, 'WorkspaceDocuments', docId.toString()), {
            workspaceId: Number(params?.workspaceId),
            createdBy: user?.primaryEmailAddress?.emailAddress,
            coverImage: null,
            emoji: null,
            id: docId,
            documentName: "Untitled Document",
            documentOutput: [],
        })

        await setDoc(doc(db, 'DocumentOutput', docId.toString()), {
            docId: docId,
            output: [],
        })

        toast("New document created!");

        setLoading(false);
        router.replace('/workspace/' + params?.workspaceId + '/' + docId);
    }

    return (
        <div className='h-screen md:w-72 hidden md:block fixed bg-[#FFF9F0] p-5 shadow-md'>
            <div className='flex justify-between items-center '>
                <Logo />

                <Bell className='h-5 w-5 text-gray-500 ' />
            </div>
            <hr className='my-5'></hr>
            <div>
                <div className='flex justify-between items-center'>
                    <h2 className='font-medium'>Workspace Name</h2>
                    <Button size={"sm"} className='cursor-pointer'
                        onClick={createNewDocument}
                    >
                        {loading ? <Loader2Icon className='h-4 w-4 animate-spin' /> : '+'}
                    </Button>
                </div>
            </div>

            {/* Document List */}
            <DocumentList documentList={documentList} params={params} />

            {/* Progress Bar */}
            <div className='absolute bottom-10 w-[85%]'>
                <Progress value={documentList?.length * 100 / MAX_FILES} />
                <h2 className='text-sm font-light my-2'>
                    <strong>{documentList?.length}</strong> out of <strong>5</strong> files used
                </h2>
                <h2 className='text-xs font-light'>
                    <strong>Upgrade your plan for unlimited access</strong>
                </h2>
            </div>
        </div>
    )
}

export default SideNav