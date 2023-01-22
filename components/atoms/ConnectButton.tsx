import React from "react";

type Props = {
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
};

const ConnectButton = ({ children, onClick }: Props) => {
  return <button onClick={onClick} className='bg-blue-500 py-2 px-4 rounded-xl text-white hover:bg-blue-400'>{children}</button>;
};

export default ConnectButton;
