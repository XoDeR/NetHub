import { useContext, useEffect } from "react";
import { UserContext } from "../context";
import ParallaxBg from "../components/cards/ParallaxBg";
import axios from "axios";
import PostPublic from "../components/cards/PostPublic";
import Head from "next/head";
import Link from "next/link";
import io from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_SOCKETIO, {
  reconnection: true,
});

const Home = ({ posts }) => {
  const [state, setState] = useContext(UserContext);

  useEffect(() => {
    console.log("SocketIO on join", socket);
  }, []);

  const head = () => (
    <Head>
      <title>Social Network</title>
      <meta name="description" content="A social network" />
      <meta
        property="og:description"
        content="A social network for creative people"
      />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="NetHub" />
      <meta property="og:url" content="http://nethub.com" />
      <meta
        property="og:image:secure_url"
        content="http://nethub.com/images/default.jpg"
      />
    </Head>
  );

  return (
    <>
      {head()}
      <ParallaxBg url="/images/default.jpg" />
      {/* <pre>{JSON.stringify(posts, null, 4)}</pre> */}
      <div className="container">
        <div className="row pt-5">
          {posts.map((post) => (
            <div className="col-md-4">
              <Link href={`/post/view/${post._id}`}>
                <a>
                  <PostPublic key={post._id} post={post} />
                </a>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps() {
  const { data } = await axios.get("/posts");
  // console.log(data);
  return {
    props: {
      posts: data,
    },
  };
}

export default Home;
