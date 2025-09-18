"use client";

import React from "react";
import { use } from "react";  
import SideNav from "../_components/SideNav";

function Workspace({ params }) {
  const resolvedParams = use(params);

  return (
    <div className="flex">
      <SideNav params={resolvedParams} />
      <div className="flex-1 md:ml-72 p-6">
        <h1 className="text-xl font-semibold">Workspace Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Select a document from the sidebar to begin editing.
        </p>
      </div>
    </div>
  );
}

export default Workspace;
