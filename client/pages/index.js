import { useContext } from "react";
import { UserContext } from "../context";
import ParallaxBg from "../components/cards/ParallaxBg";

const Home = () => {
  const [state, setState] = useContext(UserContext);

  return (
    <>
      <ParallaxBg url="/images/default.jpg" />
    </>
  );
};

export default Home;
