import React from "react";
import ContentLoader from "react-content-loader";

const PostLoader: React.FC = () => (
  <div className="w-full bg-white p-5 rounded-md shadow_custom">
    <ContentLoader
      speed={2}
      height={160}
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      style={{ width: "100%" }}
    >
      <circle cx="40" cy="30" r="30" />
      <rect x="80" y="17" rx="4" ry="4" height="13" style={{ width: "100%" }} />
      <rect x="80" y="40" rx="3" ry="3" style={{ width: "50%" }} height="10" />
      <rect x="0" y="80" rx="3" ry="3" style={{ width: "100%" }} height="10" />
      <rect x="0" y="100" rx="3" ry="3" style={{ width: "90%" }} height="10" />
      <rect x="0" y="120" rx="3" ry="3" style={{ width: "95%" }} height="10" />
      <rect x="0" y="140" rx="3" ry="3" style={{ width: "90%" }} height="10" />
    </ContentLoader>
  </div>
);

export default PostLoader;
