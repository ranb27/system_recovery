import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import ReactApexChart from "react-apexcharts";
import Chart from "react-apexcharts";
import CircularProgress from "@mui/material/CircularProgress";

//* Components
import Navbar from "../components/Navbar/Navbar";
import ComputerInProcessSearchGroup from "../components/searchgroup/ComputerInProcessSearch";

//* MUI
import Box from "@mui/material/Box";

function RasberyPi() {
  useState(() => {
    Swal.fire({
      title: "Rasbery Pi",
      text: "This page is not ready yet.",
      icon: "info",
      confirmButtonText: "OK",
    });
  }, []);

  //* Responsive Navbar
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const handleNavbarToggle = (openStatus) => {
    setIsNavbarOpen(openStatus);
  };

  const [selecteddivision, setSelecteddivision] = useState({
    division: "Division",
  });
  const [selectedDepartment, setSelectedDepartment] = useState({
    dep_unit: "Department",
  });
  const [selectedCostCenter, setSelectedCostCenter] = useState({
    cost_center_name: "Cost Center",
  });

  //*Total PC *//
  const [pcStatus, setPcStatus] = useState([]);

  useEffect(() => {
    const fetchDataPC = async () => {
      const response = await axios.get(
        `http://10.17.66.242:3001/api/smart_recovery/filter-data-count-status?division=${selecteddivision}&department=${selectedDepartment}&cost_center=${selectedCostCenter}`
      );
      const data = response.data;

      const statusData = {
        total_pc: 0,
        pc_connect: 0,
        wait_connect: 0,
      };

      data.map((item) => {
        statusData.total_pc = item.total_pc;
        statusData.pc_connect = item.pc_connect;
        statusData.wait_connect = item.wait_connect;
      });

      // console.log("Status Data:", statusData);

      setPcStatus(statusData);
    };

    fetchDataPC();
  }, [selecteddivision, selectedDepartment, selectedCostCenter]);

  //*Charts *//

  //*Use For Chart *//
  const BarChartUseFor = () => {
    const [useForData, setUseForData] = useState({});

    useEffect(() => {
      const fetchDataUseForChart = async () => {
        const response = await axios.get(
          `http://10.17.66.242:3001/api/smart_recovery/filter-data-count-chart-pc-use-for?division=${selecteddivision}&department=${selectedDepartment}&cost_center=${selectedCostCenter}`
        );

        let data = response.data;

        // console.log("Data:", data);

        const useForData = {
          Center: 0,
          Personal: 0,
          Resign: 0,
        };

        data.forEach((item) => {
          useForData[item.pc_use_for] = item.count_pc_use_for;
        });

        // console.log("Use For Data:", useForData);

        setUseForData(useForData);
      };

      fetchDataUseForChart();
    }, [selecteddivision, selectedDepartment, selectedCostCenter]);

    const state = {
      series: [
        {
          name: "Center",
          data: [useForData.Center],
        },
        {
          name: "Personal",
          data: [useForData.Personal],
        },
        {
          name: "Resign",
          data: [useForData.Resign],
        },
        {
          name: "Machine",
          data: [useForData.Machine],
        },
        {
          name: "Scan WIP",
          data: [useForData.Scan],
        },
        {
          name: "CCTV",
          data: [useForData.Cctv],
        },
        {
          name: "Scrap",
          data: [useForData.Scrap],
        },
        {
          name: "Server",
          data: [useForData.Server],
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
        width={310}
      />
    );
  };

  //*Building Chart *//
  const BarChartBuilding = () => {
    const [buildingData, setBuildingData] = useState({});

    useEffect(() => {
      const fetchDataBuildingChart = async () => {
        const response = await axios.get(
          `http://10.17.66.242:3001/api/smart_recovery/filter-data-count-chart-building?division=${selecteddivision}&department=${selectedDepartment}&cost_center=${selectedCostCenter}`
        );

        let data = response.data;

        // console.log("Building Data:", data);

        const buildingData = {
          A: 0,
          B: 0,
          C: 0,
          C1: 0,
          C2: 0,
          C2_2F: 0,
          C3: 0,
          D: 0,
        };

        data.map((item) => {
          buildingData[item.building] = item.count_building;
        });

        // console.log("Building Data:", buildingData);

        setBuildingData(buildingData);
      };

      fetchDataBuildingChart();
    }, [selecteddivision, selectedDepartment, selectedCostCenter]);

    const state = {
      series: [
        {
          name: "A",
          data: [buildingData.A],
        },
        {
          name: "B",
          data: [buildingData.B],
        },
        {
          name: "C",
          data: [buildingData.C],
        },
        {
          name: "C1",
          data: [buildingData.C1],
        },
        {
          name: "C2",
          data: [buildingData.C2],
        },
        {
          name: "C2 2F",
          data: [buildingData.C2_2F],
        },
        {
          name: "C3",
          data: [buildingData.C3],
        },
        {
          name: "D",
          data: [buildingData.D],
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
        width={290}
      />
    );
  };

  //*Join Domain Chart *//
  const DonutChartJoinDomain = () => {
    const [chartOptions, setChartOptions] = useState({});
    const [chartSeries, setChartSeries] = useState([]);
    const [dataFetched, setDataFetched] = useState(false); // Track if data is fetched

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `http://10.17.66.242:3001/api/smart_recovery/filter-data-count-chart-join-domain?division=${selecteddivision}&department=${selectedDepartment}&cost_center=${selectedCostCenter}`
          );
          const data = response.data;

          if (data && data.length > 0) {
            // Data is available, prepare chart options and series
            const sortedData = [...data].sort(
              (a, b) => a.count_join_domain - b.count_join_domain
            );
            const labels = sortedData.map((item) => item.join_domain_status);
            const values = sortedData.map((item) =>
              parseInt(item.count_join_domain)
            );

            setChartOptions({
              chart: {
                id: "donut-chart",
                toolbar: {
                  show: true,
                },
              },
              labels,
              legend: {
                position: "right",
              },
              dataLabels: {
                enabled: true,
              },

              colors: [" #eab308 ", " #22c55e "],
            });

            setChartSeries(values);
            setDataFetched(true); // Set dataFetched to true when data is fetched
          } else {
            setChartOptions({});
            setChartSeries([]);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }, []);

    return (
      <div>
        {dataFetched ? ( // Conditionally render the chart when data is fetched
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="donut"
            width={350}
            height={150}
          />
        ) : (
          <div className="flex flex-col justify-center items-center h-48 mx-8 lg:mx-24">
            <CircularProgress color="success" />
            <span className=" text-yellow-600 text-md font-bold mt-4 whitespace-nowrap">
              Waiting for Search
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Navbar onToggle={handleNavbarToggle} />
      <div className="container mt-20 ml-12">
        <Box
          marginLeft={isNavbarOpen ? "220px" : 4}
          marginTop={8}
          className={`transition-all duration-500 ease-in-out ${
            isNavbarOpen ? "ml-64" : ""
          }`}
        >
          {/* //Chart Group */}

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="container flex gap-4 w-fit h-fit">
              <div className="col-span-1 w-52 hover:translate-x-1 hover:-translate-y-1 transition duration-300 ease-in-out cursor-pointer">
                <div className="bg-blue-500 rounded-lg p-4 shadow-lg hover:bg-blue-600 transition-colors ease-linear duration-300 hover:shadow-none animate-fade">
                  <p className="text-white text-xl font-bold">Total PC</p>
                  <div className="bg-white rounded-lg p-4 mt-9 h-16">
                    <p className="text-blue-700 text-3xl font-bold">
                      {pcStatus.total_pc}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-span-1 w-52 hover:translate-x-1 hover:-translate-y-1 transition duration-300 ease-in-out cursor-pointer">
                <div className="bg-green-500 rounded-lg p-4 shadow-lg hover:bg-green-600 transition-colors ease-linear duration-300 hover:shadow-none animate-fade">
                  <p className="text-white text-xl font-bold">PC Connect</p>
                  <div className="bg-white rounded-lg p-4 mt-9 h-16">
                    <p className="text-green-700 text-3xl font-bold">
                      {pcStatus.pc_connect !== null ? pcStatus.pc_connect : 0}{" "}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-span-1 w-52 hover:translate-x-1 hover:-translate-y-1 transition duration-300 ease-in-out cursor-pointer">
                <div className="bg-yellow-500 rounded-lg p-4 shadow-lg hover:bg-yellow-600 transition-colors ease-linear duration-300 hover:shadow-none animate-fade">
                  <p className="text-white text-xl font-bold">Wait Connect</p>
                  <div className="bg-white rounded-lg p-4 mt-9 h-16">
                    <p className="text-yellow-700 text-3xl font-bold">
                      {pcStatus.wait_connect !== null
                        ? pcStatus.wait_connect
                        : 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col w-screen lg:w-1/3 lg:flex-row animate-fade">
              <div className="container flex h-48">
                <div className="bg-white rounded-lg mb-8 mr-4 shadow-lg text-left w-52 lg:w-full overflow-hidden lg:overflow-visible">
                  <BarChartUseFor />
                </div>
                <div className="bg-white rounded-lg mb-8 mr-4 shadow-lg text-left w-52 lg:w-full overflow-hidden lg:overflow-visible">
                  <BarChartBuilding />
                </div>
                <div className="bg-white rounded-lg mb-8 mr-4 shadow-lg text-left w-52 lg:w-full overflow-hidden lg:overflow-visible flex items-center">
                  <DonutChartJoinDomain />
                </div>
              </div>
            </div>
          </div>

          {/* //Search Group */}

          <div className="mb-60 lg:mb-6">
            {/* <Computer_In_Process_Search_Group onSearch={onSearch} /> */}
            <ComputerInProcessSearchGroup
              onSearch={(queryParams) => {
                setSelecteddivision(queryParams.division);
                setSelectedDepartment(queryParams.Department);
                setSelectedCostCenter(queryParams.Cost_center);
              }}
            />
          </div>
        </Box>
      </div>
    </>
  );
}

export default RasberyPi;
