"use client"
import React, { useEffect } from 'react'
import { use } from 'react';
import SideNav from '../../_components/SideNav'
import DocumentEditorSection from '../../_components/DocumentEditorSection';
import { Room } from '@/app/Room';

function WorkspaceDocument({ params }) {
  const resolvedParams = use(params);
  return (
    <Room params={resolvedParams} >
      <div>
        {/* SideNav */}
        <div className="">
          <SideNav params={resolvedParams} />
        </div>

        {/* Documents */}
        <div className='md:ml-72'>
          <DocumentEditorSection params={resolvedParams} />
        </div>
      </div>
    </Room>
  )
}

export default WorkspaceDocument