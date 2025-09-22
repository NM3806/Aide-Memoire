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
          ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6"
          : "flex flex-col gap-4 mt-6"
      }
    >
      {localWorkspaceList &&
        localWorkspaceList.map((workspace, index) => (
          <AlertDialog key={index}>
            <div
              className={`border shadow-md hover:shadow-lg rounded-xl transition-all ${
                view === "list" ? "flex items-center gap-4 p-3" : ""
              }`}
            >
              <div
                onClick={() => onClickWorkspaceItem(workspace.id)}
                className="cursor-pointer flex-shrink-0"
              >
                <Image
                  src={workspace?.coverImage}
                  width={view === "list" ? 100 : 400}
                  height={view === "list" ? 60 : 200}
                  alt="workspace cover"
                  className={`object-cover ${
                    view === "list"
                      ? "h-[60px] w-[100px] rounded-md"
                      : "h-[150px] w-full rounded-t-xl"
                  }`}
                />
              </div>

              <div
                className={`p-4 flex justify-between items-center ${
                  view === "list" ? "flex-1" : "rounded-b-xl"
                }`}
              >
                <h2 className="flex gap-2 truncate font-medium">
                  {workspace?.emoji} {workspace.workspaceName}
                </h2>

                <AlertDialogTrigger asChild>
                  <Trash2 className="h-5 w-5 text-red-500 cursor-pointer" />
                </AlertDialogTrigger>
              </div>
            </div>

            {/* Confirm delete */}
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
                <AlertDialogCancel className={"cursor-pointer"}>Cancel</AlertDialogCancel>
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
        ))}
    </div>
  );
}

export default WorkspaceItemList;