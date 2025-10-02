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
import { motion, AnimatePresence } from "framer-motion";

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

    const workspaces = [];
    querySnapshot.forEach((doc) => {
      workspaces.push({ ...doc.data(), id: doc.id });
    });
    setWorkspaceList(workspaces);
  };

  const listAnimationVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
    transition: { duration: 0.25, ease: "easeInOut" },
  };

  return (
    <div className="my-12 px-6 md:px-16 lg:px-28">
      {/* Greeting + New workspace */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex justify-between items-center"
      >
        <h2 className="font-bold text-3xl tracking-tight">
          👋 Hi, {user?.firstName || user?.fullName}
        </h2>
        <Link href={"/createWorkspace"}>
          <Button className="cursor-pointer flex items-center gap-2 bg-[#6C63FF] hover:bg-[#5850e0] transition-colors duration-200">
            <Plus className="w-4 h-4" /> New Workspace
          </Button>
        </Link>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex justify-between items-center mt-10"
      >
        <h3 className="font-medium text-lg">Your Workspaces</h3>
        <div className="flex gap-1 p-1 rounded-lg bg-muted ">
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded-md transition-colors cursor-pointer duration-300 ${
              view === "grid"
                ? "bg-background shadow text-[#6C63FF]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded-md transition-colors cursor-pointer duration-300 ${
              view === "list"
                ? "bg-background shadow text-[#6C63FF]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <AlignLeft className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      {/* Workspaces */}
      {workspaceList?.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex flex-col items-center justify-center mt-16 p-10 border-2 border-dashed rounded-xl bg-muted/30"
        >
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
        </motion.div>
      ) : (
        <div className="mt-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={view}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={listAnimationVariants}
            >
              <WorkspaceItemList workspaceList={workspaceList} view={view} />
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default WorkspaceList;