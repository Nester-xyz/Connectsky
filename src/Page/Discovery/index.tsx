import { useState } from "react";
import PeopleYouMayKnow from "../../components/PageComponents/Discovery/PeopleYouMayKnow";
import Recommended from "../../components/PageComponents/Discovery/Recommended";
import Search from "../../components/PageComponents/Discovery/Search";
import TopCreators from "../../components/PageComponents/Discovery/TopCreators";

const index = () => {
  const [followCount, setFollowCount] = useState(0);

  return (
    <div className="px-5">
      <h1 className="text-xl">Discovery</h1>
      <Search />

      <div>You need to select {5 - followCount} more people to continue</div>
      <div>
        <div className="text-xl mt-5">
          <h1>Top Creators</h1>
          <TopCreators />
        </div>

        <div className="text-xl mt-5">
          <h1>People you may know</h1>
          <PeopleYouMayKnow />
        </div>

        <div className="text-xl mt-5">
          <h1>Recommendation</h1>
          <Recommended />
        </div>
      </div>
    </div>
  );
};

export default index;
