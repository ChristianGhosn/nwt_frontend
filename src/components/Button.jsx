import React from "react";

const Button = ({ children, onClick }) => {
  return (
    <button
      className="w-fit flex items-center gap-2 rounded-xl dark:bg-gray-300 bg-gray-800 px-4 py-2 text-gray-100 dark:text-gray-800 hover:bg-gray-700 dark:hover:bg-gray-400 cursor-pointer transition-colors duration-200"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
