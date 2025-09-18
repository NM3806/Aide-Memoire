"use client";
import React from "react";
import { use } from "react";
import SideNav from "../../_components/SideNav";
import DocumentEditorSection from "../../_components/DocumentEditorSection";
import { Room } from "@/app/Room";

function WorkspaceDocument({ params }) {
  const resolvedParams = use(params);

  return (
    <Room params={resolvedParams}>
      <div className="flex">
        {/* Side Navigation */}
        <SideNav params={resolvedParams} />

        {/* Document Section */}
        <div className="flex-1 md:ml-72">
          <DocumentEditorSection params={resolvedParams} />
        </div>
      </div>
    </Room>
  );
}

export default WorkspaceDocument;