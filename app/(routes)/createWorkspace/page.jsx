"use client";
import CoverPicker from "@/app/_components/CoverPicker";
import EmojiPickerComponent from "@/app/_components/EmojiPickerComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/config/firebaseConfig";
import { useAuth, useUser } from "@clerk/nextjs";
import { doc, setDoc } from "firebase/firestore";
import { SmilePlus, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import uuid4 from "uuid4";
import { toast } from "sonner";

function CreateWorkspace() {
  const [coverImage, setCoverImage] = useState("/cover.jpg");
  const [workspaceName, setWorkspaceName] = useState("");
  const [emoji, setEmoji] = useState();
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useUser();
  const { orgId } = useAuth();
  const router = useRouter();

  const onCreateWorkspace = async () => {
    setIsCreating(true);
    try {
      const workspaceId = Date.now();
      await setDoc(doc(db, "Workspace", workspaceId.toString()), {
        workspaceName,
        emoji,
        coverImage,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        id: workspaceId,
        orgId: orgId ? orgId : user?.primaryEmailAddress?.emailAddress,
      });

      const docId = uuid4();
      await setDoc(doc(db, "WorkspaceDocuments", docId.toString()), {
        workspaceId,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        coverImage: null,
        emoji: null,
        id: docId,
        documentName: "Untitled Document",
        documentOutput: [],
      });

      await setDoc(doc(db, "DocumentOutput", docId.toString()), {
        docId,
        output: [],
      });

      toast.success("Workspace created successfully!");
      router.replace(`/workspace/${workspaceId}/${docId}`);
    } catch (error) {
      console.error("Error creating workspace:", error);
      toast.error("Failed to create workspace. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="p-10 py-28 md:px-36 lg:px-64 xl:px-96">
      <div className="shadow-2xl rounded-2xl">
        <fieldset disabled={isCreating}>
          {/* Cover Image */}
          <CoverPicker setNewCover={(img) => setCoverImage(img)}>
            <div className="relative group group-disabled:pointer-events-none cursor-pointer">
              <h2 className="hidden group-hover:flex absolute p-4 w-full h-full items-center justify-center">
                <div className="z-10 font-semibold opacity-75">Change Cover</div>
              </h2>
              <div className="group-hover:opacity-60">
                <Image
                  src={coverImage}
                  width={400}
                  height={400}
                  alt="cover"
                  unoptimized
                  className="w-full h-[180px] object-cover rounded-t-2xl"
                />
              </div>
            </div>
          </CoverPicker>

          {/* Input Section */}
          <div className="pt-10 p-12">
            <h2 className="font-medium text-xl">Create a new Workspace</h2>
            <h2 className="text-sm mt-2 text-muted-foreground">
              Set up a collaborative workspace for your team. The name can be
              modified later.
            </h2>

            <div className="mt-8 flex gap-2 items-center">
              <EmojiPickerComponent setEmojiIcon={(value) => setEmoji(value)}>
                <Button variant={"outline"}>
                  {emoji ? emoji : <SmilePlus />}
                </Button>
              </EmojiPickerComponent>
              <Input
                placeholder="Workspace name"
                onChange={(e) => setWorkspaceName(e.target.value)}
              />
            </div>
            <div className="mt-7 flex justify-end gap-4">
              <Button
                variant={"outline"}
                className="cursor-pointer"
                onClick={() => router.push("/dashboard")}
              >
                Cancel
              </Button>
              <Button
                disabled={!workspaceName?.length || isCreating}
                onClick={onCreateWorkspace}
                className="cursor-pointer flex items-center bg-[#6C63FF] hover:bg-[#5850e0]"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  );
}

export default CreateWorkspace;