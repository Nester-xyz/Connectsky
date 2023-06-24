const Search = () => {
  return (
    <div className="flex gap-2 bg-white rounded-full overflow-hidden">
      <div className="w-full">
        <input
          type="text"
          placeholder="Search"
          className=" w-full px-5 py-2 focus:outline-none"
        />
      </div>
      <div>
        <button className="bg-green-300 py-2 px-5 rounded-full">Search</button>
      </div>
    </div>
  );
};

export default Search;
