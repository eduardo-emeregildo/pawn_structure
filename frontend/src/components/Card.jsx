import React from "react";
const Card = ({ name, description, img }) => {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <figure>
        <img src={`/src/assets/${img}.gif`} alt={`${name} pawn structure`} />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <p>{description}</p>
        <div className="card-actions justify-end pt-1">
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
