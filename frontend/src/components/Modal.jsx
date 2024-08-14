// import ClipLoader from "react-spinners/ClipLoader";
import Card from "./Card";
import { toast } from "react-toastify";

const Modal = ({
  planObj,
  fetchGames,
  fetchCaption,
  fetchFen,
  fetchPgn,
  fetchHalfMoves,
}) => {
  return (
    <div>
      <button
        className="col-span-2 btn-block text-left"
        onClick={() => {
          // name = plans[planId].name;
          // description = plans[planId].description;
          document.getElementById(planObj.id).showModal();
        }}
      >
        {planObj.name}
      </button>
      <dialog id={planObj.id} className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <div className="flex max-[768px]:flex-col max-[768px]:items-center max-[768px]:gap-5  justify-around flex-row">
            <Card
              name={planObj.name}
              description={planObj.description}
              img={planObj.img}
            />

            <div className="flex max-[768px]:flex-row  max-[768px]:w-full flex-col  w-[50%] justify-center">
              <div className="flex card bg-base-300 max-[768px]:w-11/12 rounded-box pb-1 h-fit">
                <h3 className="font-bold max-[550px]:text-lg text-2xl pb-1 text-center">
                  Plans For White
                </h3>
                <div className="join join-vertical">
                  {planObj.whitePlans.map((whitePlan, index) => (
                    <p
                      key={index}
                      className="list-item list-disc list-inside py-1 px-2 max-[550px]:text-xs text-start whitespace-pre-line tracking-wide "
                    >
                      {whitePlan}
                    </p>
                  ))}
                </div>
              </div>

              <div
                className={`divider${window.screen.width <= 768 ? " divider-horizontal" : ""}`}
              ></div>

              <div className="flex card bg-base-300 max-[768px]:w-11/12 rounded-box  pb-1 h-fit">
                <h3 className="font-bold max-[550px]:text-lg text-2xl pb-1 text-center">
                  Plans For Black
                </h3>
                <div className="join join-vertical">
                  {planObj.blackPlans.map((blackPlan, index) => (
                    <p
                      key={index}
                      className="list-item list-disc list-inside py-1 px-2 max-[550px]:text-xs text-start whitespace-pre-line tracking-wide"
                    >
                      {blackPlan}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button, it will close the modal */}
              <button
                className="btn btn-primary"
                onClick={async () => {
                  try {
                    //planObj.img is also the name of the table
                    const res = await fetch(`api/queries/${planObj.img}/0`);
                    const data = await res.json();

                    //runs in the context of PlayArea. This is where games state var is updated in PlayArea
                    fetchGames(data);
                    fetchCaption(planObj.name);
                    toast.success("Games loaded succesfully");
                    //somehow have to set tablename state in table component to the corresponding tablename(data.tableName)
                  } catch (error) {
                    console.log("Error fetching data:DDD", error);
                    toast.error("Error fetching games");
                  } finally {
                    fetchFen(
                      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
                    );
                    fetchPgn("");
                    fetchHalfMoves(0);
                    document
                      .getElementById("mainDropdown")
                      .toggleAttribute("open");
                  }
                }}
              >
                View Games
              </button>
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => {
                  document
                    .getElementById("mainDropdown")
                    .toggleAttribute("open");
                }}
              >
                ✕
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Modal;
