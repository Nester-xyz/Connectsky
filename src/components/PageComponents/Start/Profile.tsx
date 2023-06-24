type ProfileProps = {
  image?: string;
  name: string;
  selectedAccount: string[];
  setSelectedAccount: React.Dispatch<React.SetStateAction<string[]>>;
  setRecentSelectedAccount: React.Dispatch<React.SetStateAction<string | null>>;
};

const Profile = ({
  image,
  name,
  selectedAccount,
  setSelectedAccount,
  setRecentSelectedAccount,
}: ProfileProps) => {
  return (
    <div className="flex flex-col items-center">
      <div
        onClick={() => {
          if (selectedAccount.includes(name)) {
            setSelectedAccount(selectedAccount.filter((i) => i !== name));
          } else {
            setSelectedAccount([...selectedAccount, name]);
          }
          setRecentSelectedAccount(name);
        }}
      >
        <div className="bg-green-300 rounded-full w-20 h-20 relative">
          {image && <img src={image} alt="" />}
          {selectedAccount.includes(name) && (
            <div className="absolute top-0 right-0 border border-black w-4 h-4 rounded-full bg-blue-600"></div>
          )}
          {/* <div className="absolute top-0 right-0 border border-black w-4 h-4 rounded-full bg-blue-600"></div> */}
        </div>
      </div>
      <h1>{name}</h1>
    </div>
  );
};

export default Profile;
