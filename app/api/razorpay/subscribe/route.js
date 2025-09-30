import { NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import { db } from '@/config/firebaseConfig';
import { query, collection, where, getDocs, updateDoc } from "firebase/firestore";

const findUser = async (clerkId) => {
    const usersRef = collection(db, "AMUser");
    const q = query(usersRef, where("clerkId", "==", clerkId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return null;
    return { docId: querySnapshot.docs[0].id, data: querySnapshot.docs[0].data() };
};

export async function POST(req) {
    try {
        const { planId, email, userId } = await req.json();

        if (!planId || !email || !userId) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const userRecord = await findUser(userId);
        
        if (!userRecord) {
             return new NextResponse("User not found in Firestore. Please go to the dashboard once.", { status: 404 });
        }

        let customerId = userRecord.data?.razorpayCustomerId;

        if (!customerId) {
            const customer = await razorpay.customers.create({
                email: email,
                name: email.split('@')[0],
                notes: {
                    clerkId: userId,
                },
            });
            customerId = customer.id;

            // Update the user document with the new customer ID
            const userDocRef = collection(db, "AMUser");
            const q = query(userDocRef, where("clerkId", "==", userId));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const docToUpdate = querySnapshot.docs[0].ref;
                await updateDoc(docToUpdate, { razorpayCustomerId: customerId });
            }
        }

        const subscription = await razorpay.subscriptions.create({
            plan_id: planId,
            customer_id: customerId,
            total_count: 12, // For a 1-year plan with monthly payments
            notes: {
                clerkId: userId,
            },
        });

        return NextResponse.json({
            subscriptionId: subscription.id,
            keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        });

    } catch (error) {
        console.error("[RAZORPAY_API_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}