import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/config/firebaseConfig';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';

export async function POST(req) {
    try {
        const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature, clerkId } = await req.json();

        if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature || !clerkId) {
            return new NextResponse("Missing payment details or clerkId", { status: 400 });
        }
        
        // This is a critical security step to ensure the request is from Razorpay
        const body = razorpay_payment_id + "|" + razorpay_subscription_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');
        
        if (expectedSignature !== razorpay_signature) {
            return new NextResponse("Invalid signature", { status: 400 });
        }

        // Signature is valid, now update the user's plan in Firestore
        const usersRef = collection(db, "AMUser");
        const q = query(usersRef, where("clerkId", "==", clerkId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return new NextResponse("User not found", { status: 404 });
        }

        const userDocRef = querySnapshot.docs[0].ref;

        await updateDoc(userDocRef, {
            plan: 'pro',
            razorpaySubscriptionId: razorpay_subscription_id,
            razorpayPaymentId: razorpay_payment_id,
        });

        return new NextResponse("Payment verified and plan updated", { status: 200 });

    } catch (error) {
        console.error("[RAZORPAY_VERIFY_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}