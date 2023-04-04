import Chart from "react-google-charts";
import moment from 'moment';

const days = ["Monday","Tuesday","Wednesday","Thursday","Friday"];


const WeightLineChart = ({ data }) => {
  const thisWeek = null;
  const chartData = [['Date', 'Blood Sugar']];

  for (var i = 0; i < data.length; i++) {    
    var date = new Date(data[i].createDate);
    var dateString = date.getDay();
    chartData.push([days[dateString], data[i].bloodSugarLevel])
  }

  const options = {
    chart: {
      title: "Blood Sugar Levels",
      subtitle: "(mg/dL)",
    },
  };

  var today = new Date();
  var day = today.getDay() || 7; // Get current day number, converting Sun. to 7
  if( day !== 1 )   {today.setHours(-24 * (day - 1));}             // Only manipulate the date if it isn't Mon.
         // Set the hours to day number minus 1
                                          //   multiplied by negative 24

  return <>
    <h3>Week of { moment(today).format('MM-DD-YYYY') } </h3>
    <Chart
    chartType="LineChart"
    data={chartData}
    options={options}
    width="80%"
    height="400px"
    legendToggle
  />
  </>
}

export default WeightLineChart;
