import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import React from "react";
import { Share2 } from "lucide-react";

function DocumentHeader() {
  return (
    <div className="flex justify-between items-center p-3 px-7 border-b bg-white">
      <div></div>
      <OrganizationSwitcher />
      <div className="flex gap-3 items-center">
        <Button
          className={
            "cursor-pointer flex items-center gap-2 bg-[#6C63FF] hover:bg-[#5850e0]"
          }
        >
          <Share2 className="h-4 w-4" /> Share
        </Button>
        <UserButton />
      </div>
    </div>
  );
}

export default DocumentHeader;