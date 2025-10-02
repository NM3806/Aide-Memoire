"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { motion, AnimatePresence } from "framer-motion";

const fadeAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2, ease: "easeIn" },
};

function WorkspaceItemList({ workspaceList, view }) {
  const router = useRouter();
  const [localWorkspaceList, setLocalWorkspaceList] = useState([]);

  useEffect(() => {
    setLocalWorkspaceList(workspaceList);
  }, [workspaceList]);

  const onClickWorkspaceItem = (workspaceId) => {
    router.push("/workspace/" + workspaceId);
  };

  const deleteWorkspace = async (workspaceId) => {
    const originalList = [...localWorkspaceList];
    const updatedList = localWorkspaceList.filter(
      (workspace) => workspace.id !== workspaceId
    );
    setLocalWorkspaceList(updatedList);

    try {
      await deleteDoc(doc(db, "Workspace", workspaceId.toString()));
      toast.success("Workspace deleted.");
    } catch (error) {
      console.error("Error deleting workspace:", error);
      toast.error("Failed to delete workspace. Reverting change.");
      setLocalWorkspaceList(originalList);
    }
  };

  return (
    <div
      className={
        view === "grid"
          ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          : "flex flex-col gap-4"
      }
    >
      <AnimatePresence>
        {localWorkspaceList &&
          localWorkspaceList.map((workspace) => (
            <motion.div
              key={workspace.id}

              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="border rounded-xl bg-card shadow-md"
            >
              <AlertDialog>
                <div className="relative w-full h-full">

                  <AnimatePresence initial={false} mode="wait">
                    {view === "grid" ? (
                      // GRID VIEW
                      <motion.div
                        key="grid"
                        {...fadeAnimation}
                        className="cursor-pointer"
                        onClick={() => onClickWorkspaceItem(workspace.id)}
                      >
                        <Image
                          src={workspace?.coverImage}
                          width={400}
                          height={200}
                          alt="workspace cover"
                          className="h-[150px] w-full rounded-t-xl object-cover"
                        />
                        <div className="p-4 flex justify-between items-center rounded-b-xl">
                          <h2 className="flex gap-2 truncate font-medium text-card-foreground">
                            {workspace?.emoji} {workspace.workspaceName}
                          </h2>
                          <AlertDialogTrigger asChild>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="p-1 rounded-md hover:bg-destructive/10 transition-colors "
                            >
                              <Trash2 className="h-5 w-5 text-red-500" />
                            </button>
                          </AlertDialogTrigger>
                        </div>
                      </motion.div>
                    ) : (
                      // LIST VIEW
                      <motion.div
                        key="list"
                        {...fadeAnimation}
                        className="flex items-center gap-4 p-3"
                      >
                        <div
                          className="cursor-pointer flex-shrink-0"
                          onClick={() => onClickWorkspaceItem(workspace.id)}
                        >
                          <Image
                            src={workspace?.coverImage}
                            width={100}
                            height={60}
                            alt="workspace cover"
                            className="h-[60px] w-[100px] rounded-md object-cover"
                          />
                        </div>
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => onClickWorkspaceItem(workspace.id)}
                        >
                          <h2 className="flex gap-2 truncate font-medium text-card-foreground">
                            {workspace?.emoji} {workspace.workspaceName}
                          </h2>
                        </div>
                        <AlertDialogTrigger asChild>
                          <button className="p-1 rounded-md hover:bg-destructive/10 transition-colors cursor-pointer">
                            <Trash2 className="h-5 w-5 text-red-500" />
                          </button>
                        </AlertDialogTrigger>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <AlertDialogContent className="border-destructive/50">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-destructive">
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-red-500/90">
                      This action cannot be undone. This will permanently delete
                      your workspace and all associated documents.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className={"cursor-pointer"}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      onClick={() => deleteWorkspace(workspace.id)}
                      className={"cursor-pointer"}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}

export default WorkspaceItemList;