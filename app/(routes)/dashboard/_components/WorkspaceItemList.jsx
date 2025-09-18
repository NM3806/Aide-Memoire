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

function WorkspaceItemList({ workspaceList }) {
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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-col-4 gap-6 mt-6">
      {localWorkspaceList &&
        localWorkspaceList.map((workspace, index) => (
          <AlertDialog key={index}>
            <div className="border shadow-xl rounded-xl hover:scale-105 transition-all">
              <div
                onClick={() => onClickWorkspaceItem(workspace.id)}
                className="cursor-pointer"
              >
                <Image
                  src={workspace?.coverImage}
                  width={400}
                  height={200}
                  alt="workspace cover"
                  className="h-[150px] object-cover rounded-t-xl"
                />
              </div>
              <div className="p-4 rounded-b-xl flex justify-between items-center">
                <h2 className="flex gap-2 truncate">
                  {workspace?.emoji} {workspace.workspaceName}
                </h2>

                <AlertDialogTrigger asChild>
                  <Trash2 className="h-5 w-5 text-red-500 cursor-pointer" />
                </AlertDialogTrigger>
              </div>
            </div>

            <AlertDialogContent className="border-destructive/50">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-destructive">
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-red-500/90"> 
                  This action cannot be undone. This will permanently delete your
                  workspace and all associated documents.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction variant="destructive" onClick={() => deleteWorkspace(workspace.id)}> 
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