import { useContext, useState, useEffect } from "react";
import { Avatar, Card } from "antd";
import { useRouter } from "next/router";
import { UserContext } from "../../context";
import axios from "axios";
import { RollbackOutlined } from "@ant-design/icons";
import Link from "next/link";
import { toast } from "react-toastify";
import moment from "moment";

const { Meta } = Card;

const Username = () => {
  const [state, setState] = useContext(UserContext);
  const [user, setUser] = useState({});

  const router = useRouter();

  useEffect(() => {
    if (router.query.username) fetchUser();
  }, [router.query.username]);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`/user/${router.query.username}`);
      // console.log("router.query.username =>", data);
      setUser(data);
    } catch (err) {
      console.log(err);
    }
  };

  const imageSource = (user) => {
    if (user.image) {
      return user.image.url;
    } else {
      return "/images/user-avatar-default.jpg";
    }
  };

  return (
    <div className="row col-md-2 offset-md-5">
      {/* <pre>{JSON.stringify(user, null, 4)}</pre> */}

      <div className="pt-5 pb-5">
        <Card
          // style={{ width: "30%", height: "30%" }}
          hoverable
          cover={<img alt={user.name} src={imageSource(user)} />}
        >
          <Meta title={user.name} description={user.about} />
          <p className="pt-2 text-muted">
            Joined {moment(user.createdAt).fromNow()}
          </p>
          <div className="d-flex justify-content-between">
            <span className="btn btn-sm">
              {user.followers && user.followers.length} followers
            </span>
            <span className="btn btn-sm">
              {user.following && user.following.length} following
            </span>
          </div>
        </Card>

        <Link href="/user/dashboard">
          <a className="d-flex justify-content-center pt-5">
            <RollbackOutlined />
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Username;
