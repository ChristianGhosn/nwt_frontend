import { HardHat } from "lucide-react";
import { Link } from "react-router";

const Construction = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <HardHat size={64} strokeWidth={1.5} />
      <h1 className="text-xl">Page Under Construction</h1>
      <Link to="/" className="mt-4">
        <div className="text-white bg-blue-500 px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors">
          Go back to home
        </div>
      </Link>
    </div>
  );
};

export default Construction;
