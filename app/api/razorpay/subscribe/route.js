import { NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay'; 
import { getFirestore, query, collection, where, getDocs, doc } from "firebase/firestore";

// Helper to find a user and their Razorpay customer ID
const findUser = async (clerkId) => {
    const db = getFirestore();
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

    const user = await findUser(userId);
    let customerId = user?.data?.razorpayCustomerId;

    // Create a Razorpay customer if one doesn't exist for the user
    if (!customerId) {
        const customer = await razorpay.customers.create({
            email: email,
            name: email.split('@')[0],
            notes: {
                clerkId: userId, // This is crucial for linking back in webhooks
            },
        });
        customerId = customer.id;
    }

    // Create the subscription
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_id: customerId,
      total_count: 12, // For a 1-year plan. Adjust as needed.
      notes: {
        clerkId: userId, // Add clerkId to subscription metadata too
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