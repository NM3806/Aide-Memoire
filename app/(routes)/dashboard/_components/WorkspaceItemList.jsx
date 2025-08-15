import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

function WorkspaceItemList({ workspaceList }) {
    const router = useRouter();
    const onClickWorkspaceItem = (workspaceId) => {
        router.push('/workspace/' + workspaceId)
    }

    const deleteWorkspace = async (workspaceId) => {
        try {
            await deleteDoc(doc(db, 'Workspace', workspaceId));
            toast.success("Workspace deleted.");
        } catch (error) {
            console.error("Error deleting workspace:", error);
            toast.error("Failed to delete workspace.");
        }
    };


    return (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-col-4 gap-6 mt-6'>
            {workspaceList && workspaceList.map((workspace, index) => (
                <div key={index}
                    className='border shadow-xl rounded-xl hover:scale-105 transition-all cursor-pointer'
                    onClick={() => onClickWorkspaceItem(workspace.id)}
                >
                    <Image src={workspace?.coverImage}
                        width={400} height={200} alt='workspace cover'
                        className='h-[150px] object-cover rounded-t-xl'
                    />
                    <div className='p-4 rounded-b-xl flex justify-between items-center'>
                        <h2 className='flex gap-2'>{workspace?.emoji} {workspace.workspaceName}</h2>
                        <Trash2
                            className='h-5 w-5 text-red-500 cursor-pointer'
                            onClick={(e) => {
                                e.stopPropagation(); // prevent card click navigation
                                deleteWorkspace(workspace.id);
                            }}
                        />
                    </div>

                </div>
            ))}
        </div>
    )
}

export default WorkspaceItemList