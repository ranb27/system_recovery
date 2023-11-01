import ReactApexChart from "react-apexcharts";

const BarChart = () => {
  const state = {
    series: [
      {
        name: "Machine",
        data: [44],
      },
      {
        name: "Scan",
        data: [13],
      },
      {
        name: "Personal",
        data: [11],
      },
      {
        name: "CCTV",
        data: [21],
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
      height={160}
      width={300}
    />
  );
};

export default BarChart;
