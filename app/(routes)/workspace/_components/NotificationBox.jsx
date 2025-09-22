"use client"
import React, { useEffect } from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    useInboxNotifications,
    useUnreadInboxNotificationsCount,
    useUpdateRoomSubscriptionSettings
} from "@liveblocks/react/suspense";
import {
    InboxNotification,
    InboxNotificationList,
} from "@liveblocks/react-ui";

function NotificationBox({ children, params }) {
    const { inboxNotifications } = useInboxNotifications();
    const updateRoomSubscriptionSettings = useUpdateRoomSubscriptionSettings();
    const { count, error, isLoading } = useUnreadInboxNotificationsCount();

    useEffect(() => {
        if (params?.documentId) {
            updateRoomSubscriptionSettings({
                threads: "all",
            });
        }
    }, [params?.documentId, updateRoomSubscriptionSettings, count]);


    return (
        <div>
            <Popover>
                <PopoverTrigger asChild>
                    <button
                        className="relative flex items-center justify-center rounded-full p-2 hover:bg-gray-100 active:scale-95 transition"
                    >
                        {children}

                        {count > 0 && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#6C63FF] text-white text-[10px] flex items-center justify-center shadow">
                                {count}
                            </span>
                        )}
                    </button>
                </PopoverTrigger>

                <PopoverContent className="w-[400px] shadow-lg rounded-xl p-4">
                    <InboxNotificationList>
                        {inboxNotifications.map((inboxNotification) => (
                            <InboxNotification
                                key={inboxNotification.id}
                                inboxNotification={inboxNotification}
                            />
                        ))}
                    </InboxNotificationList>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default NotificationBox