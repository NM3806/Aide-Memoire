"use client";
import React, { useState } from "react";
import SideNav from "./SideNav";
import { Menu } from "lucide-react";

function WorkspaceLayout({ children, params }) {
    const [isNavOpen, setIsNavOpen] = useState(false);

    return (
        <div>
            {/* This SideNav will be the mobile overlay */}
            <SideNav params={params} isMobileOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />

            <div className="flex">
                {/* This is a placeholder SideNav for desktop view to occupy space */}
                <div className="hidden md:block md:w-72">
                    <SideNav params={params} />
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    {/* Hamburger Menu Button for Mobile */}
                    <div className="md:hidden flex items-center p-4 border-b">
                        <button onClick={() => setIsNavOpen(true)}>
                            <Menu className="h-6 w-6" />
                        </button>
                        <span className="ml-4 font-semibold">Menu</span>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default WorkspaceLayout;