import React from "react";
import ReactApexChart from "react-apexcharts";
// import charts from "react-apexcharts";

class DonutChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          width: 380,
          type: "donut",
        },
        labels: ["Join Domain", "Wait Join"],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "right",
              },
            },
          },
        ],
        colors: ["#4C51BF", "#E53E3E"],
      },
      series: [150, 90],
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="donut"
          height="auto"
        />
      </div>
    );
  }
}

export default DonutChart;

// const PieChart_cctv = (props) => {
//   const [chartOptions, setChartOptions] = useState({});
//   const [chartSeries, setChartSeries] = useState([]);

//   useEffect(() => {
//     // Update chart data when the incoming data prop changes
//     if (props.dataAPI && props.dataAPI.length > 0) {
//       const sortedData = [...props.dataAPI].sort(
//         (a, b) => a.condition_count - b.condition_count
//       );
//       const labels = sortedData.map(
//         (item) => `${item.condition_cam} - ${item.position_cam}`
//       );
//       const values = sortedData.map((item) => parseInt(item.condition_count));

//       setChartOptions({
//         chart: {
//           id: "donut-chart",
//           width: "100%",
//           toolbar: {
//             show: true,
//           },
//         },
//         labels,
//         legend: {
//           position: "bottom",
//           horizontalAlign: "center",
//           fontSize: "13px",
//         },
//         dataLabels: {
//           enabled: true,
//           style: {
//             fontSize: "16px",
//           },
//         },
//         responsive: [
//           {
//             breakpoint: 480,
//             options: {
//               chart: {
//                 width: 300,
//               },
//               legend: {
//                 position: "bottom",
//               },
//             },
//           },
//         ],
//       });

//       setChartSeries(values);
//     } else {
//       setChartOptions({});
//       setChartSeries([]);
//     }
//   }, [props.dataAPI]);

//   return (
//     <div>
//       <Chart
//         options={chartOptions}
//         series={chartSeries}
//         type="donut"
//         width={480}
//         height={500}
//       />
//     </div>
//   );
// };

// export default PieChart_cctv;
