import React from "react";
import Header from "./_components/Header";
import WorkspaceList from "./_components/WorkspaceList";

function Dashboard() {
  return (
    <div className="relative min-h-screen bg-background">
      <div className="absolute inset-0 -z-10 bg-grid bg-gradient pointer-events-none" />

      {/* Header */}
      <div className="sticky top-0 z-20">
        <Header />
      </div>

      {/* Content */}
      <main className="relative z-10">
        <WorkspaceList />
      </main>
    </div>
  );
}

export default Dashboard;