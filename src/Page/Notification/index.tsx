import React, { useEffect, useState } from "react";
import NotificationCard from "../../components/PageComponents/Notification/NotificationCard";
import { BskyAgent, AtpSessionData, AtpSessionEvent } from "@atproto/api";

type Props = {};
type NotificationCardProps = {
  image: string;
  title: "chat" | "follow" | "quote-reply" | "mention";
  description: string;
};

type ApiResponseItem = {
  user_image: string;
  event_type: "chat" | "follow" | "quote-reply" | "mention";
  description: string;
};

// const threeTotallyRandomNotifications: NotificationCardProps[] = [
//   {
//     description: "Random Chat",
//     image: "https://randomuser.me/api/portraits/women/6.jpg",
//     title: "chat",
//   },
//   {
//     description: "Random Follow",
//     image: "https://randomuser.me/api/portraits/women/6.jpg",
//     title: "follow",
//   },
//   {
//     description: "Random Quote Reply",
//     image: "https://randomuser.me/api/portraits/women/6.jpg",
//     title: "quote-reply",
//   },
// ];

const Notification = (props: Props) => {
  const [notifications, setNotifications] = useState<NotificationCardProps[]>(
    []
  );
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
    });
    console.log(data);

    // Cast the data to an array of ApiResponseItem
    const typedData = data as unknown as ApiResponseItem[];

    setNotifications(
      typedData.map((item) => ({
        image: item.user_image,
        title: item.event_type, // Make sure the event types match the title types in NotificationCardProps.
        description: item.description,
      }))
    );
  }

  useEffect(() => {
    listNotifications();
  }, []);

  return (
    <div className="p-5">
      {/* title of the page */}
      <h1 className="text-3xl border-b-2 pb-4 border-slate-300">
        Notification
      </h1>

      {/* notification wraps here */}
      <div className="flex flex-col gap-3 mt-3">
        {notifications.map((notification, index) => (
          <NotificationCard
            description={notification.description}
            image={notification.image}
            title={notification.title}
          />
        ))}
      </div>
    </div>
  );
};

export default Notification;
