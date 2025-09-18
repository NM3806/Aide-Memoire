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
                <PopoverTrigger>
                    <div className='flex gap-1'>
                        {children}
                        <span className='p-1 px-2 -ml-3 text-[7px] rounded-full bg-primary text-white'>{count}</span>
                    </div>
                </PopoverTrigger>
                <PopoverContent className={'w-[400px]'}>
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