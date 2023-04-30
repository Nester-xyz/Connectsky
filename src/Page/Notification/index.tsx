import React from "react";
import NotificationCard from "../../components/PageComponents/Notification/NotificationCard";

type Props = {};
type NotificationCardProps = {
  image: string;
  title: "chat" | "follow" | "quote-reply" | "mention";
  description: string;
};

const threeTotallyRandomNotifications: NotificationCardProps[] = [
  {
    description: "Random Chat",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    title: "chat",
  },
  {
    description: "Random Follow",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    title: "follow",
  },
  {
    description: "Random Quote Reply",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    title: "quote-reply",
  },
];

const Notification = (props: Props) => {
  return (
    <div className="p-5">
      {/* title of the page */}
      <h1 className="text-3xl border-b-2 pb-4 border-slate-300">
        Notification
      </h1>

      {/* notification wraps here */}
      <div className="flex flex-col gap-3 mt-3">
        {threeTotallyRandomNotifications.map((notification, index) => (
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
