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
          <Card />

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
