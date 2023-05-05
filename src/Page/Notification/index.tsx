import React, { useEffect, useState, useRef } from "react";
import NotificationCard from "../../components/PageComponents/Notification/NotificationCard";
import NotificationLoader from "../../components/PageComponents/Notification/NotificationLoader";
import { agent, refreshSession } from "../../utils";

interface NotificationItem {
  image: string;
  title: "repost" | "follow" | "reply" | "like";
  description: string;
  indexedAt: Date;
  reply: string;
}

const Notification = () => {
  const [cursor, setCursor] = useState<string>("");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const lastElementRef = useRef<HTMLDivElement | null>(null);

  async function listNotifications() {
    await refreshSession();
    const { data } = await agent.listNotifications({
      limit: 20,
      cursor: cursor,
    });
    if (data.cursor == null) return;
    setCursor(data.cursor);
    console.log(data);
    // Check if data.notifications exists, otherwise use data directly.
    const notificationsData = data.notifications || data;
    const mappedData: NotificationItem[] = notificationsData.map(
      (notifications: any) => {
        return {
          image: notifications.author.avatar,
          title: notifications.reason, // You should map this value from the API response too.
          description: notifications.author.displayName,
          indexedAt: notifications.indexedAt,
          reply: notifications.record?.text ? notifications.record.text : "",
        };
      }
    );
    setNotifications((prevData) => [...prevData, ...mappedData]);
  }
  const observerCallback: IntersectionObserverCallback = (entries) => {
    const firstEntry = entries[0];
    if (firstEntry.isIntersecting) {
      listNotifications();
      setIsLoading(true);
    }
  };
  const observer = new IntersectionObserver(observerCallback, {
    threshold: 0.5,
  });
  async function markUnread() {
    await refreshSession();
    await agent.updateSeenNotifications();
  }
  useEffect(() => {
    markUnread();
    if (!isLoading) {
      listNotifications();
      setIsLoading(true);
    }
    if (lastElementRef.current) {
      observer.observe(lastElementRef.current);
    }

    return () => {
      if (lastElementRef.current) {
        observer.unobserve(lastElementRef.current);
      }
    };
  }, [isLoading, observer]);

  return (
    <div className="w-full p-5">
      <h1 className="text-3xl border-b-2 pb-4 border-slate-300">
        Notifications
      </h1>

      <div className="flex flex-col gap-3 mt-3">
        {notifications.map((item: NotificationItem, index) => {
          if (index === notifications.length - 1) {
            return (
              <div ref={lastElementRef} key={index}>
                <NotificationCard
                  description={item.description}
                  image={item.image}
                  title={item.title}
                  createdAt={item.indexedAt}
                  reply={item.reply}
                />
              </div>
            );
          } else {
            return (
              <div key={index}>
                <NotificationCard
                  description={item.description}
                  image={item.image}
                  title={item.title}
                  createdAt={item.indexedAt}
                  reply={item.reply}
                />
              </div>
            );
          }
        })}
        {isLoading ? (
          <>
            <NotificationLoader /> <NotificationLoader />
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Notification;
