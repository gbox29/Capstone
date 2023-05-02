// ./components/LineChart.js

import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";



const LineChart = (props) => {
  const year = new Date().getFullYear();
  //console.log(props)

  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Quiz",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: props.quizCount,
      },
      {
        label: "Rating",
        backgroundColor: "rgb(54, 162, 235)",
        borderColor: "rgb(54, 162, 235",
        data: props.ratingCount,
      },
      {
        label: "Chapter",
        backgroundColor: "rgb(255, 206, 86)",
        borderColor: "rgb(255, 206, 86)",
        data: props.chapterCount,
      },
    ],
  };





  return (
    <div style={{textAlign: 'center'}}>
      <Line data={data} />
      <h1 style={{ fontSize: '1rem' }}>{year}</h1>
    </div>
  );
};

export default LineChart;