const Search = () => {
  return (
    <div className="flex gap-2">
      <div className="w-full">
        <input
          type="text"
          placeholder="Search"
          className="bg-white w-full rounded-full p-2"
        />
      </div>
      <div>
        <button className="bg-green-300 py-2 px-5 rounded-full">Search</button>
      </div>
    </div>
  );
};

export default Search;
