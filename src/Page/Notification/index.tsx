import React, { useEffect, useState, useRef } from "react";
import NotificationCard from "../../components/PageComponents/Notification/NotificationCard";
import { BskyAgent, AtpSessionData, AtpSessionEvent } from "@atproto/api";
import NotificationLoader from "../../components/PageComponents/Notification/NotificationLoader";

// const MyBulletListLoader = () => <BulletList />;

interface NotificationItem {
  image: string;
  title: "chat" | "follow" | "quote-reply" | "mention";
  description: string;
}

const Notification = () => {
  const [cursor, setCursor] = useState<string>("");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const lastElementRef = useRef<HTMLDivElement | null>(null);
  const agent = new BskyAgent({
    service: "https://bsky.social",
    persistSession: (_evt: AtpSessionEvent, sess?: AtpSessionData) => {
      console.log("first");
      const sessData = JSON.stringify(sess);
      localStorage.setItem("sess", sessData);
    },
  });

  async function listNotifications() {
    const sessData = localStorage.getItem("sess");
    if (sessData !== null) {
      const sessParse = JSON.parse(sessData);
      await agent.resumeSession(sessParse);
    }
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
          title: "chat", // You should map this value from the API response too.
          description: notifications.author.displayName,
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

  useEffect(() => {
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
    <div className="p-5">
      <h1 className="text-3xl border-b-2 pb-4 border-slate-300">
        Notification
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
