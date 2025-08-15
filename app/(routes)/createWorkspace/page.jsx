"use client"
import CoverPicker from '@/app/_components/CoverPicker';
import EmojiPickerComponent from '@/app/_components/EmojiPickerComponent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/config/firebaseConfig';
import { useAuth, useUser } from '@clerk/nextjs';
import { doc, setDoc } from 'firebase/firestore';
import { Loader2Icon, SmilePlus } from 'lucide-react';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import uuid4 from 'uuid4';

function CreateWorkspace() {
  const [coverImage, setCoverImage] = useState('/cover.jpg');
  const [workspaceName, setWorkspaceName] = useState();
  const [emoji, setEmoji] = useState();
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const { orgId } = useAuth();
  const router = useRouter();

  const onCreateWorkspace = async () => {
    setLoading(true);

    const workspaceId = Date.now();
    const result = await setDoc(doc(db, 'Workspace', workspaceId.toString()), {
      workspaceName: workspaceName,
      emoji: emoji,
      coverImage: coverImage,
      createdBy: user?.primaryEmailAddress?.emailAddress,
      id: workspaceId,
      orgId: orgId ? orgId : user?.primaryEmailAddress?.emailAddress,
    });

    const docId = uuid4();
    await setDoc(doc(db, 'WorkspaceDocuments', docId.toString()), {
      workspaceId: workspaceId,
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

    setLoading(false);
    router.replace('/workspace/' + workspaceId + '/' + docId);
  }

  return (
    <div className='p-10 py-28 md:px-36 lg:px-64 xl:px-96 '>
      <div className='shadow-2xl rounded-2xl'>
        {/* Cover Image */}
        <CoverPicker setNewCover={(img) => setCoverImage(img)}>
          <div className='relative group cursor-pointer'>
            <h2 className='hidden group-hover:flex absolute p-4 w-full h-full items-center justify-center'>
              <div className='z-10 font-semibold opacity-75'>
                Change Cover
              </div>
            </h2>
            <div className='group-hover:opacity-60'>
              <Image src={coverImage} width={400} height={400} alt='cover' unoptimized
                className='w-full h-[180px] object-cover rounded-t-2xl' />
            </div>
          </div>
        </CoverPicker>

        {/* Input Section */}
        <div className='pt-10 p-12'>
          <h2 className='font-medium text-xl'>Create a new Workspace</h2>
          <h2 className='text-sm mt-2'>
            Set up a collaborative workspace for your team. The name can be modified later.
          </h2>

          <div className='mt-8 flex gap-2 items-center'>
            <EmojiPickerComponent setEmojiIcon={(value) => setEmoji(value)}>
              <Button variant={'outline'}>
                {emoji ? emoji : <SmilePlus />}
              </Button>
            </EmojiPickerComponent>
            <Input placeholder="Workspace name"
              onChange={(e) => setWorkspaceName(e.target.value)}
            />
          </div>
          <div className='mt-7 flex justify-end gap-4'>
            <Button disabled={!workspaceName?.length || loading}
              onClick={onCreateWorkspace} className="cursor-pointer"
            >
              Create {loading && <Loader2Icon className='animate-spin ml-2' />}
            </Button>
            <Button variant={'outline'} className="cursor-pointer">Cancel</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateWorkspace