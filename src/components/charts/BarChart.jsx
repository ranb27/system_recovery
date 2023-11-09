import ReactApexChart from "react-apexcharts";

const BarChart = () => {
  const state = {
    series: [
      {
        name: "Machine",
        data: [25],
      },
      {
        name: "Scan",
        data: [13],
      },
      {
        name: "Personal",
        data: [83],
      },
      {
        name: "CCTV",
        data: [32],
      },
      {
        name: "Scrap",
        data: [13],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 160,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "75%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: [""],
      },
      legend: {
        position: "right",
        offsetY: -10,
      },
    },
  };

  return (
    <ReactApexChart
      options={state.options}
      series={state.series}
      type="bar"
      height={150}
      width={700}
    />
  );
};

export default BarChart;
