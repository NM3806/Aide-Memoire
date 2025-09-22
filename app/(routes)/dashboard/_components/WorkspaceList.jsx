"use client";
import React, { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { LayoutGrid, AlignLeft, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import WorkspaceItemList from "./WorkspaceItemList";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";

function WorkspaceList() {
  const { user } = useUser();
  const { orgId } = useAuth();
  const [workspaceList, setWorkspaceList] = useState([]);
  const [view, setView] = useState("grid");

  useEffect(() => {
    user && getWorkspaceList();
  }, [orgId, user]);

  const getWorkspaceList = async () => {
    setWorkspaceList([]);
    const q = query(
      collection(db, "Workspace"),
      where("orgId", "==", orgId ? orgId : user?.primaryEmailAddress?.emailAddress)
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      setWorkspaceList((prev) => [...prev, doc.data()]);
    });
  };

  return (
    <div className="my-12 px-6 md:px-16 lg:px-28">
      {/* Greeting + New workspace */}
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-3xl tracking-tight">
          👋 Hi, {user?.firstName || user?.fullName}
        </h2>
        <Link href={"/createWorkspace"}>
          <Button className="cursor-pointer flex items-center gap-2 bg-[#6C63FF] hover:bg-[#5850e0] transition-colors">
            <Plus className="w-4 h-4" /> New Workspace
          </Button>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center mt-10">
        <h3 className="font-medium text-lg">Your Workspaces</h3>
        <div className="flex gap-3 text-muted-foreground">
          <LayoutGrid
            className={`w-5 h-5 cursor-pointer transition ${
              view === "grid" ? "text-[#6C63FF]" : "hover:text-foreground"
            }`}
            onClick={() => setView("grid")}
          />
          <AlignLeft
            className={`w-5 h-5 cursor-pointer transition ${
              view === "list" ? "text-[#6C63FF]" : "hover:text-foreground"
            }`}
            onClick={() => setView("list")}
          />
        </div>
      </div>

      {/* Workspaces */}
      {workspaceList?.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-16 p-10 border-2 border-dashed rounded-xl bg-muted/30">
          <Image
            src={"/workspace2.png"}
            unoptimized
            width={200}
            height={200}
            alt="workspace"
          />
          <h2 className="mt-4 text-lg font-medium">
            You don’t have any workspaces yet
          </h2>
          <p className="text-muted-foreground text-sm mt-1 max-w-xs text-center">
            Create a new workspace to start collaborating with your team.
          </p>
          <Link href={"/createWorkspace"}>
            <Button className="mt-5 cursor-pointer bg-[#6C63FF] hover:bg-[#5850e0] transition-colors">
              <Plus className="w-4 h-4 mr-2" /> New Workspace
            </Button>
          </Link>
        </div>
      ) : (
        <div className="mt-8">
          <WorkspaceItemList workspaceList={workspaceList} view={view} />
        </div>
      )}
    </div>
  );
}

export default WorkspaceList;