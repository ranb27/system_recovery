import ReactApexChart from "react-apexcharts";

const BarChart = () => {
  const state = {
    series: [
      {
        name: "Sales",
        data: [44, 55, 41, 37, 22, 43, 21],
      },
      {
        name: "Net Profit",
        data: [13, 23, 20, 8, 13, 27, 33],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
      },
    },
  };

  return (
    <ReactApexChart
      options={state.options}
      series={state.series}
      type="bar"
      height={350}
    />
  );
};

export default BarChart;
