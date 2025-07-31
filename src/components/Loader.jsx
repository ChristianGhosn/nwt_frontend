import { MoonLoader, BarLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-40 w-full">
      <BarLoader
        color="#f9fafb" // light mode #101828"
        cssOverride={null}
        loading
        height={20}
        width={150}
        speedMultiplier={0.5}
      />
    </div>
  );
};

export default Loader;
