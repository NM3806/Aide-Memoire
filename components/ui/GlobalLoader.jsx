import { Loader2 } from "lucide-react";
import React from "react";

function GlobalLoader({ message }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/70 z-[9999]">
      <div className="flex flex-col items-center gap-3 p-6 bg-card rounded-xl shadow-xl">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
      </div>
    </div>
  );
}

export default GlobalLoader;
