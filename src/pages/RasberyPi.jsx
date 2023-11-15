import { useState, useEffect } from "react";

import axios from "axios";
import ReactApexChart from "react-apexcharts";
import Chart from "react-apexcharts";
import CircularProgress from "@mui/material/CircularProgress";

//* Components
import Navbar from "../components/Navbar/Navbar";
import RaspberyPiSearch from "../components/searchgroup/RaspberyPiSearch";

//* MUI
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { GridToolbar } from "@mui/x-data-grid";
import styled from "@mui/material/styles/styled";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

const StyledDataGrid = styled(DataGrid)({
  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: "bold",
    color: "#3371ff",
    fontSize: "15px",
    textAlign: "center",
    FontFace: "Poppins",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  "& ::-webkit-scrollbar": {
    width: "8px",
    height: "8px",
  },
  "& ::-webkit-scrollbar-track": {
    backgroundColor: "#ffffff",
  },
  "& ::-webkit-scrollbar-thumb": {
    borderRadius: "4px",

    backgroundColor: "#3b82f6",
  },
});

function RasberyPi() {
  //* Responsive Navbar
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const handleNavbarToggle = (openStatus) => {
    setIsNavbarOpen(openStatus);
  };

  //* Get user for update by data*//
  const userLoginInfo =
    localStorage.getItem("guestToken") || localStorage.getItem("userToken");
  const userLoginInfoJSON = userLoginInfo ? JSON.parse(userLoginInfo) : null;
  const userLogin = userLoginInfoJSON ? userLoginInfoJSON.user_login : null;
  //? Get user role no *//
  const userRoleNo = userLoginInfoJSON.role_no;
  //? Get user id code *//
  let userIdCode = userLoginInfoJSON.user_id_code;

  const [selecteddivision, setSelecteddivision] = useState({
    division: "Division",
  });
  const [selectedDepartment, setSelectedDepartment] = useState({
    dep_unit: "Department",
  });
  const [selectedCostCenter, setSelectedCostCenter] = useState({
    cost_center_name: "Cost Center",
  });

  //*Filter Model
  const [filterModel, setFilterModel] = useState({
    items: [],
    quickFilterExcludeHiddenColumns: true,
    quickFilterValues: [""],
  });

  //*Table
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const getRows = async () => {
      const response = await axios
        .get(
          `http://10.17.66.242:3001/api/smart_recovery/filter-data-computer-list?division=${selecteddivision}&department=${selectedDepartment}&cost_center=${selectedCostCenter}`
        )
        .then((res) => {
          setRows(res.data);
        });
      return response;
    };

    getRows();
  }, [selecteddivision, selectedDepartment, selectedCostCenter]);

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "project_name",
      headerName: "Project Name",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "pc_name",
      headerName: "PC Name",
      width: 110,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "pc_type",
      headerName: "PC Type",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "os",
      headerName: "OS",
      width: 70,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "emp_name_eng",
      headerName: "Name-Surname",
      width: 340,
      headerAlign: "center",
    },
    {
      field: "building",
      headerName: "Building",
      width: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "process",
      headerName: "Process",
      width: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "area",
      headerName: "Area",
      width: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "new_ip",
      headerName: "IP Address",
      width: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "connect_status",
      headerName: "Status Connect",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div
          style={{
            borderRadius: 10,
            padding: "4px 12px",
            color: params.value === "Network Connected" ? "white" : "black",
            backgroundColor:
              params.value === "Network Connected"
                ? "rgb(34 197 94)"
                : "rgb(234 179 8)",
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "connect_date",
      headerName: "Connect Date",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 70,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        if (userRoleNo === 1 || userRoleNo === 2 || userRoleNo === 5) {
          return (
            <button
              className="bg-purple-500 px-2 py-1.5 rounded-xl text-white hover:bg-purple-700 hover:scale-110 duration-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
              onClick={() => handleOpen(params.row)}
            >
              <EditIcon />
            </button>
          );
        } else if (userRoleNo === 3 && userIdCode === params.row.employee_id) {
          // Users with role 1 can only edit rows where their userIdCode matches the row's employee_id
          return (
            <button
              className="bg-purple-500 px-2 py-1.5 rounded-xl text-white hover:bg-purple-700 hover:scale-110 duration-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
              onClick={() => handleOpen(params.row)}
            >
              <EditIcon />
            </button>
          );
        } else if (userRoleNo === 4) {
          return (
            <button className="text-slate-300" disabled>
              <EditIcon />
            </button>
          );
        } else {
          return (
            <button className="text-slate-300" disabled>
              <EditIcon />
            </button>
          );
        }
      },
    },
  ];

  // console.log(
  //   `User Login: ${userLogin},
  //   User Role No: ${userRoleNo},
  //   Local Row ID Selected: ${selectedID},
  //   User ID Code: ${userIdCode}`
  // );
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState({});

  const handleOpen = (data) => {
    const selectedID = data.id;
    localStorage.setItem("selectedID", selectedID);
    setSelectedData(data);

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
            width={300}
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
          marginLeft={isNavbarOpen ? "210px" : 4}
          marginTop={8}
          className={`transition-all duration-500 ease-in-out ${
            isNavbarOpen ? "ml-64" : ""
          }`}
        >
          {/* //Chart Group */}

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="container flex gap-4 w-fit h-fit">
              <div className="col-span-1 w-52 hover:translate-x-1 hover:-translate-y-1 transition duration-300 ease-in-out cursor-pointer">
                <div className="bg-blue-500 rounded-lg p-4 shadow-lg hover:bg-blue-600 transition-colors ease-linear duration-300 hover:shadow-cyan-100 hover:shadow-xl animate-fade">
                  <p className="text-white text-xl font-bold">Total PC</p>
                  <div className="bg-white rounded-lg p-4 mt-9 h-16">
                    <p className="text-blue-700 text-3xl font-bold">
                      {pcStatus.total_pc}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-span-1 w-52 hover:translate-x-1 hover:-translate-y-1 transition duration-300 ease-in-out cursor-pointer">
                <div className="bg-green-500 rounded-lg p-4 shadow-lg hover:bg-green-600 transition-colors ease-linear duration-300 hover:shadow-lime-100 hover:shadow-xl animate-fade">
                  <p className="text-white text-xl font-bold">PC Connect</p>
                  <div className="bg-white rounded-lg p-4 mt-9 h-16">
                    <p className="text-green-700 text-3xl font-bold">
                      {pcStatus.pc_connect !== null ? pcStatus.pc_connect : 0}{" "}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-span-1 w-52 hover:translate-x-1 hover:-translate-y-1 transition duration-300 ease-in-out cursor-pointer">
                <div className="bg-yellow-500 rounded-lg p-4 shadow-lg hover:bg-yellow-600 transition-colors ease-linear duration-300 hover:shadow-amber-100 hover:shadow-xl animate-fade">
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
            <RaspberyPiSearch
              onSearch={(queryParams) => {
                setSelecteddivision(queryParams.division);
                setSelectedDepartment(queryParams.Department);
                setSelectedCostCenter(queryParams.Cost_center);
              }}
            />
          </div>

          {/* Table for Computer in Process */}
          <div
            className="shadow-xl animate-delay"
            style={{
              height: "55vh",
              width: isNavbarOpen ? "calc(95vw - 10vw)" : "90vw",
              marginTop: "16px",
              marginBottom: "16px",
            }}
          >
            <StyledDataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              slots={{ toolbar: GridToolbar }}
              onFilterModelChange={(newModel) => setFilterModel(newModel)}
              filterModel={filterModel}
              slotProps={{ toolbar: { showQuickFilter: true } }}
            />
          </div>

          {selectedData && (
            <Dialog open={open} onClose={handleClose} maxWidth="100vw">
              <DialogContent></DialogContent>
            </Dialog>
          )}
        </Box>
      </div>
    </>
  );
}

export default RasberyPi;
