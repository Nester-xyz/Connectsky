import React from "react";
import ContentLoader from "react-content-loader";

const NotificationLoader: React.FC = () => (
  <div className="w-full bg-white p-5 rounded-sm shadow_custom">
    <ContentLoader
      speed={2}
      width={400}
      height={50}
      viewBox="0 0 400 150"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      style={{ width: "100%" }}
    >
      <circle cx="10" cy="20" r="8" />
      <rect x="25" y="15" rx="5" ry="5" width="220" height="10" />
    </ContentLoader>
  </div>
);

export default NotificationLoader;
