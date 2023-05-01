// ./components/LineChart.js

import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";



const LineChart = (props) => {

  const labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const data = {
    labels: labels,
    datasets: [
      {
        label: "My First dataset",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: [0, 10, 5, 2, 20, 30, 45],
      },
    ],
  };





  return (
    <div>
      <Line data={data} />
    </div>
  );
};

export default LineChart;