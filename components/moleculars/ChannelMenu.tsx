import React, { ReactNode, useEffect, useState } from "react";

type Props = {
  setVisibleChannels: (value: React.SetStateAction<boolean[]>) => void;
};

const ChannelSelect = (props: Props) => {
  const [isList, setIsList] = useState(false);
  const [isCheck, setIsCheck] = useState<boolean[]>([]);

  const items = Array.from(Array(10).keys()).map((i) => i + 1);

  const itemList: ReactNode[] = [];

  useEffect(() => {
    setIsCheck(items.map(() => true));
  }, []);

  const updateCheck = (index: number) => {
    setIsCheck(isCheck.map((item, i) => (i === index ? !item : item)));
  };

  useEffect(() => {
    props.setVisibleChannels(isCheck);
  }, [isCheck]);

  items.forEach((item, index) => {
    itemList.push(
      <button key={index} className="p-1" onClick={() => updateCheck(index)}>
        <input
          type="checkbox"
          // defaultChecked={true}
          checked={isCheck[index]}
          onChange={() => updateCheck(index)}
          className="mr-5"
        />
        {item}
      </button>,
    );
  });

  return (
    <div className="">
      <div
        onClick={() => setIsList(!isList)}
        className="w-32 p-4 shadow rounded bg-gray-50 text-sm font-medium leading-none text-gray-800 flex items-center justify-between cursor-pointer hover:bg-white"
      >
        Channels
        <div>
          {isList
            ? (
              <div>
                <svg
                  width={10}
                  height={6}
                  viewBox="0 0 10 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.00016 0.666664L9.66683 5.33333L0.333496 5.33333L5.00016 0.666664Z"
                    fill="#1F2937"
                  />
                </svg>
              </div>
            )
            : (
              <div>
                <svg
                  width={10}
                  height={6}
                  viewBox="0 0 10 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.00016 5.33333L0.333496 0.666664H9.66683L5.00016 5.33333Z"
                    fill="#1F2937"
                  />
                </svg>
              </div>
            )}
        </div>
      </div>

      {isList && (
        <div className="w-32 mt-2 p-4 bg-white shadow rounded absolute">
          {itemList}
          <div className="text-center mt-2">
            {(isCheck.includes(false))
              ? (
                <button
                  className="bg-blue-100 rounded-md w-full h-full"
                  onClick={() => {
                    setIsCheck(items.map(() => true));
                  }}
                >
                  All
                </button>
              )
              : (
                <button
                  className="bg-gray-50 rounded-md w-full h-full"
                  onClick={() => {
                    setIsCheck(items.map(() => false));
                  }}
                >
                  Clear
                </button>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelSelect;
