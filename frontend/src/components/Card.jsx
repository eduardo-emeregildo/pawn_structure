import React from "react";
const Card = ({ name, description, img }) => {
  return (
    <div className="card max-[950px]:w-72 w-96 bg-base-100 shadow-xl">
      <figure>
        <img src={`/${img}.gif`} alt={`${name} pawn structure`} />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <p className="tracking-wide">{description}</p>
      </div>
    </div>
  );
};

export default Card;
