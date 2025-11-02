# **Aide-memoire: AI & Developer Project Context**

This document serves as the primary technical specification and architectural overview for the **Aide-memoire** application. It is compiled to provide instant, deep context for AI coding assistants (like GitHub Copilot) and to accelerate onboarding for developers.

**Project Purpose:** Aide-memoire is a collaborative knowledge base and rich document workspace, functioning as an equivalent to Microsoft Loop. It integrates real-time editing, AI-powered content generation, and subscription-based feature gating.

## **1\. Technology Stack & Configuration**

| Category | Component / Technology | Key Dependency / Version |
| :---- | :---- | :---- |
| **Frontend Framework** | Next.js (React) | next@^14.x.x |
| **Styling** | Tailwind CSS | tailwindcss |
| **Authentication** | Clerk | @clerk/nextjs, @clerk/clerk-react |
| **Database** | Firebase Firestore | firebase@^10.x.x |
| **Real-time** | Liveblocks | @liveblocks/client, @liveblocks/react |
| **Document Editor** | Editor.js | editorjs (with various plugins) |
| **AI Generation** | Google Gemini API | @google/generative-ai@^0.x.x |
| **Payments** | Razorpay | razorpay@^2.x.x |
| **UI/UX** | shadcn/ui, Framer Motion, Sonner | shadcn/ui, framer-motion |

### **Environment Variables (Non-Secret Names)**

The application relies on the following environment variables for external service integration:

* NEXT\_PUBLIC\_CLERK\_PUBLISHABLE\_KEY / CLERK\_SECRET\_KEY  
* LIVEBLOCKS\_SECRET\_KEY / NEXT\_PUBLIC\_LIVEBLOCKS\_PUBLIC\_KEY  
* RAZORPAY\_KEY\_ID / RAZORPAY\_KEY\_SECRET / NEXT\_PUBLIC\_RAZORPAY\_PLAN\_ID  
* NEXT\_PUBLIC\_GEMINI\_API\_KEY / NEXT\_PUBLIC\_GOOGLE\_AI\_MODEL  
* **Firebase Config:** (NEXT\_PUBLIC\_FIREBASE\_API\_KEY, AUTH\_DOMAIN, PROJECT\_ID, etc.)

## **2\. Core Architecture & Global Context**

### **Global Providers (app/layout.tsx / RootLayout)**

The entire application structure is nested within core providers, establishing the global context necessary for all features:

\<ClerkProvider\>  
  {/\* Authenticated user context available here \*/}  
  \<LiveblocksProvider\>  
    {/\* Real-time and collaboration context available here \*/}  
    \<html\>  
      \<body\>  
        {children}  
        \<Toaster /> {/\* Global Notifications \*/}  
      \</body\>  
    \</html\>  
  \</LiveblocksProvider\>  
\</ClerkProvider\>

### **Firestore Data Schemas**

#### **A. Workspace Document Schema**

The top-level collaborative container, stored in Firestore:

| Field | Type | Description |
| :---- | :---- | :---- |
| id | string | Unique Workspace ID. |
| ownerId | string | Clerk user ID of the creator. |
| name | string | Workspace title. |
| liveblocksRoomId | string | Identifier linking to the Liveblocks room for this workspace. |
| members | array\<string\> | List of Clerk user IDs with access to this workspace. |
| pro | boolean | Indicates if the workspace is under a Pro subscription plan. |

#### **B. Document Document Schema**

The primary content unit, stored in Firestore and linked to a Liveblocks room:

| Field | Type | Description |
| :---- | :---- | :---- |
| id | string | Unique Document ID. |
| workspaceId | string | ID of the parent Workspace. |
| ownerId | string | Clerk user ID of the document creator. |
| liveblocksRoomId | string | Identifier linking to the Liveblocks room for real-time state. |
| **content** | **object** | **Holds the complete Editor.js JSON data structure.** |
| updatedAt | timestamp | Last update time, primarily set by Firestore saves. |
| collaborators | array\<string\> | Users with direct edit access to this document. |

## **3\. Core Application Flows**

### **A. New User Onboarding & Document Creation**

