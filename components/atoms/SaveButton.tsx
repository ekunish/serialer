import React from "react";

type Props = {
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
};

const SaveButton = ({ children, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className="bg-red-500 p-2 px-4 rounded-lg text-white hover:bg-red-400 shadow"
    >
      {children}
    </button>
  );
};

export default SaveButton;
