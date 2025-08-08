import { MoonLoader, BarLoader } from "react-spinners";
import { useTheme } from "../hooks/useTheme";

const Loader = () => {
  const [isDarkMode] = useTheme();

  return (
    <div className="flex items-center justify-center h-40 w-full">
      <BarLoader
        color={isDarkMode ? "#f9fafb" : "#101828"}
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
