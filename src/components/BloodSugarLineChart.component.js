import React from "react";
import { Line } from "react-chartjs-2";

// "chart.js": "^2.9.4",
// "react-chartjs-2": "^2.11.1"
const ext_data = [11, 19, 3, 5, 2, 3, 14, 19];
// const ll = Array.from(Array(ext_data.length).keys());
const ll = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

const data = {
  labels: ll,
  datasets: [
    {
      label: "Profit$",
      data: ext_data,
      fill: false,
      backgroundColor: "rgb(255, 99, 132)",
      borderColor: "rgba(255, 99, 132, 0.4)"
    }
  ]
};

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true
        }
      }
    ]
  }
};

const LineChart = () => (
  <>
    <div className="header">
      <h1 className="title">Profit Trend</h1>
      <div className="links"></div>
    </div>
    <Line data={data} options={options} />
  </>
);

export default LineChart;