"use client";
import Logo from "@/app/_components/Logo";
import { db } from "@/config/firebaseConfig";
import { OrganizationSwitcher, UserButton, useUser } from "@clerk/nextjs";
import { doc, setDoc } from "firebase/firestore";
import Link from "next/link";
import React, { useEffect } from "react";

function Header() {
    const { user } = useUser();

    useEffect(() => {
        if (user) {
            saveUserData();
        }
    }, [user]);

    const saveUserData = async () => {
        // Use a guard clause to ensure user and email exist
        if (!user?.primaryEmailAddress?.emailAddress) return;

        const docId = user.primaryEmailAddress.emailAddress;
        try {
            await setDoc(
                doc(db, "AMUser", docId),
                {
                    name: user.fullName,
                    avatar: user.imageUrl,
                    email: user.primaryEmailAddress.emailAddress,
                    clerkId: user.id,
                },
                { merge: true } 
            );
        } catch (e) {
            console.error("Error saving user data:", e);
        }
    };

    return (
        <div className="flex justify-between items-center p-4 border-b bg-background/80 backdrop-blur-sm">
            <Link href="/dashboard" className="cursor-pointer">
                <Logo />
            </Link>
            <OrganizationSwitcher
                afterCreateOrganizationUrl={"/dashboard"}
                afterLeaveOrganizationUrl={"/dashboard"}
            />
            <UserButton />
        </div>
    );
}

export default Header;