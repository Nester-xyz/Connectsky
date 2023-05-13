import React from "react";
import PostLoader from "../../components/PageComponents/Feed/PostLoader";

type Props = {};

const index = (props: Props) => {
  return (
    <div className="p-5">
      {/* cover */}

      <div className="bg-slate-50 w-full h-56 relative">
        {/* <img src="" alt="" /> //cover image */}
        <div className="px-5 py-1 border rounded-md absolute right-5 top-5">
          Follow
        </div>
        {/* profile */}
        <div className="w-32 bg-blue-300 aspect-square border rounded-full absolute left-10 -bottom-16"></div>
      </div>

      {/* profile details */}
      <div className="flex flex-col gap-3 mt-16">
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-bold">Name</div>
          <div className="text-sm text-gray-500">@handle</div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-sm text-gray-500">Bio</div>
          <div className="text-sm text-gray-500">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            voluptatum, quibusdam, quia, quod voluptates voluptatem quos
            voluptate quas doloribus quidem voluptatibus. Quisquam voluptatum,
          </div>
        </div>
      </div>

      {/* posts */}

      <div className="mt-5 flex flex-col gap-3">
        <PostLoader />
        <PostLoader />
        <PostLoader />
      </div>
    </div>
  );
};

export default index;
