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
        // ... your existing resolveUsers function
        const q = query(collection(db, 'AMUser'), where('email', 'in', userIds));
        const querySnapshot = await getDocs(q);
        const userList = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          userList.push({ ...data, id: doc.email });
        });

        return userList;
      }}
      resolveMentionSuggestions={async ({ text, roomId }) => {
        // ... your existing resolveMentionSuggestions function
        const q = query(collection(db, 'AMUser'), where('email', '!=', null));
        const querySnapshot = await getDocs(q);
        let userList = [];
        querySnapshot.forEach((doc) => userList.push(doc.data()));
        if (text) {
          userList = userList.filter((user) =>
            user.name.toLowerCase().includes(text.toLowerCase())
          );
        }
        return userList.map((user) => user.email);
      }}

      resolveRoomsInfo={async ({ roomIds }) => {
        const roomsInfo = [];
        // Find all documents where the 'id' is in the list of roomIds
        const q = query(collection(db, "WorkspaceDocuments"), where("id", "in", roomIds));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          const docData = doc.data();
          roomsInfo.push({
            id: docData.id,
            name: docData.documentName || "Untitled Document",
            emoji: docData.emoji || "📄",
          });
        });

        return roomsInfo;
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