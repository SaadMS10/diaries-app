import React, { FC } from "react";
import Diaries from "./Diaries";
import Header from "./Header";
import Example from "./EntryModal";

const Home: FC = () => {
  return (
    <div>
      <div>
        <Header />
        <Diaries />
      </div>

      <div>
        <Example />
      </div>
    </div>
  );
};

export default Home;
