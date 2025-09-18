"use client";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";

export function Room({ children, params }) {
  return (
    <LiveblocksProvider
      authEndpoint={"/api/liveblocks-auth?roomId=" + params?.documentId}

      resolveUsers={async ({ userIds }) => {
        const q = query(collection(db, 'AMUser'), where('email', 'in', userIds));
        const querySnapshot = await getDocs(q);
        const userList = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          userList.push({
            ...data,
            id: doc.email // match the ID from resolveMentionSuggestions
          });
        });

        return userList;
      }}


      resolveMentionSuggestions={async ({ text, roomId }) => {
        const q = query(collection(db, 'AMUser'), where('email', '!=', null));
        const querySnapshot = await getDocs(q);
        let userList = [];

        querySnapshot.forEach((doc) => {
          userList.push(doc.data());
        });

        if (text) {
          userList = userList.filter((user) =>
            user.name.toLowerCase().includes(text.toLowerCase())
          );
        }

        return userList.map((user) => user.email);
      }}


    >
      <RoomProvider id={params?.documentId}>
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}