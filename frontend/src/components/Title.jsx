import React from "react";
import { SiChessdotcom } from "react-icons/si";
import background from "../assets/chess-background-4-copy.jpg";

const Title = () => {
  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      {/* <div className="hero-overlay bg-opacity-60"></div> */}
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md">
          <h1 className="mb-5 text-6xl font-bold">Pawn Structure Search</h1>
          <p className="mb-5 text-xl">
            Understand chess at a deeper level. Search through 13+ million games
            by their corresponding pawn structure.
          </p>
          <button className="btn btn-primary">Learn More</button>
        </div>
      </div>
    </div>
  );
};

export default Title;
