import { useContext } from "react";
import { UserContext } from "../context";
import ParallaxBg from "../components/cards/ParallaxBg";
import axios from "axios";
import Post from "../components/cards/Post";

const Home = ({ posts }) => {
  const [state, setState] = useContext(UserContext);

  return (
    <>
      <ParallaxBg url="/images/default.jpg" />
      {/* <pre>{JSON.stringify(posts, null, 4)}</pre> */}
      <div className="container">
        <div className="row pt-5">
          {posts.map((post) => (
            <div className="col-md-4">
              <Post key={post._id} post={post} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps() {
  const { data } = await axios.get("/posts");
  console.log(data);
  return {
    props: {
      posts: data,
    },
  };
}

export default Home;
