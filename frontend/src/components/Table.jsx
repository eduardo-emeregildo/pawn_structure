import React from "react";

const Table = ({ games }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table bg-white">
        {/* head */}
        <thead>
          <tr>
            <th>White name</th>
            <th>White Elo</th>
            <th>Black name</th>
            <th>Black elo</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          <tr className="hover">
            <th className="font-normal">Alexander Alekhine</th>
            <td>2720</td>
            <td>Jose Capablanca</td>
            <td>2730</td>
            <td>1-0</td>
          </tr>
          {/* row 2 */}
          <tr className="hover">
            <th className="font-normal">Kasparov</th>
            <td>2750</td>
            <td>Karpov</td>
            <td>2720</td>
            <td>1-0</td>
          </tr>
          {/* row 3 */}
          <tr className="hover">
            <th className="font-normal">Stein</th>
            <td>2720</td>
            <td>Korchnoi</td>
            <td>2721</td>
            <td>1-0</td>
          </tr>

          <tr>
            <td>
              <button
                className="btn"
                onClick={() => {
                  console.log("games is: ", games);
                }}
              >
                Load more Games
              </button>
            </td>
          </tr>

          {/* <button className="btn m-2">Load More Games</button> */}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
