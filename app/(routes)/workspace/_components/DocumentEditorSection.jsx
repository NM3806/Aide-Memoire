import React, { useState } from 'react'
import DocumentHeader from './DocumentHeader'
import DocumentInfo from './DocumentInfo'
import { Button } from '@/components/ui/button'
import { MessageCircle, X } from 'lucide-react'
import CommentBox from './CommentBox'
import dynamic from "next/dynamic";

const RichDocumentEditor = dynamic(
  () => import("./RichDocumentEditor"),
  { ssr: false }
);

function DocumentEditorSection({ params }) {
  const [openComments, setOpenComments] = useState(false);

  return (
    <div>
      {/* Header */}
      <DocumentHeader />

      {/* Document Info */}
      <DocumentInfo params={params} />

      {/* Rich Text Editor */}
      <div className='grid grid-cols-4'>
        <div className='col-span-3'>
          <RichDocumentEditor params={params} />

          <div className='fixed right-5 bottom-5'>
            <Button
              onClick={() => setOpenComments(!openComments)}
              className='cursor-pointer'
            >
              {openComments ? <X /> : <MessageCircle />}
            </Button>
            {openComments && <CommentBox />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentEditorSection;
