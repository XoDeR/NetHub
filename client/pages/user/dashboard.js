import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context";
import UserRoute from "../../components/routes/UserRoute";
import PostForm from "../../components/forms/PostForm";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import PostList from "../../components/cards/PostList";
import People from "../../components/cards/People";
import Link from "next/link";
import { Modal, Pagination } from "antd";
import CommentForm from "../../components/forms/CommentForm";
import Search from "../../components/Search";
import io from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_SOCKETIO, {
  reconnection: true,
});

const Home = () => {
  const [state, setState] = useContext(UserContext);
  const [content, setContent] = useState("");
  const [image, setImage] = useState({});
  const [uploading, setUploading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [people, setPeople] = useState([]);
  const [comment, setComment] = useState("");
  const [visible, setVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState({});
  const [totalPosts, setTotalPosts] = useState(0);
  const [page, setPage] = useState(1);

  const router = useRouter();

  useEffect(() => {
    if (state && state.token) {
      newsFeed();
      findPeople();
    }
  }, [state && state.token, page]);

  useEffect(() => {
    try {
      axios.get("/total-posts").then(({ data }) => setTotalPosts(data));
    } catch (err) {
      console.log(err);
    }
  }, []);

  const newsFeed = async () => {
    try {
      const { data } = await axios.get(`/news-feed/${page}`);
      // console.log("user posts => ", data);
      setPosts(data);
    } catch (err) {
      console.log(err);
    }
  };

  const findPeople = async () => {
    try {
      const { data } = await axios.get("/find-people");
      setPeople(data);
    } catch (err) {
      console.log(err);
    }
  };

  const postSubmit = async (e) => {
    e.preventDefault();
    // console.log("post => ", content);
    try {
      const { data } = await axios.post("/create-post", { content, image });
      // console.log("create post response => ", data);
      if (data.error) {
        toast.error(data.error);
      } else {
        setPage(1);
        newsFeed();
        toast.success("Post created");
        setContent("");
        setImage({});

        socket.emit("new-post", data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    let formData = new FormData();
    formData.append("image", file);
    // console.log([...formData]);
    setUploading(true);
    try {
      const { data } = await axios.post("/upload-image", formData);
      // console.log("uploaded image =>", data);
      setImage({
        url: data.url,
        public_id: data.public_id,
      });
      setUploading(false);
    } catch (err) {
      console.log(err);
      setUploading(false);
    }
  };

  const handleDelete = async (post) => {
    try {
      const answer = window.confirm("Are you sure to delete this post?");
      if (!answer) return;
      const { data } = await axios.delete(`/delete-post/${post._id}`);
      toast.error("Post deleted.");
      newsFeed();
    } catch (err) {
      console.log(err);
    }
  };

  const handleFollow = async (user) => {
    // console.log("Add this user to 'following' list", user);
    try {
      const { data } = await axios.put("/user-follow", { _id: user._id });
      // console.log("Handle follow response => ", data);
      let auth = JSON.parse(localStorage.getItem("auth"));
      auth.user = data;
      localStorage.setItem("auth", JSON.stringify(auth));
      setState({ ...state, user: data });
      let filtered = people.filter((p) => p._id !== user._id);
      setPeople(filtered);
      newsFeed();
      toast.success(`Following ${user.name}`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLike = async (_id) => {
    // console.log("like this post => ", _id);
    try {
      const { data } = await axios.put("/like-post", { _id });
      // console.log("liked", data);
      newsFeed();
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnlike = async (_id) => {
    // console.log("unlike this post => ", _id);
    try {
      const { data } = await axios.put("/unlike-post", { _id });
      // console.log("unliked", data);
      newsFeed();
    } catch (err) {
      console.log(err);
    }
  };

  const handleComment = (post) => {
    setCurrentPost(post);
    setVisible(true);
  };

  const addComment = async (e) => {
    e.preventDefault();
    // console.log("Add a comment to this post id", currentPost._id);
    // console.log("Comment", comment);
    try {
      const { data } = await axios.put("/add-comment", {
        postId: currentPost._id,
        comment,
      });
      console.log("add comment", data);
      setComment("");
      setVisible(false);
      newsFeed();
    } catch (err) {
      console.log(err);
    }
  };

  const removeComment = async (postId, comment) => {
    let answer = window.confirm("Are you sure?");
    if (!answer) return;
    try {
      const { data } = await axios.put("/remove-comment", {
        postId,
        comment,
      });
      console.log("a comment removed", data);
      newsFeed();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <UserRoute>
      <div className="container-fluid">
        <div className="row py-5 text-light bg-default-image">
          <div className="col text-center">
            <h1>Newsfeed</h1>
          </div>
        </div>

        <div className="row py-3">
          <div className="col-md-8">
            <PostForm
              content={content}
              setContent={setContent}
              postSubmit={postSubmit}
              handleImage={handleImage}
              uploading={uploading}
              image={image}
            />
            <br />
            <PostList
              posts={posts}
              handleDelete={handleDelete}
              handleLike={handleLike}
              handleUnlike={handleUnlike}
              handleComment={handleComment}
              removeComment={removeComment}
            />

            <Pagination
              current={page}
              onChange={(pageNumber) => {
                setPage(pageNumber);
              }}
              total={Math.ceil((totalPosts / 3) * 10)}
              className="pb-5"
            />
          </div>

          {/* <pre>{JSON.stringify(posts, null, 4)}</pre> */}

          <div className="col-md-4">
            <Search />
            <br />
            {state && state.user && state.user.following && (
              <Link href={`/user/following`}>
                <a className="h6">{state.user.following.length} following</a>
              </Link>
            )}
            {people.length > 0 && (
              <People people={people} handleFollow={handleFollow} />
            )}
          </div>
        </div>

        <Modal
          open={visible}
          onCancel={() => setVisible(false)}
          title="Comment"
          footer={null}
        >
          <CommentForm
            comment={comment}
            setComment={setComment}
            addComment={addComment}
          />
        </Modal>
      </div>
    </UserRoute>
  );
};

export default Home;
