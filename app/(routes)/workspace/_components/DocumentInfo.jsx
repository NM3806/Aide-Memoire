"use client"
import CoverPicker from '@/app/_components/CoverPicker'
import EmojiPickerComponent from '@/app/_components/EmojiPickerComponent';
import { db } from '@/config/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { SmilePlus } from 'lucide-react';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

function DocumentInfo({ params }) {
    const [coverImage, setCoverImage] = useState('/cover.jpg');
    const [emoji, setEmoji] = useState();
    const [documentInfo, setDocumentInfo] = useState();

    useEffect(() => {
        params && getDocumentInfo();
    }, [params])

    const getDocumentInfo = async () => {
        const docRef = doc(db, 'WorkspaceDocuments', params?.documentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setDocumentInfo(docSnap.data());
            setEmoji(docSnap.data()?.emoji);
            docSnap.data()?.coverImage && setCoverImage(docSnap.data()?.coverImage);
        }
    }

    const updateDocumentInfo = async (key, value) => {
        const docRef = doc(db, "WorkspaceDocuments", params?.documentId);
        await updateDoc(docRef, {
            [key]: value
        })

        toast('Document updated!');
    }
    return (
        <div>
            {/* Cover  */}
            <CoverPicker setNewCover={(cover) => {
                setCoverImage(cover);
                updateDocumentInfo('coverImage', cover);
            }}>
                <div className='relative group cursor-pointer'>
                    <h2 className='hidden group-hover:flex absolute p-4 w-full h-full items-center justify-center'>
                        <div className='z-10 font-semibold opacity-75'>
                            Change Cover
                        </div>
                    </h2>
                    <div className='group-hover:opacity-60'>
                        <Image src={coverImage} width={400} height={400} alt='cover' unoptimized
                            className='w-full h-[200px] object-cover rounded-t-2xl' />
                    </div>
                </div>
            </CoverPicker>

            {/* Emoji Picker  */}
            <div className='absolute ml-10 mt-[-40px] cursor-pointer'>
                <EmojiPickerComponent setEmojiIcon={(emoji) => {
                    setEmoji(emoji);
                    updateDocumentInfo('emoji', emoji);
                }}>
                    <div className='bg-[#ffffffb0] p-4 rounded-full '>
                        {emoji ? <span className='text-4xl'>{emoji}</span> : <SmilePlus className='h-10 w-10 text-gray-500 ' />}
                    </div>
                </EmojiPickerComponent>
            </div>

            {/* File Name  */}
            <div className='mt-5 p-10 ml-10'>
                <input type="text"
                    placeholder='Untitled Document'
                    defaultValue={documentInfo?.documentName}
                    className='font-bold outline-none text-4xl'
                    onBlur={(e) => updateDocumentInfo('documentName', e.target.value)}
                />
            </div>
        </div>
    )
}

export default DocumentInfo