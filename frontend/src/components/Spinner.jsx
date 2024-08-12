import ClipLoader from "react-spinners/ClipLoader";

// const override = {
//   display: "block",
//   margin: "100px auto",
//   // position: "relative",
//   // height: "150px",
//   // width: "150px",
//   // left: "250px",
//   // margin: "20px",
// };

const Spinner = ({ loading }) => {
  return (
    <ClipLoader
      color="#4338ca"
      loading={loading}
      // cssOverride={override}
      size={135}
    />
  );
};
export default Spinner;
