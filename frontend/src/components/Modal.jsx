import React from "react";
import Card from "./Card";

const Modal = ({ planObj }) => {
  // let name = "";
  // let description = "";
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
      <dialog id={planObj.id} className="modal ">
        <div className="modal-box w-11/12 max-w-5xl">
          <div className="flex justify-around">
            <Card
              name={planObj.name}
              description={planObj.description}
              img={planObj.img}
            />

            <div className="flex flex-col w-[50%] justify-center">
              <div className="grid  card bg-base-300 rounded-box place-items-center pb-1">
                <h3 className="font-bold text-2xl pb-1">Plans For White</h3>
                <div className="join join-vertical">
                  {planObj.whitePlans.map((whitePlan, index) => (
                    <p
                      key={index}
                      className="list-item list-disc list-inside py-1 px-2 text-start whitespace-pre-line tracking-wide"
                    >
                      {whitePlan}
                    </p>
                  ))}
                </div>
              </div>

              <div className="divider"></div>

              <div className="grid  card bg-base-300 rounded-box place-items-center pb-1">
                <h3 className="font-bold text-2xl pb-1">Plans For Black</h3>
                <div className="join join-vertical">
                  {planObj.blackPlans.map((blackPlan, index) => (
                    <p
                      key={index}
                      className="list-item list-disc list-inside py-1 px-2 text-start whitespace-pre-line tracking-wide"
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
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Modal;
