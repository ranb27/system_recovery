import axios from "axios";
import Swal from "sweetalert2";
import * as React from "react";
import { useState, useEffect } from "react";
import "./styles/ComputerInProcess.css";
import ReactApexChart from "react-apexcharts";

//* Computer in process page component *//

import Navbar from "../components/Navbar/Navbar";
import Computer_In_Process_Search_Group from "../components/SearchGroup/computer_in_process_search";
import BarChart from "../components/charts/ComputerInProcessBarCharts";
import DonutChart from "../components/charts/ComputerInProcessDonutChart";

//*mui imports //

import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import {
  Container,
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

          const macAddresses = Array.from(
            new Set(res.data.map((item) => item.mac_address))
          );
          setMacAddressOption(macAddresses);

          const ipAddresses = Array.from(
            new Set(res.data.map((item) => item.new_ip))
          );
          setIpAddressOption(ipAddresses);

          const idCodes = Array.from(
            new Set(res.data.map((item) => item.employee_id))
          );
          setIdCodeOption(idCodes);

          const nameSurnames = Array.from(
            new Set(res.data.map((item) => item.emp_name_eng))
          );
          setNameSurnameOption(nameSurnames);

          const emails = Array.from(
            new Set(res.data.map((item) => item.user_email))
          );
          setEmailOption(emails);

          const jobLevels = Array.from(
            new Set(res.data.map((item) => item.job_level))
          );
          setJobLevelOption(jobLevels);

          const divisions = Array.from(
            new Set(res.data.map((item) => item.division))
          );
          setDivisionOption(divisions);

          const departments = Array.from(
            new Set(res.data.map((item) => item.department_unit))
          );
          setDepartmentOption(departments);

          const managers = Array.from(
            new Set(res.data.map((item) => item.supervision_name))
          );
          setManagerOption(managers);

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
    { field: "factory_emp", headerName: "Factory", width: 70 },
    { field: "pc_name", headerName: "PC Name", width: 120 },
    { field: "pc_type", headerName: "PC Type", width: 100 },
    { field: "os", headerName: "OS", width: 70 },
    { field: "pc_use_for", headerName: "PC Use For", width: 120 },
    { field: "building", headerName: "Building", width: 90 },
    { field: "process", headerName: "Process", width: 100 },
    { field: "area", headerName: "Area", width: 100 },
    { field: "employee_id", headerName: "User ID Code", width: 120 },
    { field: "emp_name_eng", headerName: "Name - Surname", width: 350 },
    { field: "job_level", headerName: "Job Level", width: 100 },
    { field: "connect_status", headerName: "Status Connect", width: 150 },
    { field: "cost_center_code", headerName: "Cost Center", width: 120 },
    {
      field: "edit",
      headerName: "Edit",
      width: 100,
      renderCell: (params) => (
        <Button variant="outlined" onClick={() => handleOpen(params.row)}>
          <EditIcon />
        </Button>
      ),
    },
    // { field: "user_email", headerName: "Email", width: 120 },
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
    setAntivirus(data["antivirus"]);
    setAntivirusStatus(data["antivirus_status"]);
    setEdrStatus(data["edr_status"]);
    setIpAddress(data["new_ip"]);
    setConnectType(data["connect_type"]);
    setJoinDomain(data["join_domain"]);
    setJoinDomainDate(data["join_domain_date"]);

    setOpen(true);
  };

  //*Monitor selected ID after handleOpen *//
  let selectedID = localStorage.getItem("selectedID");
  const selectedComputerName = rows.find(
    (row) => row.id === selectedID
  )?.pc_name;

  //* Get user for update by data*//
  const userLoginInfo = localStorage.getItem("guestToken" || "userToken");
  const userLoginInfoJSON = JSON.parse(userLoginInfo);
  const userLogin = userLoginInfoJSON.user_login;

  console.log("User Login:", userLoginInfo);
  console.log("User Login In:", userLoginInfoJSON);
  console.log("User Login:", userLogin);
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
      antivirus,
      antivirusStatus,
      edrStatus,
      ipAddress,
      connectType,
      joinDomain,
      joinDomainDate,
      updateBy: userLogin,
    };

    console.log("Edited Data:", editedData);

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
    handleClose();
  };

  //*Edit *//

  //state for edit data
  const [pcName, setPcName] = useState("");
  const [pcType, setPcType] = useState("");
  const [os, setOs] = useState("");
  const [osVersion, setOsVersion] = useState("");
  const [startDate, setStartDate] = useState("");
  const [macAddress, setMacAddress] = useState("");
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
  const [antivirus, setAntivirus] = useState("");
  const [antivirusStatus, setAntivirusStatus] = useState("");
  const [edrStatus, setEdrStatus] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [connectType, setConnectType] = useState("");
  const [joinDomain, setJoinDomain] = useState("");
  const [joinDomainDate, setJoinDomainDate] = useState("");

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

  const startDateOption = ["2021-10-01", "2021-10-02"];
  const [macAddressOption, setMacAddressOption] = useState([]);
  const [ipAddressOption, setIpAddressOption] = useState([]);
  const connectTypeOption = [
    "LAN (WAN)",
    "WIFI (PRD_SCAN)",
    "WIFI (PRD_OFFICE)",
  ];
  const joinDomainOption = ["Yes", "No"];
  const joinDomainDateOption = ["2021-10-01", "2021-10-02"];

  //User Data
  const pcUseForOption = [
    "Personal",
    "Machine",
    "Scan WIP",
    "CCTV",
    "Scrap",
    "Center",
    "Server",
  ];
  const [idCodeOption, setIdCodeOption] = useState([]);
  const [nameSurnameOption, setNameSurnameOption] = useState([]);
  const [emailOption, setEmailOption] = useState([]);
  const [jobLevelOption, setJobLevelOption] = useState([]);
  const [divisionOption, setDivisionOption] = useState([]);
  const [departmentOption, setDepartmentOption] = useState([]);
  const [managerOption, setManagerOption] = useState([]);
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
  const outsystemOption = ["Yes", "No"];

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
  const [totalPC, setTotalPC] = useState(0);
  const [PCconnect, setPCconnect] = useState(0);
  const [waitConnect, setWaitConnect] = useState(0);

  useEffect(() => {
    const fetchDataPC = async () => {
      const response = await axios.get(
        `http://10.17.66.242:3001/api/smart_recovery/filter-data-count-status?division=${selecteddivision}&department=${selectedDepartment}&cost_center=${selectedCostCenter}`
      );
      const data = response.data[0];

      if (data) {
        setTotalPC(data.total_pc);
        setPCconnect(data.pc_connect);
        setWaitConnect(data.wait_connect);
      }
    };

    fetchDataPC();
  }, [selecteddivision, selectedDepartment, selectedCostCenter]);

  //*Charts *//

  const BarChartUseFor = () => {
    const [useForPersonal, setUseForPersonal] = useState(0);
    const [useForCenter, setUseForCenter] = useState(0);

    useEffect(() => {
      const fetchDataUseForChart = async () => {
        const response = await axios.get(
          `http://10.17.66.242:3001/api/smart_recovery/filter-data-count-chart-pc-use-for?division=${selecteddivision}&department=${selectedDepartment}&cost_center=${selectedCostCenter}`
        );
        const dataUseForPersonal = response.data[0].count_pc_use_for;
        const dataUseForCenter = response.data[1].count_pc_use_for;

        setUseForPersonal(dataUseForPersonal);
        setUseForCenter(dataUseForCenter);
      };

      fetchDataUseForChart();
    }, []);

    const state = {
      series: [
        {
          name: "Center",
          data: [useForCenter],
        },
        {
          name: "Personal",
          data: [useForPersonal],
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

  const BarChartBuilding = () => {
    const [buildingA, setBuildingA] = useState(0);
    const [buildingB, setBuildingB] = useState(0);
    const [buildingC, setBuildingC] = useState(0);
    const [buildingC1, setBuildingC1] = useState(0);
    const [buildingC2, setBuildingC2] = useState(0);
    const [buildingC22F, setBuildingC22F] = useState(0);
    const [buildingC3, setBuildingC3] = useState(0);
    const [buildingD, setBuildingD] = useState(0);

    useEffect(() => {
      const fetchDataBuildingChart = async () => {
        const response = await axios.get(
          `http://10.17.66.242:3001/api/smart_recovery/filter-data-count-chart-building?division=${selecteddivision}&department=${selectedDepartment}&cost_center=${selectedCostCenter}`
        );
        const dataBuildingA = response.data[0].count_building;
        const dataBuildingB = response.data[1].count_building;

        setBuildingC1(dataBuildingA);
        setBuildingC3(dataBuildingB);
      };

      fetchDataBuildingChart();
    }, []);

    const state = {
      series: [
        {
          name: "A",
          data: [buildingA],
        },
        {
          name: "B",
          data: [buildingB],
        },
        {
          name: "C",
          data: [buildingC],
        },
        {
          name: "C1",
          data: [buildingC1],
        },
        {
          name: "C2",
          data: [buildingC2],
        },
        {
          name: "C2 2F",
          data: [buildingC22F],
        },
        {
          name: "C3",
          data: [buildingC3],
        },
        {
          name: "D",
          data: [buildingD],
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

  return (
    <>
      <Navbar onToggle={handleNavbarToggle} />
      <ThemeProvider theme={theme}>
        <Container maxWidth="lg">
          <Box marginLeft={isNavbarOpen ? "220px" : 4} marginTop={8}>
            {/* //Chart Group */}

            <div className="flex flex-col sm:flex-row gap-4 w-screen">
              <div className="col-span-1 w-52 hover:translate-x-1 hover:-translate-y-1 transition duration-300 ease-in-out cursor-pointer">
                <div className="bg-blue-500 rounded-lg p-4 shadow-lg h-40">
                  <p className="text-white text-xl font-bold">Total PC</p>
                  <div className="bg-white rounded-lg p-4 mt-8 h-16">
                    <p className="text-gray-700 text-2xl font-bold">
                      {totalPC}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-span-1 w-52 hover:translate-x-1 hover:-translate-y-1 transition duration-300 ease-in-out cursor-pointer">
                <div className="bg-green-500 rounded-lg p-4 shadow-lg h-40">
                  <p className="text-white text-xl font-bold">PC Connect</p>
                  <div className="bg-white rounded-lg p-4 mt-8 h-16">
                    <p className="text-gray-700 text-2xl font-bold">
                      {PCconnect}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-span-1 w-52 hover:translate-x-1 hover:-translate-y-1 transition duration-300 ease-in-out cursor-pointer">
                <div className="bg-yellow-500 rounded-lg p-4 shadow-lg h-40">
                  <p className="text-white text-xl font-bold">Wait Connect</p>
                  <div className="bg-white rounded-lg p-4 mt-8 h-16">
                    <p className="text-gray-700 text-2xl font-bold">
                      {waitConnect}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col w-screen lg:w-1/3 sm:flex-row">
                <div className="bg-white rounded-lg mb-8 mr-4 shadow-lg">
                  <BarChartUseFor />
                </div>
                <div className="bg-white rounded-lg mb-8 mr-4 shadow-lg">
                  <BarChartBuilding />
                </div>
                <div className="bg-white rounded-lg mb-8 mr-4 shadow-lg pt-6">
                  <DonutChart />
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
                height: "55vh",
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
                      <div className="bg-white p-4 rounded-2xl mx-2 mt-2">
                        <p className="dialog-head">Computer Data</p>
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
                              <TextField {...params} label="PC Name" />
                            )}
                            sx={{
                              width: 240,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
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
                              <TextField {...params} label="PC Type" />
                            )}
                            sx={{
                              width: 240,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
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
                              <TextField {...params} label="OS" />
                            )}
                            sx={{
                              width: 240,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
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
                              <TextField {...params} label="OS Version" />
                            )}
                            sx={{
                              width: 240,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
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
                            defaultValue="2021-10-01"
                            sx={{
                              width: 240,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          MAC Address
                          <Autocomplete
                            disablePortal
                            size="small"
                            id="mac-address-autocomplete"
                            options={macAddressOption}
                            getOptionLabel={(option) => option}
                            defaultValue={selectedData.mac_address}
                            renderInput={(params) => (
                              <TextField {...params} label="Mac Address" />
                            )}
                            sx={{
                              width: 240,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                            onChange={(event, newValue) =>
                              setMacAddress(newValue)
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
                              width: 240,
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
                              width: 240,
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
                            defaultValue={selectedData.join_domain}
                            sx={{
                              width: 240,
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
                              width: 240,
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
                      <div className="bg-white p-4 rounded-2xl mx-2 mt-2">
                        <p className="dialog-head">User Data</p>
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
                              <TextField {...params} label="PC Use For" />
                            )}
                            sx={{
                              width: 240,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
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
                              <TextField {...params} label="ID Code" />
                            )}
                            sx={{
                              width: 240,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
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
                              width: 240,
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
                              width: 240,
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
                              width: 240,
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
                              width: 240,
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
                              width: 240,
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
                              width: 240,
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
                              <TextField {...params} label="Cost Center" />
                            )}
                            sx={{
                              width: 240,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
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
                              <TextField {...params} label="Building" />
                            )}
                            sx={{
                              width: 240,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
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
                              <TextField {...params} label="Area" />
                            )}
                            sx={{
                              width: 240,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                            onChange={(event, newValue) => setArea(newValue)}
                          />
                        </label>
                      </div>
                    </div>

                    {/* //*permission Data */}

                    <div className="permission-data">
                      <div className="bg-white p-4 rounded-2xl mx-2 mt-2">
                        <p className="dialog-head">Permission Data</p>
                        <label className="font-bold text-blue-300 flex items-center">
                          MFG Pro
                          <Autocomplete
                            disablePortal
                            size="small"
                            id="mfg-pro-autocomplete"
                            options={mfgProOption}
                            getOptionLabel={(option) => option}
                            defaultValue={selectedData.mfg_pro}
                            renderInput={(params) => (
                              <TextField {...params} label="MFG Pro" />
                            )}
                            sx={{
                              width: 240,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          BTP
                          <Autocomplete
                            disablePortal
                            size="small"
                            id="btp-autocomplete"
                            options={btpOption}
                            getOptionLabel={(option) => option}
                            defaultValue={selectedData.btp}
                            renderInput={(params) => (
                              <TextField {...params} label="BTP" />
                            )}
                            sx={{
                              width: 240,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          FPC
                          <Autocomplete
                            disablePortal
                            size="small"
                            id="fpc-autocomplete"
                            options={fpcOption}
                            getOptionLabel={(option) => option}
                            defaultValue={selectedData.fpc}
                            renderInput={(params) => (
                              <TextField {...params} label="FPC" />
                            )}
                            sx={{
                              width: 240,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          Humatrix
                          <Autocomplete
                            disablePortal
                            size="small"
                            id="humatrix-autocomplete"
                            options={humatrixOption}
                            getOptionLabel={(option) => option}
                            defaultValue={selectedData.humatrix}
                            renderInput={(params) => (
                              <TextField {...params} label="Humatrix" />
                            )}
                            sx={{
                              width: 240,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          ZWCAD
                          <Autocomplete
                            disablePortal
                            size="small"
                            id="zwcad-autocomplete"
                            options={zwcadOption}
                            getOptionLabel={(option) => option}
                            defaultValue={selectedData.zwcad}
                            renderInput={(params) => (
                              <TextField {...params} label="ZWCAD" />
                            )}
                            sx={{
                              width: 240,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          A1 Server
                          <Autocomplete
                            disablePortal
                            size="small"
                            id="a1-server-autocomplete"
                            options={a1ServerOption}
                            getOptionLabel={(option) => option}
                            defaultValue={selectedData.a1_server}
                            renderInput={(params) => (
                              <TextField {...params} label="A1 Server" />
                            )}
                            sx={{
                              width: 240,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          Outsystem
                          <Autocomplete
                            disablePortal
                            size="small"
                            id="outsystem-autocomplete"
                            options={outsystemOption}
                            getOptionLabel={(option) => option}
                            defaultValue={selectedData.outsystem}
                            renderInput={(params) => (
                              <TextField {...params} label="Outsystem" />
                            )}
                            sx={{
                              width: 240,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    {/* //*Security Data */}

                    <div className="security-data">
                      <div className="bg-white p-4 rounded-2xl mx-2 mt-2">
                        <p className="dialog-head">Security Data</p>
                        <label className="font-bold text-blue-300 flex items-center">
                          Antivirus
                          <Autocomplete
                            disablePortal
                            size="small"
                            id="antivirus-autocomplete"
                            options={antivirusOption}
                            getOptionLabel={(option) => option}
                            defaultValue={selectedData.antivirus}
                            renderInput={(params) => (
                              <TextField {...params} label="Antivirus" />
                            )}
                            sx={{
                              width: 240,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                          />
                        </label>

                        <label className="font-bold text-blue-300 flex items-center">
                          Antivirus Status
                          <Autocomplete
                            disablePortal
                            size="small"
                            id="antivirus-status-autocomplete"
                            options={antivirusStatusOption}
                            getOptionLabel={(option) => option}
                            defaultValue={selectedData.antivirus_status}
                            renderInput={(params) => (
                              <TextField {...params} label="Antivirus Status" />
                            )}
                            sx={{
                              width: 240,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          EDR Status
                          <Autocomplete
                            disablePortal
                            size="small"
                            id="edr-status-autocomplete"
                            options={edrStatusOption}
                            getOptionLabel={(option) => option}
                            defaultValue={selectedData.edr_status}
                            renderInput={(params) => (
                              <TextField {...params} label="EDR Status" />
                            )}
                            sx={{
                              width: 240,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
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
        </Container>
      </ThemeProvider>
    </>
  );
}
