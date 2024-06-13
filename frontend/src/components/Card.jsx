import React from "react";
import whiteIQP from "../assets/IQP.gif";

const Card = () => {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <figure>
        <img src={whiteIQP} alt="Chessboard" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">Isolated Queens Pawn (IQP)</h2>
        <p>
          This structure is defined by a pawn on the d file that has no
          neighboring pawns to protect it.
        </p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">View Games</button>
        </div>
      </div>
    </div>

    // <div className="flex">
    //   <figure>
    //     <img
    //       src="https://lichess1.org/export/fen.gif?fen=8/pp3ppp/4p3/8/3P4/8/PP3PPP/8_w_-_-_0_1&color=white"
    //       alt="Chessboard"
    //     />
    //   </figure>
    //   <p>This is IQP Structure</p>
    // </div>
  );
};

export default Card;
