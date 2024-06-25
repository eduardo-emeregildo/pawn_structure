import React from "react";

const Table = ({ games }) => {
  return (
    <div className="overflow-x-auto max-h-64 bg-white rounded-md">
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

          {games.length == 0 ? (
            <tr>
              <th className="font-normal"></th>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          ) : (
            games.map((game, id) => (
              <tr key={id} className="hover">
                <th className="font-normal">{game.whitename}</th>
                <td>{game.whiteelo}</td>
                <td>{game.blackname}</td>
                <td>{game.blackelo}</td>
                <td>
                  {game.result == "1" ? (
                    "1-0"
                  ) : game.result == "0" ? (
                    "0-1"
                  ) : (
                    <p>&#189; - &#189;</p>
                  )}
                </td>
              </tr>
            ))
          )}

          {/* <tr className="hover">
            <th className="font-normal">Alexander Alekhine</th>
            <td>2720</td>
            <td>Jose Capablanca</td>
            <td>2730</td>
            <td>1-0</td>
          </tr> */}

          {/* row 2 */}

          {/* <tr className="hover">
            <th className="font-normal">Kasparov</th>
            <td>2750</td>
            <td>Karpov</td>
            <td>2720</td>
            <td>1-0</td>
          </tr> */}

          {/* row 3 */}

          {/* <tr className="hover">
            <th className="font-normal">Stein</th>
            <td>2720</td>
            <td>Korchnoi</td>
            <td>2721</td>
            <td>1-0</td>
          </tr> */}

          {games.length == 0 ? (
            <tr>
              <td>
                <button className="btn btn-disabled">Load more Games</button>
              </td>
            </tr>
          ) : (
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
          )}

          {/* <button className="btn m-2">Load More Games</button> */}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
