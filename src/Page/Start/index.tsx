import { useEffect, useState } from "react";
import { number } from "yup";
import Profile from "../../components/PageComponents/Start/Profile";
import Search from "../../components/PageComponents/Start/Search";

const Start = () => {
  const [selectedAccount, setSelectedAccount] = useState<string[]>([]);
  const [someData, setSomeData] = useState<number[]>([]); // [1,2,3,4,5,6,7,8,9,10,11,12
  const [recentSelectedAccount, setRecentSelectedAccount] = useState<
    string | null
  >(null);

  useEffect(() => {
    for (let i = 1; i <= 12; i++) {
      setSomeData((prev) => [...prev, i]);
    }
    console.log(someData);
  }, []);

  useEffect(() => {
    if (recentSelectedAccount) {
      const base = parseInt(recentSelectedAccount);

      const newData = [base, base + 10, base + 20, base + 30];
      const oldData = someData.filter((i) => i !== base);
      const finalData = [...newData, ...oldData];
      setSomeData(finalData);
    }
  }, [recentSelectedAccount]);

  console.log(someData);

  return (
    <div className="flex flex-col gap-5">
      <div className="mx-5">
        <h1 className="text-3xl mt-5">Start</h1>
        <Search />
      </div>

      <div className="grid grid-cols-3 gap-y-3">
        {someData.length > 0 ? (
          someData.map((i) => (
            <Profile
              name={i.toString()}
              selectedAccount={selectedAccount}
              setSelectedAccount={setSelectedAccount}
              setRecentSelectedAccount={setRecentSelectedAccount}
            />
          ))
        ) : (
          <div className="flex justify-center items-center">
            <h1>No data</h1>
          </div>
        )}

        {/* <Profile name="John Doe" />
        <Profile name="John Doe" />
        <Profile name="John Doe" /> */}
      </div>
    </div>
  );
};

export default Start;
