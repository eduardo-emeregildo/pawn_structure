import React from "react";
import Title from "./components/Title";
import PlayArea from "./components/PlayArea";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const App = () => {
  return (
    <div>
      <Title />
      <PlayArea />
      <ToastContainer />
    </div>
  );
};

export default App;
