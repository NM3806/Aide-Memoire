"use client"
import React, { useEffect, useState } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button';
import { AlignLeft, LayoutGrid } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import WorkspaceItemList from './WorkspaceItemList';
import { collection, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';

function WorkspaceList() {
    const { user } = useUser();
    const { orgId } = useAuth();
    const [workspaceList, setWorkspaceList] = useState([]);

    useEffect(() => {
        user && getWorkspaceList()
    }, [orgId, user])

    const getWorkspaceList = async () => {
        setWorkspaceList([]);
        
        const q = query(collection(db, 'Workspace'),
            where('orgId', '==', orgId ? orgId : user?.primaryEmailAddress?.emailAddress)
        )
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            setWorkspaceList(prev => [...prev, doc.data()])
        })
    }

    return (
        <div className='my-10 p-10 md:px-24 lg:px-36 xl:px-52'>
            <div className='flex justify-between'>
                <h2 className='font-bold text-2xl'>Hi, {user?.fullName}</h2>
                <Link href={'/createWorkspace'}>
                    <Button className='cursor-pointer'>+</Button>
                </Link>
            </div>
            <div className='flex justify-between mt-10'>
                <div>
                    <h2 className='font-medium '>Workspaces</h2>
                </div>
                <div className='flex gap-2'>
                    <LayoutGrid />
                    <AlignLeft />
                </div>
            </div>

            {workspaceList?.length == 0 ?
                <div className='flex flex-col justify-center items-center'>
                    <Image src={'/workspace2.png'} unoptimized
                        width={200} height={200} alt='workspace' />

                    <h2>Create a new workspace</h2>

                    <Link href={'/createWorkspace'}>
                        <Button className="my-3 cursor-pointer">
                            + New Workspace
                        </Button>
                    </Link>
                </div>
                :
                <div>
                    <WorkspaceItemList workspaceList={workspaceList}/>
                </div>
            }
        </div>
    )
}

export default WorkspaceList