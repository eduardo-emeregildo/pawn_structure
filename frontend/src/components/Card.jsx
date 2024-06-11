import React from "react";

const Card = () => {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <figure>
        <img
          src="https://lichess1.org/export/fen.gif?fen=8/pp3ppp/4p3/8/3P4/8/PP3PPP/8_w_-_-_0_1&color=white"
          alt="Chessboard"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">IQP Pawn Structure</h2>
        <p>This structure is defined by </p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Buy Now</button>
        </div>
      </div>
    </div>
  );
};

export default Card;
