import React, { useEffect, useState, useRef } from "react";
import NotificationCard from "../../components/PageComponents/Notification/NotificationCard";
import NotificationLoader from "../../components/PageComponents/Notification/NotificationLoader";
import { agent, refreshSession } from "../../utils";

interface NotificationItem {
  image: string;
  title: "repost" | "follow" | "reply" | "like" | "mention" | "quote";
  author: string;
  handle: string;
  authorDiD: string;
  indexedAt: Date;
  reply: string;
  reasonSubject: string;
  post: any;
  uri: string;
  cid: string;
}

const Notification = () => {
  const [cursor, setCursor] = useState<string>("");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [fetchedDataLength, setFetchedDataLength] = useState(21);
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

    // Check if data.notifications exists, otherwise use data directly.
    const notificationsData = data.notifications || data;
    console.log("notifications data", notificationsData);
    const fetchPromises = notificationsData
      .map(async (notification: any) => {
        let postData;
        if (notification.reasonSubject !== undefined) {
          // console.log(notification.reasonSubject);

          postData = await agent.getPostThread({
            uri: notification?.reasonSubject,
          });
        }
        if (notification.reason === "mention" || notification.reason == "reply") {
          postData = await agent.getPostThread({
            uri: notification?.uri,
          });
        }

        return {
          uri: notification.uri,
          cid: notification.cid,
          image: notification.author.avatar,
          title: notification.reason,
          author: notification.author.displayName,
          authorDiD: notification.author.did,
          handle: notification.author.handle,
          indexedAt: notification.indexedAt,
          reply: notification.record?.text ? notification.record.text : "",
          reasonSubject: notification?.reasonSubject,
          post: postData?.data?.thread?.post, // Include the fetched post data
        };
      })
      .filter((item) => item !== null);

    const mappedData: NotificationItem[] = await Promise.all(
      fetchPromises as Promise<NotificationItem>[]
    );
    setFetchedDataLength(mappedData.length);
    setNotifications((prevData) => [...prevData, ...mappedData]);
    console.log("notifications ", mappedData);
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
    // console.log(groupLikes)
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

  // Look inside the set and use
  // only top occuring notifications reason subject

  return (
    <div className="w-full h-full grid grid-cols-4 gap-5 relative">
      <div className="col-span-4 lg:col-span-3  p-5 lg:pr-0">
        <h1 className="text-3xl border-b-2 pb-4 border-slate-300">
          Notifications
        </h1>

        <div className="flex flex-col gap-3 mt-3">
          {notifications.map((item: NotificationItem, index) => {
            if (index === notifications.length - 1) {
              return (
                <div ref={lastElementRef} key={index}>
                  <NotificationCard
                    author={item.author}
                    image={item.image}
                    title={item.title}
                    createdAt={item.indexedAt}
                    reply={item.reply}
                    handle={item.handle}
                    authorDiD={item.authorDiD}
                    reasonSubject={item.reasonSubject}
                    post={item.post}
                    uri={item.uri}
                    cid={item.cid}
                  />
                </div>
              );
            } else {
              return (
                <div key={index}>
                  <NotificationCard
                    author={item.author}
                    image={item.image}
                    title={item.title}
                    createdAt={item.indexedAt}
                    reply={item.reply}
                    handle={item.handle}
                    authorDiD={item.authorDiD}
                    reasonSubject={item.reasonSubject}
                    post={item.post}
                    uri={item.uri}
                    cid={item.cid}
                  />
                </div>
              );
            }
          })}
          {isLoading && !(fetchedDataLength < 20) ? (
            <>
              <NotificationLoader /> <NotificationLoader />
            </>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="bg-white col-span-1 hidden lg:block sticky h-full top-5"></div>
    </div>
  );
};

export default Notification;
