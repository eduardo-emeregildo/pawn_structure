import { toast } from "react-toastify";
import Spinner from "./Spinner";
import { useState } from "react";
const Table = ({ games, caption, fetchGames, fetchFen, fetchPgn }) => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="overflow-x-auto max-h-64 bg-white rounded-md">
      {/* {loading ? <Spinner loading={loading} /> : null} */}
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
          ) : loading ? (
            <tr>
              <td className="sticky left-1/2 translate-x-[-50%] ">
                <Spinner loading={loading} />
              </td>
            </tr>
          ) : (
            games.output.map((game, id) => (
              <tr
                key={id}
                id={`t${id + 1}`}
                className="hover cursor-pointer"
                onClick={async (e) => {
                  setLoading(true);
                  try {
                    const res = await fetch(
                      `api/pgns/${games.tableName}/${e.currentTarget.id.slice(1)}/${games.tableName}/${games.output[e.currentTarget.id.slice(1) - 1].movenumber}`
                    );
                    const data = await res.json();
                    console.log("pgn is:", data);
                    //replace to remove line breaks
                    fetchFen(data.fen.replace(/(\r\n|\n|\r)/gm, ""));
                    // fetchPgn(data.pgn.replace(/(\r\n|\n|\r)/gm, "\n"));
                    fetchPgn(data.pgn);

                    //probably need to do the same to get pgn over to playArea
                    // console.log(e.currentTarget.id.slice(1));
                  } catch (error) {
                    console.log("Error fetching data:DDD", error);
                    toast.error("Error fetching pgn");
                  } finally {
                    setLoading(false);
                  }
                }}
              >
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
                  className="btn  text-xs"
                  onClick={async () => {
                    try {
                      const res = await fetch(
                        `api/queries/${games.tableName}/${parseInt(games.offset) + 1}`
                      );
                      const data = await res.json();
                      //A deep copy is made here because react components dont rerender if they are shallow copies, or if the new modified state is referencing: More info here: https://www.reddit.com/r/react/comments/u5wzbu/components_not_rerendering_with_state_changes/
                      const newGames = { ...games };
                      newGames.output.push(...data.output);
                      newGames.offset = data.offset;
                      // console.log("NEWGAMES IS: ", newGames);
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
