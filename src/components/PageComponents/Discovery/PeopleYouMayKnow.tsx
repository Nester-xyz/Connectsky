import { useEffect, useState } from "react";
import Profile from "./Profile";

const name = ["Adarsh Kunwar", "Yogesh Aryal", "Ankit Bhandari"];

type fakeData = {
  id: number;
  name: string;
  image: string | null;
  followerCount: number;
};

const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const PeopleYouMayKnow = () => {
  const [followData, setFollowData] = useState<fakeData[]>([]);

  useEffect(() => {
    for (let i = 0; i < 4; i++) {
      setFollowData((prevData) => [
        ...prevData,
        {
          id: i,
          name: name[i % 3],
          image: null,
          followerCount: random(500, 10000),
        },
      ]);
    }
  }, []);

  console.log(followData);
  console.log(followData.length);

  return (
    <div className="top-creators ">
      {/* <h1>Top Creators</h1> */}
      <div className="flex flex-col gap-2">
        {followData.length > 0 &&
          followData.map((data) => {
            return (
              <div key={data.id}>
                <Profile
                  name={data.name}
                  image={data.image}
                  followerCount={data.followerCount}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default PeopleYouMayKnow;
