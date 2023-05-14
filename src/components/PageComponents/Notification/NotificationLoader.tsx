import React from "react";
import ContentLoader from "react-content-loader";

const NotificationLoader: React.FC = () => (
  <div className="w-full bg-white p-5 rounded-md shadow_custom">
    <ContentLoader
      speed={2}
      height={70}
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      style={{ width: "100%" }}
    >
      <circle cx="40" cy="30" r="30" />
      <rect x="80" y="17" rx="4" ry="4" style={{ width: "75%" }} height="13" />
      <rect x="80" y="40" rx="3" ry="3" style={{ width: "70%" }} height="10" />
    </ContentLoader>
  </div>
);

export default NotificationLoader;
