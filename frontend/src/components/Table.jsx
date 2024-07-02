import { toast } from "react-toastify";
const Table = ({ games, caption, fetchGames }) => {
  return (
    <div className="overflow-x-auto max-h-64 bg-white rounded-md">
      <table className=" table bg-white">
        <caption className="mt-2 text-xl font-semibold leading-none tracking-tight text-gray-900 dark:text-white">
          {caption}
        </caption>
        {/* head */}
        <thead>
          <tr>
            <th>White Name</th>
            <th>White Elo</th>
            <th>Black Name</th>
            <th>Black elo</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {games.output.length == 0 ? (
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          ) : (
            games.output.map((game, id) => (
              <tr key={id} className="hover">
                <td>{game.whitename}</td>
                <td>{game.whiteelo == "0" ? "??" : game.whiteelo}</td>
                <td>{game.blackname}</td>
                <td>{game.blackelo == "0" ? "??" : game.blackelo}</td>
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

          {games.output.length == 0 ? (
            <tr>
              <td className="pr-0 pl-3">
                <button className="btn btn-disabled text-xs">View More</button>
              </td>
            </tr>
          ) : (
            <tr>
              <td className="pr-0 pl-3">
                <button
                  className="btn text-xs"
                  onClick={async () => {
                    try {
                      const res = await fetch(
                        `api/queries/${games.tableName}/${parseInt(games.offset) + 1}`
                      );
                      const data = await res.json();
                      console.log("res is: ", data);

                      //A deep copy is made here because react components dont rerender if they are shallow copies, or if the new modified state is referencing
                      const newGames = { ...games };
                      newGames.output.push(...data.output);
                      newGames.offset = data.offset;
                      fetchGames(newGames);
                      toast.success("Games loaded succesfully");
                    } catch (error) {
                      console.log("Error fetching data:DDD", error);
                      toast.error("Error fetching games");
                    }
                  }}
                >
                  View More
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