1. **Sign Up:** User completes Clerk flow at /sign-up.  
2. **Firestore Sync:** On the first dashboard view, the Clerk user data is synced/saved to the User collection in Firestore (app/(routes)/dashboard/\_components/Header.jsx).  
3. **Workspace Creation:** User creates a Workspace  new Workspace document is written to Firestore.  
4. **Document Creation:** An initial Document is created within the Workspace, establishing a unique liveblocksRoomId.  
5. **Redirection:** User is redirected to the editor at app/(routes)/workspace/\[workspaceId\]/\[documentId\]/page.jsx.

### **B. Real-time Collaboration Flow (Liveblocks Auth)**

The Liveblocks authentication route (route.js) controls access and permissions:

// Liveblocks Auth Logic (Pseudocode from route.js)  
const { userId, user } \= auth(); // Get user from Clerk  
const { room } \= request.json(); // Get requested room ID

const userInfo \= { id: userId, name: user?.firstName, avatar: user?.imageUrl };

// ⚠️ CRITICAL: Actual implementation involves checking Firestore 'members' array  
const isMember \= /\* Check if userId is in Workspace/Document members array \*/ true;

const roomOptions \= {  
  userInfo,  
  // Permission logic:  
  defaultAccesses: isMember ? \["room:write"\] : \["room:read"\],  
};

const response \= await authorize({ room, ...roomOptions });  
// Returns a token authorizing access to the Liveblocks room with set permissions.

### **C. Editor Data Persistence**

| Action | Source Component | Logic |
| :---- | :---- | :---- |
| **Loading Data** | RichDocumentEditor.jsx | Document data is fetched from Firestore (based on Document ID). The doc.content (Editor.js JSON) field is used to initialize the Editor instance. |
| **Saving Data** | RichDocumentEditor.jsx | Calls editorInstance.save() to retrieve the current JSON state. This JSON is then committed to Firestore: updateDoc(docRef, { content: data, updatedAt: serverTimestamp() }); |

## **4\. Feature Gating & External Integrations**

### **A. Pro Subscription Status Check**

This logic determines access to premium features (e.g., unlimited documents, AI generation).

// Subscription Check Logic (from ProBadge.jsx or related hook)  
function useProStatus(userId) {  
  // 1\. Fetch user data from Firestore (or check Clerk metadata).  
  const userPlanData \= getUserPlan(userId);

  // 2\. Determine Pro status based on plan fields.  
  const isPro \= userPlanData?.plan \=== "pro" && userPlanData?.planActive \=== true;

  return isPro; // Used to conditional render features/badges.  
}

### **B. AI Content Generation (Google Gemini)**

AI content is generated using a wrapper function that calls the Gemini API:

| Detail | Structure |
| :---- | :---- |
| **Trigger** | Triggered by user interaction in GenerateAITemplate.jsx. |
| **Function Signature** | async function generateGeminiContent(promptText: string): Promise\<GeminiResponse\> |
| **Input Payload** | Standard Gemini API payload structure: { contents: \[{ parts: \[{ text: "..." }\] }\] } |
| **Output** | Gemini JSON response: { candidates: \[{ content: { parts: \[{ text: "Generated response text or Editor.js block JSON" }\] } }\] } |

## **5\. Key File Mapping**

| Feature | Primary Responsibility | Key Files/Routes |
| :---- | :---- | :---- |
| **Authentication** | Sign Up/In, User Management | app/(auth)/sign-up/\[...sign-up\]/page.jsx, app/(routes)/dashboard/\_components/Header.jsx |
| **Real-time Engine** | Collaboration, Presence, Comments | app/Room.jsx, Liveblocks Auth route.js, app/(routes)/workspace/\_components/CommentBox.jsx |
| **Document Content** | Editor initialization, data saving/loading | app/(routes)/workspace/\_components/RichDocumentEditor.jsx |
| **Payments** | Subscription initiation, verification, user plan update | app/(routes)/pricing/page.jsx, Razorpay handler route.js |
| **Feature Gating** | Displaying Pro status, controlling access | ProBadge.jsx, app/(routes)/workspace/\_components/SideNav.jsx |

