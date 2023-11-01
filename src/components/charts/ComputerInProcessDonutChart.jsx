import React from "react";
import ReactApexChart from "react-apexcharts";

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
          width={300}
        />
      </div>
    );
  }
}

export default DonutChart;
