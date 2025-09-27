import { NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import { db } from '@/config/firebaseConfig';
import { query, collection, where, getDocs } from "firebase/firestore";

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

    const user = await findUser(userId);
    let customerId = user?.data?.razorpayCustomerId;

    if (!customerId) {
        const customer = await razorpay.customers.create({
            email: email,
            name: email.split('@')[0],
            notes: {
                clerkId: userId,
            },
        });
        customerId = customer.id;
    }

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_id: customerId,
      total_count: 12,
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