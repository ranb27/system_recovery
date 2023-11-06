import axios from "axios";
import Swal from "sweetalert2";
import * as React from "react";
import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

//* Computer in process page component *//

import Navbar from "../components/Navbar/Navbar";
import Computer_In_Process_Search_Group from "../components/searchgroup/computer_in_process_search";
import Chart from "react-apexcharts";

//*mui imports //

import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

//*Set style for page *//
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0, // breakpoint xs
      sm: 600, // breakpoint sm
      md: 960, // breakpoint md
      lg: 1280, // breakpoint lg
      xl: 1900, // breakpoint xl
    },
    palette: {
      primary: {
        light: "#757ce8",
        main: "#3f50b5",
        dark: "#002884",
        contrastText: "#fff",
      },
      secondary: {
        light: "#ff7961",
        main: "#f44336",
        dark: "#ba000d",
        contrastText: "#000",
      },
    },
  },
});

//*Set style for table *//

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
});

export default function ComputerInProcess() {
  const [selecteddivision, setSelecteddivision] = useState({
    division: "Division",
  });
  const [selectedDepartment, setSelectedDepartment] = useState({
    dep_unit: "Department",
  });
  const [selectedCostCenter, setSelectedCostCenter] = useState({
    cost_center_name: "Cost Center",
  });

  //*Table *//

  const [rows, setRows] = useState([]);

  useEffect(() => {
    const getRows = async () => {
      const response = await axios
        .get(
          `http://10.17.66.242:3001/api/smart_recovery/filter-data-computer-list?division=${selecteddivision}&department=${selectedDepartment}&cost_center=${selectedCostCenter}`
        )
        .then((res) => {
          setRows(res.data);

          // Filter and remove duplicate values using Set
          const pcNames = Array.from(
            new Set(res.data.map((item) => item.pc_name))
          );
          setPcNameOption(pcNames);

          const osVersions = Array.from(
            new Set(res.data.map((item) => item.os_version))
          );
          setOsVersionOption(osVersions);

          // const macAddresses = Array.from(
          //   new Set(res.data.map((item) => item.mac_address))
          // );
          // setMacAddressOption(macAddresses);

          const idCodes = Array.from(
            new Set(res.data.map((item) => item.employee_id))
          );
          setIdCodeOption(idCodes);

          const costCenters = Array.from(
            new Set(res.data.map((item) => item.cost_center_code))
          );
          setCostCenterOption(costCenters);
        });

      return response;
    };
    getRows();
  }, [selecteddivision, selectedDepartment, selectedCostCenter]);

  //*Filter option for building and area *//
  const handleBuildingChange = (event, newValue) => {
    setBuilding(newValue);

    // Fetch the areas for the selected building
    axios
      .get(
        `http://10.17.66.242:3001/api/smart_recovery/filter-building-area-list?building=${newValue}`
      )
      .then((res) => {
        setAreaOption(res.data.map((item) => item.area));
        setArea(""); // Clear the selected Area when Building changes
      });
  };

  //*Fetch data for refresh *//
  const fetchData = () => {
    // Fetch data from your API
    axios
      .get(
        `http://10.17.66.242:3001/api/smart_recovery/filter-data-computer-list?division=${selecteddivision}&department=${selectedDepartment}&cost_center=${selectedCostCenter}`
      )
      .then((res) => {
        // Update your component's state with the new data
        setRows(res.data);
      });
  };

  const columns = [
    // { field: "id", headerName: "No", width: 70 },
    {
      field: "factory_emp",
      headerName: "Factory",
      width: 70,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "pc_name",
      headerName: "PC Name",
      width: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "pc_type",
      headerName: "PC Type",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "os",
      headerName: "OS",
      width: 70,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "pc_use_for",
      headerName: "PC Use For",
      width: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "building",
      headerName: "Building",
      width: 90,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "process",
      headerName: "Process",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "area",
      headerName: "Area",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "employee_id",
      headerName: "User ID Code",
      width: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "emp_name_eng",
      headerName: "Name - Surname",
      width: 350,
      headerAlign: "center",
    },
    {
      field: "job_level",
      headerName: "Job Level",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "connect_status",
      headerName: "Status Connect",
      width: 160,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div
          style={{
            borderRadius: 10,
            padding: "4px 12px",
            color: params.value === "Network Connected" ? "white" : "black",
            backgroundColor:
              params.value === "Network Connected" ? "#4ade80" : "transparent",
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "cost_center_code",
      headerName: "Cost Center",
      width: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (userRoleNo === 1 || userRoleNo === 2 || userRoleNo === 5) {
          return (
            <Button variant="outlined" onClick={() => handleOpen(params.row)}>
              <EditIcon />
            </Button>
          );
        } else if (userIdCode === idCode && userRoleNo === 3) {
          return (
            <Button
              variant="outlined"
              onClick={() => handleOpen(params.row.employee_id)}
            >
              <EditIcon />
            </Button>
          );
        } else {
          return null;
        }
      },
    },
  ];

  //*Filter *//
  const [filterModel, setFilterModel] = React.useState({
    items: [],
    quickFilterExcludeHiddenColumns: true,
    quickFilterValues: [""],
  });

  //*Dialog *//
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState({});

  const handleOpen = (data) => {
    const selectedID = data.id;
    localStorage.setItem("selectedID", selectedID);
    setSelectedData(data);

    setPcName(data["pc_name"]);
    setPcType(data["pc_type"]);
    setOs(data["os"]);
    setOsVersion(data["os_version"]);
    setStartDate(data["start_date"]);
    setMacAddress(data["mac_address"]);
    setIpAddress(data["new_ip"]);
    setConnectType(data["connect_type"]);
    setJoinDomain(data["join_domain_status"]);
    setJoinDomainDate(data["join_domain_date"]);

    setPcUseFor(data["pc_use_for"]);
    setIdCode(data["employee_id"]);
    setNameSurname(data["emp_name_eng"]);
    setEmail(data["user_email"]);
    setJobLevel(data["job_level"]);
    setDivision(data["division"]);
    setDepartment(data["department_unit"]);
    setManager(data["supervision_name"]);
    setCostCenter(data["cost_center_code"]);
    setBuilding(data["building"]);
    setArea(data["area"]);

    setMfgPro(data["mfgpro_btp_fpc"]);
    setBtp(data["btp_only"]);
    setFpc(data["fpc_only"]);
    setHumatrix(data["humatrix"]);
    setZwcad(data["zwcad"]);
    setA1Server(data["a1_server"]);
    setEWorking(data["internet"]);
    setInternet(data["internet"]);

    setAntivirus(data["antivirus"]);
    setAntivirusStatus(data["antivirus_status"]);
    setEdrStatus(data["edr_status"]);

    setOpen(true);
  };

  //*Monitor selected ID after handleOpen *//
  let selectedID = localStorage.getItem("selectedID");
  const selectedComputerName = rows.find(
    (row) => row.id === selectedID
  )?.pc_name;

  //* Get user for update by data*//
  const userLoginInfo =
    localStorage.getItem("guestToken") || localStorage.getItem("userToken");
  const userLoginInfoJSON = userLoginInfo ? JSON.parse(userLoginInfo) : null;
  const userLogin = userLoginInfoJSON ? userLoginInfoJSON.user_login : null;

  //* Get user role no *//
  const userRoleNo = userLoginInfoJSON.role_no;

  //* Get user id code *//
  const userIdCode = userLoginInfoJSON.user_id_code;

  console.log("User Login:", userLoginInfo);
  console.log("User Login In:", userLoginInfoJSON);
  console.log("User Login:", userLogin);
  console.log("User Role No:", userRoleNo);
  console.log("Local ID:", selectedID);
  console.log("Selected Computer Name:", selectedComputerName);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    const editedData = {
      id: selectedData.id,
      selectedComputerName,
      pcName,
      pcType,
      os,
      osVersion,
      startDate,
      macAddress,
      ipAddress,
      connectType,
      joinDomain,
      joinDomainDate,

      pcUseFor,
      idCode,
      nameSurname,
      email,
      jobLevel,
      division,
      department,
      manager,
      costCenter,
      building,
      area,

      mfgPro,
      btp,
      fpc,
      humatrix,
      zwcad,
      a1Server,
      eWorking,
      internet,

      antivirus,
      antivirusStatus,
      edrStatus,

      updateBy: userLogin,
    };

    console.log("Edited Data:", editedData);

    handleClose();

    Swal.fire({
      title: "Are you sure?",
      text: "Please check the data before saving",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Save",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .get(
            `http://10.17.66.242:3001/api/smart_recovery/update-data-computer-master?row_id=${selectedData.id}&pc_name=${pcName}&pc_type=${pcType}&os=${os}&os_version=${osVersion}&mac_address=${macAddress}&pc_use_for=${pcUseFor}&employee_id=${idCode}&cost_center_code=${costCenter}&building=${building}&area=${area}&update_by=${userLogin}`
          )
          .then((res) => {
            console.log("Success:", res.data);
          });

        Swal.fire({
          icon: "success",
          title: "Save Success",
          text: "Save data to the database successfully",
          confirmButtonText: "OK",
        });

        fetchData();
      }
    });
  };

  //*Edit *//

  //state for edit data
  const [pcName, setPcName] = useState("");
  const [pcType, setPcType] = useState("");
  const [os, setOs] = useState("");
  const [osVersion, setOsVersion] = useState("");
  const [startDate, setStartDate] = useState("");
  const [macAddress, setMacAddress] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [connectType, setConnectType] = useState("");
  const [joinDomain, setJoinDomain] = useState("");
  const [joinDomainDate, setJoinDomainDate] = useState("");

  const [pcUseFor, setPcUseFor] = useState("");
  const [idCode, setIdCode] = useState("");
  const [nameSurname, setNameSurname] = useState("");
  const [email, setEmail] = useState("");
  const [jobLevel, setJobLevel] = useState("");
  const [division, setDivision] = useState("");
  const [department, setDepartment] = useState("");
  const [manager, setManager] = useState("");
  const [costCenter, setCostCenter] = useState("");
  const [building, setBuilding] = useState("");
  const [area, setArea] = useState("");

  const [mfgPro, setMfgPro] = useState("");
  const [btp, setBtp] = useState("");
  const [fpc, setFpc] = useState("");
  const [humatrix, setHumatrix] = useState("");
  const [zwcad, setZwcad] = useState("");
  const [a1Server, setA1Server] = useState("");
  const [eWorking, setEWorking] = useState("");
  const [internet, setInternet] = useState("");

  const [antivirus, setAntivirus] = useState("");
  const [antivirusStatus, setAntivirusStatus] = useState("");
  const [edrStatus, setEdrStatus] = useState("");

  //*option *//
  const [pcNameOption, setPcNameOption] = useState([]);
  const pcTypeOption = [
    "Desktop",
    "Laptop",
    "Server",
    "NAS",
    "Tablet",
    "Rasberry PI",
  ];
  const osOption = [
    "Win 11",
    "Win 10",
    "Win 8",
    "Win 7",
    "Win XP",
    "Embleded",
    "Mac",
  ];
  const [osVersionOption, setOsVersionOption] = useState([]);

  // const startDateOption = ["2021-10-01", "2021-10-02"];
  // const [macAddressOption, setMacAddressOption] = useState([]);
  // const [ipAddressOption, setIpAddressOption] = useState([]);
  // const connectTypeOption = [
  //   "LAN (WAN)",
  //   "WIFI (PRD_SCAN)",
  //   "WIFI (PRD_OFFICE)",
  // ];

  //User Data
  const pcUseForOption = [
    "Personal",
    "Machine",
    "Scan WIP",
    "CCTV",
    "Scrap",
    "Center",
    "Server",
    "Resign",
  ];
  const [idCodeOption, setIdCodeOption] = useState([]);
  // const [nameSurnameOption, setNameSurnameOption] = useState([]);
  // const [emailOption, setEmailOption] = useState([]);
  // const [jobLevelOption, setJobLevelOption] = useState([]);
  // const [divisionOption, setDivisionOption] = useState([]);
  // const [departmentOption, setDepartmentOption] = useState([]);
  // const [managerOption, setManagerOption] = useState([]);
  const [costCenterOption, setCostCenterOption] = useState([]);
  const buildingOption = ["A", "B", "C", "C1", "C2", "C2 2F", "C3", "D"];
  const [areaOption, setAreaOption] = useState([]);

  //Permission Data
  const mfgProOption = ["Yes", "No"];
  const btpOption = ["Yes", "No"];
  const fpcOption = ["Yes", "No"];
  const humatrixOption = ["Yes", "No"];
  const zwcadOption = ["Yes", "No"];
  const a1ServerOption = ["Yes", "No"];
  const eWorkingOption = ["Yes", "No"];
  const internetOption = ["Yes", "No"];

  //Security Data
  const antivirusOption = ["Kastersky", "Symantec", "Trend Micro", "McAfee"];
  const antivirusStatusOption = ["Normal", "Abnormal"];
  const edrStatusOption = ["Normal", "Abnormal"];

  //*Responsive for Navbar *//
  const [isNavbarOpen, setIsNavbarOpen] = React.useState(false);

  const handleNavbarToggle = (openStatus) => {
    setIsNavbarOpen(openStatus);
  };

  //*Total PC *//
  const [pcStatus, setPcStatus] = useState([]); //["Total PC", "PC Connect", "Wait Connect"
  // const [totalPC, setTotalPC] = useState(0);
  // const [PCconnect, setPCconnect] = useState(0);
  // const [waitConnect, setWaitConnect] = useState(0);

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

      console.log("Status Data:", statusData);

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

        console.log("Data:", data);

        const useForData = {
          Center: 0,
          Personal: 0,
          Resign: 0,
        };

        data.forEach((item) => {
          useForData[item.pc_use_for] = item.count_pc_use_for;
        });

        console.log("Use For Data:", useForData);

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

  //*Building Chart *//
  const BarChartBuilding = () => {
    const [buildingData, setBuildingData] = useState({});

    useEffect(() => {
      const fetchDataBuildingChart = async () => {
        const response = await axios.get(
          `http://10.17.66.242:3001/api/smart_recovery/filter-data-count-chart-building?division=${selecteddivision}&department=${selectedDepartment}&cost_center=${selectedCostCenter}`
        );

        let data = response.data;

        console.log("Building Data:", data);

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

        console.log("Building Data:", buildingData);

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
        width={300}
      />
    );
  };

  //*Join Domain Chart *//
  const DonutChartJoinDomain = () => {
    const [chartOptions, setChartOptions] = useState({});
    const [chartSeries, setChartSeries] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `http://10.17.66.242:3001/api/smart_recovery/filter-data-count-chart-join-domain?division=${selecteddivision}&department=${selectedDepartment}&cost_center=${selectedCostCenter}`
          );
          const data = response.data;

          // Process the data and prepare chart options and series
          if (data && data.length > 0) {
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
              responsive: [
                {
                  breakpoint: 480,
                  options: {
                    chart: {
                      width: 350,
                    },
                    legend: {
                      position: "right",
                    },
                  },
                },
              ],
            });

            setChartSeries(values);
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
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="donut"
          width={350}
          height={150}
        />
      </div>
    );
  };

  return (
    <>
      <Navbar onToggle={handleNavbarToggle} />
      <ThemeProvider theme={theme}>
        <div className="container mx-16 my-24 w-screen">
          <Box
            marginLeft={isNavbarOpen ? "220px" : 4}
            marginTop={8}
            className={`transition-all duration-500 ease-in-out ${
              isNavbarOpen ? "ml-64" : ""
            }`}
          >
            {/* //Chart Group */}

            <div className="flex flex-col lg:flex-row gap-4">
              <div className="container flex gap-4 w-fit">
                <div className="col-span-1 w-52 hover:translate-x-1 hover:-translate-y-1 transition duration-300 ease-in-out cursor-pointer">
                  <div className="bg-blue-500 rounded-lg p-4 shadow-lg h-40">
                    <p className="text-white text-xl font-bold">Total PC</p>
                    <div className="bg-white rounded-lg p-4 mt-8 h-16">
                      <p className="text-blue-700 text-3xl font-bold">
                        {pcStatus.total_pc}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-span-1 w-52 hover:translate-x-1 hover:-translate-y-1 transition duration-300 ease-in-out cursor-pointer">
                  <div className="bg-green-500 rounded-lg p-4 shadow-lg h-40">
                    <p className="text-white text-xl font-bold">PC Connect</p>
                    <div className="bg-white rounded-lg p-4 mt-8 h-16">
                      <p className="text-green-700 text-3xl font-bold">
                        {pcStatus.pc_connect}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-span-1 w-52 hover:translate-x-1 hover:-translate-y-1 transition duration-300 ease-in-out cursor-pointer">
                  <div className="bg-yellow-500 rounded-lg p-4 shadow-lg h-40">
                    <p className="text-white text-xl font-bold">Wait Connect</p>
                    <div className="bg-white rounded-lg p-4 mt-8 h-16">
                      <p className="text-yellow-700 text-3xl font-bold">
                        {pcStatus.wait_connect}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col w-screen lg:w-1/3 lg:flex-row">
                <div className="container flex">
                  <div className="bg-white rounded-lg mb-8 mr-4 shadow-lg text-left">
                    <BarChartUseFor />
                  </div>
                  <div className="bg-white rounded-lg mb-8 mr-4 shadow-lg text-left">
                    <BarChartBuilding />
                  </div>
                  <div className="bg-white rounded-lg mb-8 mr-4 shadow-lg flex items-center text-left">
                    <DonutChartJoinDomain />
                  </div>
                </div>
              </div>
            </div>

            {/* //Search Group */}

            <div className="mb-6">
              {/* <Computer_In_Process_Search_Group onSearch={onSearch} /> */}
              <Computer_In_Process_Search_Group
                onSearch={(queryParams) => {
                  setSelecteddivision(queryParams.division);
                  setSelectedDepartment(queryParams.Department);
                  setSelectedCostCenter(queryParams.Cost_center);
                }}
              />
            </div>

            {/* Table for Computer in Process */}
            <div
              className="shadow-xl"
              style={{
                height: "50vh",
                width: isNavbarOpen ? "calc(90vw - 10vw)" : "90vw",
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
                <DialogContent sx={{ background: "#e3e3e3" }}>
                  <div className="flex flex-row">
                    <div className="computer-data">
                      <div className="bg-white p-4 rounded-2xl mx-2 mt-2 shadow-lg h-full">
                        <p className="flex font-bold text-lg mb-6 justify-center underline decoration-sky-500">
                          Computer Data
                        </p>
                        <label className="font-bold text-blue-300 flex items-center">
                          PC Name
                          <Autocomplete
                            disablePortal
                            size="small"
                            id="pc-name-autocomplete"
                            options={pcNameOption}
                            getOptionLabel={(option) => option}
                            defaultValue={selectedData.pc_name}
                            renderInput={(params) => (
                              <TextField {...params} label="" />
                            )}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                              backgroundColor: " #cffafe ",
                            }}
                            onChange={(event, newValue) => setPcName(newValue)}
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          PC Type
                          <Autocomplete
                            disablePortal
                            size="small"
                            id="pc-type-autocomplete"
                            options={pcTypeOption}
                            getOptionLabel={(option) => option}
                            defaultValue={selectedData.pc_type}
                            renderInput={(params) => (
                              <TextField {...params} label="" />
                            )}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                              backgroundColor: " #cffafe ",
                            }}
                            onChange={(event, newValue) => setPcType(newValue)}
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          OS
                          <Autocomplete
                            disablePortal
                            size="small"
                            id="os-autocomplete"
                            options={osOption}
                            getOptionLabel={(option) => option}
                            defaultValue={selectedData.os}
                            renderInput={(params) => (
                              <TextField {...params} label="" />
                            )}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                              backgroundColor: " #cffafe ",
                            }}
                            onChange={(event, newValue) => setOs(newValue)}
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          OS Version
                          <Autocomplete
                            disablePortal
                            size="small"
                            id="os-version-autocomplete"
                            options={osVersionOption}
                            getOptionLabel={(option) => option}
                            defaultValue={selectedData.os_version}
                            renderInput={(params) => (
                              <TextField {...params} label="" />
                            )}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                              backgroundColor: " #cffafe ",
                            }}
                            onChange={(event, newValue) =>
                              setOsVersion(newValue)
                            }
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          Start Date
                          <TextField
                            disabled
                            size="small"
                            id="outlined-disabled"
                            defaultValue={new Date(
                              selectedData.update_datetime
                            ).toLocaleDateString("en-CA")}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          MAC Address
                          <TextField
                            size="small"
                            id="mac-address-textfield"
                            defaultValue={selectedData.mac_address}
                            label=""
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                              backgroundColor: " #cffafe ",
                            }}
                            onChange={(event) =>
                              setMacAddress(event.target.value)
                            }
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          IP Address
                          <TextField
                            disabled
                            size="small"
                            id="outlined-disabled"
                            defaultValue={selectedData.new_ip}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          Connect Type
                          <TextField
                            disabled
                            size="small"
                            id="outlined-disabled"
                            defaultValue={selectedData.connect_type}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          Join Domain
                          <TextField
                            disabled
                            size="small"
                            id="outlined-disabled"
                            defaultValue={selectedData.join_domain_status}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          Join Domain Date
                          <TextField
                            disabled
                            size="small"
                            id="outlined-disabled"
                            defaultValue={selectedData.join_domain_date}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    {/* //*User Data  */}

                    <div className="user-data">
                      <div className="bg-white p-4 rounded-2xl mx-2 mt-2 shadow-lg h-full">
                        <p className="flex font-bold text-lg mb-6 justify-center underline decoration-pink-500">
                          User Data
                        </p>
                        <label className="font-bold text-blue-300 flex items-center">
                          PC Use For
                          <Autocomplete
                            disablePortal
                            size="small"
                            id="pc-use-for-autocomplete"
                            options={pcUseForOption}
                            getOptionLabel={(option) => option}
                            defaultValue={selectedData.pc_use_for}
                            renderInput={(params) => (
                              <TextField {...params} label="" />
                            )}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                              backgroundColor: " #cffafe ",
                            }}
                            onChange={(event, newValue) =>
                              setPcUseFor(newValue)
                            }
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          ID Code
                          <Autocomplete
                            disablePortal
                            size="small"
                            id="id-code-autocomplete"
                            options={idCodeOption}
                            getOptionLabel={(option) => option}
                            defaultValue={selectedData.employee_id}
                            renderInput={(params) => (
                              <TextField {...params} label="" />
                            )}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                              backgroundColor: " #cffafe ",
                            }}
                            onChange={(event, newValue) => setIdCode(newValue)}
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          Name - Surname
                          <TextField
                            disabled
                            size="small"
                            id="outlined-disabled"
                            defaultValue={selectedData.emp_name_eng}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                          />
                        </label>

                        <label className="font-bold text-blue-300 flex items-center">
                          Email
                          <TextField
                            disabled
                            size="small"
                            id="outlined-disabled"
                            defaultValue={selectedData.user_email}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          Job Level
                          <TextField
                            disabled
                            size="small"
                            id="outlined-disabled"
                            defaultValue={selectedData.job_level}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          Division
                          <TextField
                            disabled
                            size="small"
                            id="outlined-disabled"
                            defaultValue={selectedData.division}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          Department
                          <TextField
                            disabled
                            size="small"
                            id="outlined-disabled"
                            defaultValue={selectedData.department_unit}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          Manager
                          <TextField
                            disabled
                            size="small"
                            id="outlined-disabled"
                            defaultValue={selectedData.supervision_name}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          Cost Center
                          <Autocomplete
                            disablePortal
                            size="small"
                            id="cost-center-autocomplete"
                            options={costCenterOption}
                            getOptionLabel={(option) => option}
                            defaultValue={selectedData.cost_center_code}
                            renderInput={(params) => (
                              <TextField {...params} label="" />
                            )}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                              backgroundColor: " #cffafe ",
                            }}
                            onChange={(event, newValue) =>
                              setCostCenter(newValue)
                            }
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          Building
                          <Autocomplete
                            disablePortal
                            size="small"
                            id="building-autocomplete"
                            options={buildingOption}
                            getOptionLabel={(option) => option}
                            defaultValue={selectedData.building}
                            renderInput={(params) => (
                              <TextField {...params} label="" />
                            )}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                              backgroundColor: " #cffafe ",
                            }}
                            onChange={handleBuildingChange}
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          Area
                          <Autocomplete
                            disablePortal
                            size="small"
                            id="area-autocomplete"
                            options={areaOption}
                            getOptionLabel={(option) => option}
                            defaultValue={selectedData.area}
                            renderInput={(params) => (
                              <TextField {...params} label="" />
                            )}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                              backgroundColor: " #cffafe ",
                            }}
                            onChange={(event, newValue) => setArea(newValue)}
                          />
                        </label>
                      </div>
                    </div>

                    {/* //*permission Data */}

                    <div className="permission-data">
                      <div className="bg-white p-4 rounded-2xl mx-2 mt-2 shadow-lg h-full">
                        <p className="flex font-bold text-lg mb-6 justify-center underline decoration-green-500">
                          Permission Data
                        </p>
                        <label className="font-bold text-blue-300 flex items-center">
                          MFG Pro
                          <Autocomplete
                            className={`${
                              selectedData.mfgpro_btp_fpc === "Yes"
                                ? "bg-green-200"
                                : "bg-yellow-200"
                            }`}
                            disablePortal
                            size="small"
                            id="mfg-pro-autocomplete"
                            options={mfgProOption}
                            getOptionLabel={(option) => option}
                            defaultValue={selectedData.mfgpro_btp_fpc}
                            renderInput={(params) => (
                              <TextField {...params} label="" />
                            )}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                            onchange={(event, newValue) => setMfgPro(newValue)}
                            renderOption={(props, option) => {
                              const backgroundColor =
                                option === "Yes"
                                  ? " #bbf7d0 "
                                  : option === "No"
                                  ? "  #fef08a  "
                                  : "white";

                              return (
                                <li {...props} style={{ backgroundColor }}>
                                  {option}
                                </li>
                              );
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          BTP
                          <Autocomplete
                            className={`${
                              selectedData.btp_only === "Yes"
                                ? "bg-green-200"
                                : "bg-yellow-200"
                            }`}
                            disablePortal
                            size="small"
                            id="btp-autocomplete"
                            options={btpOption}
                            getOptionLabel={(option) => option}
                            defaultValue={selectedData.btp_only}
                            renderInput={(params) => (
                              <TextField {...params} label="" />
                            )}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                            onchange={(event, newValue) => setBtp(newValue)}
                            renderOption={(props, option) => {
                              const backgroundColor =
                                option === "Yes"
                                  ? " #bbf7d0 "
                                  : option === "No"
                                  ? "  #fef08a  "
                                  : "white";

                              return (
                                <li {...props} style={{ backgroundColor }}>
                                  {option}
                                </li>
                              );
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          FPC
                          <Autocomplete
                            className={`${
                              selectedData.fpc_only === "Yes"
                                ? "bg-green-200"
                                : "bg-yellow-200"
                            }`}
                            disablePortal
                            size="small"
                            id="fpc-autocomplete"
                            options={fpcOption}
                            getOptionLabel={(option) => option}
                            defaultValue={selectedData.fpc_only}
                            renderInput={(params) => (
                              <TextField {...params} label="" />
                            )}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                            onchange={(event, newValue) => setFpc(newValue)}
                            renderOption={(props, option) => {
                              const backgroundColor =
                                option === "Yes"
                                  ? " #bbf7d0 "
                                  : option === "No"
                                  ? "  #fef08a  "
                                  : "white";

                              return (
                                <li {...props} style={{ backgroundColor }}>
                                  {option}
                                </li>
                              );
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          Humatrix
                          <Autocomplete
                            className={`${
                              selectedData.humatrix === "Yes"
                                ? "bg-green-200"
                                : "bg-yellow-200"
                            }`}
                            disablePortal
                            size="small"
                            id="humatrix-autocomplete"
                            options={humatrixOption}
                            getOptionLabel={(option) => option}
                            defaultValue={selectedData.humatrix}
                            renderInput={(params) => (
                              <TextField {...params} label="" />
                            )}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                            onchange={(event, newValue) =>
                              setHumatrix(newValue)
                            }
                            renderOption={(props, option) => {
                              const backgroundColor =
                                option === "Yes"
                                  ? " #bbf7d0 "
                                  : option === "No"
                                  ? "  #fef08a  "
                                  : "white";

                              return (
                                <li {...props} style={{ backgroundColor }}>
                                  {option}
                                </li>
                              );
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          ZWCAD
                          <Autocomplete
                            className={`${
                              selectedData.zwcad === "Yes"
                                ? "bg-green-200"
                                : "bg-yellow-200"
                            }`}
                            disablePortal
                            size="small"
                            id="zwcad-autocomplete"
                            options={zwcadOption}
                            getOptionLabel={(option) => option}
                            defaultValue={selectedData.zwcad}
                            renderInput={(params) => (
                              <TextField {...params} label="" />
                            )}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                            onchange={(event, newValue) => setZwcad(newValue)}
                            renderOption={(props, option) => {
                              const backgroundColor =
                                option === "Yes"
                                  ? " #bbf7d0 "
                                  : option === "No"
                                  ? "  #fef08a  "
                                  : "white";

                              return (
                                <li {...props} style={{ backgroundColor }}>
                                  {option}
                                </li>
                              );
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          A1 Server
                          <Autocomplete
                            className={`${
                              selectedData.a1_server === "Yes"
                                ? "bg-green-200"
                                : "bg-yellow-200"
                            }`}
                            disablePortal
                            size="small"
                            id="a1-server-autocomplete"
                            options={a1ServerOption}
                            getOptionLabel={(option) => option}
                            defaultValue={selectedData.a1_server}
                            renderInput={(params) => (
                              <TextField {...params} label="" />
                            )}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                            onchange={(event, newValue) =>
                              setA1Server(newValue)
                            }
                            renderOption={(props, option) => {
                              const backgroundColor =
                                option === "Yes"
                                  ? " #bbf7d0 "
                                  : option === "No"
                                  ? "  #fef08a  "
                                  : "white";

                              return (
                                <li {...props} style={{ backgroundColor }}>
                                  {option}
                                </li>
                              );
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          E-working
                          <Autocomplete
                            className={`${
                              selectedData.e_working === "Yes"
                                ? "bg-green-200"
                                : "bg-yellow-200"
                            }`}
                            disablePortal
                            size="small"
                            id="e_working-autocomplete"
                            options={eWorkingOption}
                            getOptionLabel={(option) => option}
                            defaultValue={selectedData.e_working}
                            renderInput={(params) => (
                              <TextField {...params} label="" />
                            )}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                            onchange={(event, newValue) =>
                              setEWorking(newValue)
                            }
                            renderOption={(props, option) => {
                              const backgroundColor =
                                option === "Yes"
                                  ? " #bbf7d0 "
                                  : option === "No"
                                  ? "  #fef08a  "
                                  : "white";

                              return (
                                <li {...props} style={{ backgroundColor }}>
                                  {option}
                                </li>
                              );
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          Internet
                          <Autocomplete
                            className={`${
                              selectedData.internet === "Yes"
                                ? "bg-green-200"
                                : "bg-yellow-200"
                            }`}
                            disablePortal
                            size="small"
                            id="internet-autocomplete"
                            options={internetOption}
                            getOptionLabel={(option) => option}
                            defaultValue={selectedData.internet}
                            renderInput={(params) => (
                              <TextField {...params} label="" />
                            )}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                            onchange={(event, newValue) =>
                              setInternet(newValue)
                            }
                            renderOption={(props, option) => {
                              const backgroundColor =
                                option === "Yes"
                                  ? " #bbf7d0 "
                                  : option === "No"
                                  ? "  #fef08a  "
                                  : "white";

                              return (
                                <li {...props} style={{ backgroundColor }}>
                                  {option}
                                </li>
                              );
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    {/* //*Security Data */}

                    <div className="security-data">
                      <div className="bg-white p-4 rounded-2xl mx-2 mt-2 shadow-lg h-full">
                        <p className="flex font-bold text-lg mb-6 justify-center underline decoration-orange-500">
                          Security Data
                        </p>
                        <label className="font-bold text-blue-300 flex items-center">
                          Antivirus
                          <Autocomplete
                            className={`${
                              selectedData.antivirus_status !== null
                                ? "bg-green-200"
                                : "bg-yellow-200"
                            }`}
                            disablePortal
                            size="small"
                            id="antivirus-autocomplete"
                            options={antivirusOption}
                            getOptionLabel={(option) => option}
                            defaultValue={selectedData.antivirus}
                            renderInput={(params) => (
                              <TextField {...params} label="" />
                            )}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                            onchange={(event, newValue) =>
                              setAntivirus(newValue)
                            }
                            renderOption={(props, option) => {
                              const backgroundColor =
                                option === "Kastersky"
                                  ? " #58d68d "
                                  : option === "Symantec"
                                  ? " #58d68d "
                                  : option === "Trend Micro"
                                  ? " #58d68d "
                                  : option === "McAfee"
                                  ? " #58d68d "
                                  : "white";

                              return (
                                <li {...props} style={{ backgroundColor }}>
                                  {option}
                                </li>
                              );
                            }}
                          />
                        </label>

                        <label className="font-bold text-blue-300 flex items-center">
                          Antivirus Status
                          <Autocomplete
                            className={`${
                              selectedData.antivirus_status === "Normal"
                                ? "bg-green-200"
                                : "bg-yellow-200"
                            }`}
                            disablePortal
                            size="small"
                            id="antivirus-status-autocomplete"
                            options={antivirusStatusOption}
                            getOptionLabel={(option) => option}
                            defaultValue={selectedData.antivirus_status}
                            renderInput={(params) => (
                              <TextField {...params} label="" />
                            )}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                            onchange={(event, newValue) =>
                              setAntivirusStatus(newValue)
                            }
                            renderOption={(props, option) => {
                              const backgroundColor =
                                option === "Normal"
                                  ? " #bbf7d0 "
                                  : option === "Abnormal"
                                  ? "  #fef08a  "
                                  : "white";

                              return (
                                <li {...props} style={{ backgroundColor }}>
                                  {option}
                                </li>
                              );
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          EDR Status
                          <Autocomplete
                            className={`${
                              selectedData.edr_status === "Normal"
                                ? "bg-green-200"
                                : "bg-yellow-200"
                            }`}
                            disablePortal
                            size="small"
                            id="edr-status-autocomplete"
                            options={edrStatusOption}
                            getOptionLabel={(option) => option}
                            defaultValue={selectedData.edr_status}
                            renderInput={(params) => (
                              <TextField {...params} label="" />
                            )}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                            onChange={(event, newValue) =>
                              setEdrStatus(newValue)
                            }
                            renderOption={(props, option) => {
                              const backgroundColor =
                                option === "Normal"
                                  ? " #bbf7d0 "
                                  : option === "Abnormal"
                                  ? "  #fef08a  "
                                  : "white";

                              return (
                                <li {...props} style={{ backgroundColor }}>
                                  {option}
                                </li>
                              );
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </DialogContent>
                <DialogActions sx={{ background: "#e3e3e3" }}>
                  <Button
                    onClick={handleSave}
                    color="secondary"
                    sx={{ fontWeight: "bold", fontSize: 20 }}
                  >
                    Save
                  </Button>
                  <Button
                    onClick={handleClose}
                    color="error"
                    sx={{ fontWeight: "bold", fontSize: 20 }}
                  >
                    Cancel
                  </Button>
                </DialogActions>
              </Dialog>
            )}
          </Box>
        </div>
      </ThemeProvider>
    </>
  );
}
