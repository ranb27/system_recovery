import * as React from "react";

//* Components
import Navbar from "../components/Navbar/Navbar";
import BarChart from "../components/Charts/ComputerInProcessBarCharts";
import DonutChart from "../components/Charts/ComputerInProcessDonutChart";

//* MUI
import Box from "@mui/material/Box";
import ReactApexChart from "react-apexcharts";
import Chart from "react-apexcharts";

function Summary() {
  //* Responsive Navbar
  const [isNavbarOpen, setIsNavbarOpen] = React.useState(false);

  const handleNavbarToggle = (openStatus) => {
    setIsNavbarOpen(openStatus);
  };

  //* ApexCharts data
  const chartData = {
    chart: {
      id: "basic-bar",
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    yaxis: {
      show: false,
    },
    grid: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    colors: ["#4C51BF"],
    series: [
      {
        name: "Sales",
        data: [30, 40, 45, 50, 49, 60, 70, 91, 125, 150, 180, 200],
      },
    ],
  };

  function RadialChart() {
    const options = {
      series: [44, 55, 67, 83],
      chart: {
        height: 350,
        type: "radialBar",
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: "22px",
            },
            value: {
              fontSize: "16px",
            },
            total: {
              show: true,
              label: "Total",
              formatter: function (w) {
                // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                return 249;
              },
            },
          },
        },
      },
      labels: ["Apples", "Oranges", "Bananas", "Berries"],
    };

    const series = [70]; // Replace with your data series

    return (
      <div className="radial-chart">
        <ReactApexChart
          options={options}
          series={series}
          type="radialBar"
          height={350}
        />
      </div>
    );
  }

  return (
    <>
      <Navbar onToggle={handleNavbarToggle} />
      <div className="container mt-24 ml-12">
        <Box
          marginLeft={isNavbarOpen ? "220px" : 4}
          marginTop={8}
          className={`transition-all duration-500 ease-in-out ${
            isNavbarOpen ? "ml-64" : ""
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-gray-500 font-medium text-sm mb-2">
                Total Sales
              </div>
              <div className="text-3xl font-bold text-gray-800">$12,345</div>
              <div className="text-green-500 text-sm font-medium mt-2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm0-8a2 2 0 11-4 0 2 2 0 014 0z"
                    clipRule="evenodd"
                  />
                </svg>
                10% increase from last month
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-gray-500 font-medium text-sm mb-2">
                Total Orders
              </div>
              <div className="text-3xl font-bold text-gray-800">678</div>
              <div className="text-red-500 text-sm font-medium mt-2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm0-8a2 2 0 11-4 0 2 2 0 014 0z"
                    clipRule="evenodd"
                  />
                </svg>
                5% decrease from last month
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-gray-500 font-medium text-sm mb-2">
                Total Customers
              </div>
              <div className="text-3xl font-bold text-gray-800">1,234</div>
              <div className="text-green-500 text-sm font-medium mt-2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm0-8a2 2 0 11-4 0 2 2 0 014 0z"
                    clipRule="evenodd"
                  />
                </svg>
                15% increase from last month
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 col-span-2">
              <div className="text-gray-500 font-medium text-sm mb-2">
                Sales Chart
              </div>
              <Chart
                options={chartData}
                series={chartData.series}
                type="bar"
                height={300}
              />
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 col-span-1">
              <RadialChart />
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 col-span-1 flex items-center">
              <DonutChart />
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 col-span-2">
              <div className="text-gray-500 font-medium text-sm mb-2">
                PC Use For
              </div>
              <BarChart />
            </div>
          </div>
        </Box>
      </div>
    </>
  );
}

export default Summary;
