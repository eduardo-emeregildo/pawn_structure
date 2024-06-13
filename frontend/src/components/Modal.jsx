import React from "react";
import Card from "./Card";

const Modal = ({ modalName }) => {
  return (
    <div>
      <button
        className="col-span-2 btn-block text-left"
        onClick={() => document.getElementById("my_modal_4").showModal()}
      >
        {modalName}
      </button>
      <dialog id="my_modal_4" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          {/* <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Click the button below to close</p> */}

          <div className="flex justify-around">
            <Card />
            {/* <div>
              <h3 className="font-bold text-lg underline">Plans For White</h3>
              <p>List of plans go here</p>
              <h3 className="font-bold text-lg underline">Plans For Black</h3>
              <p>List of plans go here</p>
            </div> */}

            <div className="flex flex-col w-[50%] justify-center">
              <div className="grid  card bg-base-300 rounded-box place-items-center pb-1">
                <h3 className="font-bold text-2xl pb-1">Plans For White</h3>
                <div className="join join-vertical">
                  <p className="list-item list-disc list-inside py-1 px-2 text-start whitespace-pre-line tracking-wide">
                    Create a kingside attack. Most standard plans will include
                    the moves Ne5,Bg5 and the battery Qd3-Bc2. In some cases a
                    piece sacrifice on the kingside is needed to break through.
                    Rooks are typically placed on e1 and d1 (or c1), and a rook
                    transfer via the third rank is possible
                  </p>

                  <p className="list-item list-disc list-inside py-1 px-2 text-start whitespace-pre-line tracking-wide">
                    Break in the center with d4-d5, trading pawns and opening
                    lines with an initiative (sometimes this break can be
                    achieved with a pawn sacrifice with the same purpose)
                  </p>
                </div>
              </div>

              <div className="divider"></div>

              <div className="grid  card bg-base-300 rounded-box place-items-center pb-1">
                <h3 className="font-bold text-2xl pb-1">Plans For Black</h3>
                <div className="join join-vertical">
                  <p className="list-item list-disc list-inside py-1 px-2 text-start whitespace-pre-line tracking-wide">
                    Trade pieces to win an endgame. In particular, exchange
                    white's good bishop (the light squared bishop)
                  </p>
                  <p className="list-item list-disc list-inside py-1 px-2 text-start whitespace-pre-line tracking-wide">
                    Place a knight on d5. This blockading square prevents the
                    central break d4-d5, and controls key squares. In an
                    endgame, a rook, bishop or king would be strong on this
                    square
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Modal;
