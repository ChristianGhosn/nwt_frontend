import React from "react";
import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <p className="text-blue-500 text-lg">404</p>
      <h1 className="text-xl font-bold">Page not found</h1>
      <p className="text-gray-500 mt-2">
        Sorry, we couldn’t find the page you’re looking for.
      </p>
      <Link to="/" className="mt-4">
        <div className="text-white bg-blue-500 px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors">
          Go back to home
        </div>
      </Link>
    </div>
  );
};

export default NotFound;
