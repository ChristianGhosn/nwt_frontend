import { MoonLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-80 w-full">
      <MoonLoader
        color="#101828"
        cssOverride={null}
        loading
        size={50}
        speedMultiplier={0.5}
      />
    </div>
  );
};

export default Loader;
