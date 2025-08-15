import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
import DocumentOptions from './DocumentOptions';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { toast } from 'sonner';

function DocumentList({ documentList, params }) {
  const router = useRouter();

  const deleteDocument = async (docId) => {
    await deleteDoc(doc(db, 'WorkspaceDocuments', docId));
    toast("Document deleted.");
  }

  return (
    <div>
      {documentList.map((doc, index) => (
        <div key={index}
          onClick={() => router.push('/workspace/' + params?.workspaceId + '/' + doc?.id)}
          className={`mt-3 p-2 px-3 hover:bg-amber-100 rounded-lg 
            cursor-pointer flex justify-between items-center 
            ${doc?.id == params?.documentId && 'bg-white'}`}
        >
          <div className='flex gap-2 items-center'>
            {
              !doc.emoji &&
              <Image src={'/amdoc2.png'} width={20} height={20} alt='logo-document' unoptimized className='p-0.5' />
            }
            <h2 className='flex gap-2'>{doc?.emoji} {doc.documentName}</h2>
          </div>

          <DocumentOptions doc={doc} deleteDocument={(docId)=>deleteDocument(docId)}/>
        </div>
      ))}   
    </div>
  )
}

export default DocumentList