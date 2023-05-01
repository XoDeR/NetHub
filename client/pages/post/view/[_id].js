import ParallaxBg from "../../../components/cards/ParallaxBg";
import axios from "axios";
import PostPublic from "../../../components/cards/PostPublic";
import Head from "next/head";

const SinglePost = ({ post }) => {
  const head = () => (
    <Head>
      <title>Social Network</title>
      <meta name="description" content={post.content} />
      <meta
        property="og:description"
        content="A social network for creative people"
      />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="NetHub" />
      <meta
        property="og:url"
        content={`http://nethub.com/post/view/${post._id}`}
      />
      <meta property="og:image:secure_url" content={imageSource(post)} />
    </Head>
  );

  const imageSource = (post) => {
    if (post.image) {
      return post.image.url;
    } else {
      return "http://nethub.com/images/default.jpg";
    }
  };

  return (
    <>
      {head()}
      <ParallaxBg url="/images/default.jpg" />
      {/* <pre>{JSON.stringify(posts, null, 4)}</pre> */}
      <div className="container">
        <div className="row pt-5">
          <div className="col-md-8 offset-md-2">
            <PostPublic post={post} />
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(ctx) {
  const { data } = await axios.get(`/post/${ctx.params._id}`);
  console.log(data);
  return {
    props: {
      post: data,
    },
  };
}

export default SinglePost;
