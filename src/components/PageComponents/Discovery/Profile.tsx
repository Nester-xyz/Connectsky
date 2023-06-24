type ProfileProps = {
  name: string;
  image: string | null;
  followerCount: number;
};

const Profile = ({ name, image, followerCount }: ProfileProps) => {
  return (
    <div className="flex justify-between items-center bg-white text-sm py-2 px-5 rounded-lg">
      <div className="flex items-center gap-5">
        <div>
          {image ? (
            <img src={image} alt="profile" className="w-10 h-10 rounded-full" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-green-400"></div>
          )}
        </div>
        <div className="flex flex-col">
          <div>{name}</div>
          <div>{followerCount}</div>
        </div>
      </div>
      <div className="checkbox ">
        <input type="checkbox" name="" id="" />
      </div>
    </div>
  );
};

export default Profile;
