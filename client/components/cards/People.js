import { useContext } from "react";
import { Avatar } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import { UserContext } from "../../context";

const People = ({ people }) => {
  const [state] = useContext(UserContext);

  const router = useRouter();

  return (
    <>
      <pre>{JSON.stringify(people, null, 4)}</pre>
    </>
  );
};

export default People;
