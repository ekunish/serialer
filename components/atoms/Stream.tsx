import React, { Component } from "react";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

type Props = {
  time: any,
  data: any;
};

const Stream = (props: Props) => {
  // console.log(props)

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "グラフタイトル",
      },
    },
  };

  const data = {
    labels: props.time,
    datasets: [
      {
        label: "データ1",
        data: props.data,
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 1.5,
        radius: 0,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <div>
      <Line options={options} data={data} />
    </div>
  );
};

export default Stream;
