import React from "react";
import ContentLoader from "react-content-loader";

const PostLoader: React.FC = () => (
  <div className="w-full bg-white p-5 rounded-xl shadow_custom">
    <ContentLoader
      speed={2}
      height={160}
      viewBox="0 0 400 160"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      style={{ width: "100%" }}
    >
      <circle cx="40" cy="30" r="30" />
      <rect x="80" y="17" rx="4" ry="4" width="300" height="13" />
      <rect x="80" y="40" rx="3" ry="3" width="250" height="10" />
      <rect x="0" y="80" rx="3" ry="3" width="400" height="10" />
      <rect x="0" y="100" rx="3" ry="3" width="380" height="10" />
      <rect x="0" y="120" rx="3" ry="3" width="410" height="10" />
      <rect x="0" y="140" rx="3" ry="3" width="400" height="10" />
    </ContentLoader>
  </div>
);

export default PostLoader;
