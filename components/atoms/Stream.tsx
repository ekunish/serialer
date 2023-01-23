import React from "react";
import {
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  ChartOptions,
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
  data: any;
  visibleChannels: boolean[];
};

const Stream = (props: Props) => {
  const inputData = props.data;
  (inputData.length > 200) ? inputData.shift() : inputData;
  const time: any[] = inputData.map((value: number[]) => value[0]);

  const datasets = () => {
    let plotData: any[] = [];

    const colors = [
      "rgb(255, 99, 132)",
      "rgb(54, 162, 235)",
      "rgb(255, 206, 86)",
      "rgb(75, 192, 192)",
      "rgb(153, 102, 255)",
      "rgb(255, 159, 64)",
      "rgb(255, 99, 132)",
      "rgb(54, 162, 235)",
      "rgb(255, 206, 86)",
      "rgb(75, 192, 192)",
      "rgb(153, 102, 255)",
    ];

    for (let i = 1; i < inputData[0]?.length; i++) {
      if (!props.visibleChannels[i - 1]) continue;

      const dataset: number[] = inputData.map((value: number[]) => value[i]);
      plotData.push({
        label: i,
        data: dataset,
        borderWidth: 2,
        pointRadius: 0,
        borderColor: colors[i - 1],
      });
    }
    return plotData;
  };

  const data: ChartData<"line"> = {
    labels: time,
    datasets: datasets(),
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
      },
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        // type: "linear",
        // display: true,
      },
    },
    animations: {
      tension: {
        duration: 0,
        easing: 'linear',
        from: 1,
        to: 0,
        loop: true
      }
    },
  };

  return (
    <div>
      <Line options={options} data={data} />
    </div>
  );
};

export default Stream;
