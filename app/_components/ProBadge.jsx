"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "@/config/firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Star } from "lucide-react";

function ProBadge() {
    const { user } = useUser();
    const [userPlan, setUserPlan] = useState(null);

    useEffect(() => {
        if (!user) return;

        // Listen for real-time changes to the user's plan
        const q = query(collection(db, "AMUser"), where("clerkId", "==", user.id));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data();
                setUserPlan(userData.plan || 'free');
            } else {
                setUserPlan('free');
            }
        });

        return () => unsubscribe();
    }, [user]);

    // Don't render anything if the user is not on the pro plan
    if (userPlan !== 'pro') {
        return null;
    }

    // Render the badge if the user is a pro
    return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md">
            <Star className="h-3.5 w-3.5 fill-white" />
            <span className="text-xs font-semibold tracking-wide">PRO</span>
        </div>
    );
}

export default ProBadge;