import React from "react";

type NotificationCardProps = {
  image: string;
  title: "chat" | "follow" | "quote-reply" | "mention";
  description: string;
};

const NotificationCard = ({
  image,
  title,
  description,
}: NotificationCardProps) => {
  let color = "";
  switch (title) {
    case "chat":
      color = "bg-blue-500";
      break;
    case "follow":
      color = "bg-green-500";
      break;
    case "quote-reply":
      color = "bg-yellow-500";
      break;
    case "mention":
      color = "bg-red-500";
      break;
    default:
      color = "bg-blue-500";
      break;
  }
  return (
    <div>
      <div className="flex gap-5 py-2 px-2 items-center shadow_custom bg-white">
        {/* left side for the image */}
        <div className="relative">
          <div className="rounded-full w-16 h-16 overflow-hidden ">
            <img src={image} alt={title} />
          </div>

          <div
            className={`absolute bottom-0 right-0 w-6 h-6  rounded-full ${color}`}
          ></div>
        </div>
        {/* right side for the title and description */}

        <div className="flex flex-col">
          <p className="line-clamp-2">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
