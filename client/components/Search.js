import { useState, useContext } from "react";
import { UserContext } from "../context";
import axios from "axios";
import People from "../components/cards/People";

const Search = () => {
  const [state] = useContext(UserContext);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);

  const searchUser = async (e) => {
    e.preventDefault();
    // console.log(`Find "${query}" from database`);
    try {
      const { data } = await axios.get(`/search-user/${query}`);
      // console.log("Search user response => ", data);
      setResult(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleFollow = async (user) => {
    console.log("follow");
  };

  const handleUnfollow = async (user) => {
    console.log("unfollow");
  };

  return (
    <>
      <form className="form-inline row pt-2" onSubmit={searchUser}>
        <div className="col-8">
          <input
            onChange={(e) => {
              setQuery(e.target.value);
              setResult([]);
            }}
            value={query}
            className="form-control"
            type="search"
            placeholder="Search"
          />
        </div>
        <div className="col-4">
          <button className="btn btn-outline-primary col-12" type="submit">
            Search
          </button>
        </div>
      </form>

      {result.length > 0 && (
        <People
          people={result}
          handleFollow={handleFollow}
          handleUnfollow={handleUnfollow}
        />
      )}
    </>
  );
};

export default Search;
