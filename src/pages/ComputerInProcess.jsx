//* Computer in process page component *//

import * as React from "react";
import "./styles/ComputerInProcess.css";
import Navbar from "../components/Navbar/Navbar";
import Computer_In_Process_Search_Group from "../components/SearchGroup/computer_in_process_search";

// import DonutChart from "../components/charts/ComputerInProcessDonutChart";
import BarChart from "../components/charts/ComputerInProcessBarCharts";
import DonutChart from "../components/charts/ComputerInProcessDonutChart";

import { useState, useEffect } from "react";

//*mui imports //

import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";

import {
  Container,
  Dialog,
  // DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import Swal from "sweetalert2";

// import Swal from "sweetalert2";

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

//Todo : Add filter about division, department, cost center to display in the table //from p'Keem
//Todo : Add edit function to save data to database with update API

export default function ComputerInProcess() {
  //*Division *//
  const [divisions, setDivisions] = useState([]);
  const divURL = `http://10.17.66.242:3001/api/smart_recovery/filter-division-list`;
  //*Department *//
  const [departments, setDepartments] = useState([]);
  const depURL = `http://10.17.66.242:3001/api/smart_recovery/filter-department-list?division=Division`;
  //*Cost Center *//
  const [costCenters, setCostCenters] = useState([]);
  const costURL = `http://10.17.66.242:3001/api/smart_recovery/filter-costcenter-list?division=Division&department=Department`;

  const getDivisions = async () => {
    const response = await axios.get(divURL);
    setDivisions(response.data);
  };

  const getDepartments = async () => {
    const response = await axios.get(depURL);
    setDepartments(response.data);
  };

  const getCostCenters = async () => {
    const response = await axios.get(costURL);
    setCostCenters(response.data);
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

  // console.log(divisions);
  // console.log(departments);
  // console.log(costCenters);

  useEffect(() => {
    getDivisions();
    getDepartments();
    getCostCenters();
  }, []);

  //TODO : Get data from API to display in the table
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
          const pcNames = res.data.map((item) => item.pc_name);
          setPcName(pcNames);
          const macAddresses = res.data.map((item) => item.mac_address);
          setMacAddress(macAddresses);
          const ipAddresses = res.data.map((item) => item.new_ip);
          setIpAddress(ipAddresses);
          const idCodes = res.data.map((item) => item.employee_id);
          setIdCode(idCodes);
          const nameSurnames = res.data.map((item) => item.emp_name_eng);
          setNameSurname(nameSurnames);
          const emails = res.data.map((item) => item.user_email);
          setEmail(emails);
          const jobLevels = res.data.map((item) => item.job_level);
          setJobLevel(jobLevels);
          const divisions = res.data.map((item) => item.division);
          setDivision(divisions);
          const departments = res.data.map((item) => item.department_unit);
          setDepartment(departments);
          const managers = res.data.map((item) => item.supervision_name);
          setManager(managers);
          const costCenters = res.data.map((item) => item.cost_center_code);
          setCostCenter(costCenters);
          const areas = res.data.map((item) => item.area);
          setArea(areas);
        });
      return response;
    };
    getRows();
  }, [selecteddivision, selectedDepartment, selectedCostCenter]);

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
  const [formData, setFormData] = useState({});

  const handleOpen = (data) => {
    setSelectedData(data);

    setFormData(
      { ...formData, pcName: data["pc_name"] },
      { ...formData, pcType: data["pc_type"] },
      { ...formData, os: data["os"] },
      { ...formData, osVersion: data["os_version"] },
      { ...formData, startDate: data["start_date"] },
      { ...formData, macAddress: data["mac_address"] },
      { ...formData, pcUseFor: data["pc_use_for"] },
      { ...formData, idCode: data["employee_id"] },
      { ...formData, costCenter: data["cost_center_code"] },
      { ...formData, area: data["area"] },

      { ...formData, antivirus: data["antivirus"] },
      { ...formData, antivirusStatus: data["antivirus_status"] },
      { ...formData, edrStatus: data["edr_status"] },
      //disabling binding to the database
      { ...formData, nameSurname: data["emp_name_eng"] },
      { ...formData, ipAddress: data["new_ip"] },
      { ...formData, connectType: data["connect_type"] },
      { ...formData, joinDomain: data["join_domain"] },
      { ...formData, joinDomainDate: data["join_domain_date"] },
      { ...formData, email: data["user_email"] },
      { ...formData, jobLevel: data["job_level"] },
      { ...formData, division: data["division"] },
      { ...formData, department: data["department_unit"] },
      { ...formData, manager: data["supervision_name"] },
      { ...formData, building: data["building"] }
    );

    console.log("Selected ID:", data.id);
    console.log("State of form", formData);

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    console.log("Edited ID:", selectedData.id);
    console.log("Updated", formData);

    if (formData !== null) {
      axios
        .get(
          `http://10.17.66.242:3001/api/smart_recovery/update-data-computer-master?row_id=${selectedData.id}&pc_name=${formData.pcName}&pc_type=${formData.pcType}&os=${formData.os}&os_version=${formData.osVersion}&mac_address=${formData.macAddress}&pc_use_for=${formData.pcUseFor}&employee_id=${formData.idCode}&cost_center_code=${formData.costCenter}&building=${formData.building}&area=${formData.area}`
        )
        .then((res) => {
          console.log(res.data);
        });

      fetchData(); // Fetch the updated data
    }

    if (formData === null) {
      setFormData(selectedData);
    }

    Swal.fire({
      icon: "success",
      title: "Save Success",
      text: "Save data to the database successfully",
      confirmButtonText: "OK",
    });

    // Re initialize the form data
    setFormData({});
    handleClose();
  };

  //*Edit *//
  //Computer Data
  const [pcName, setPcName] = useState([]);
  const pcType = [
    "Desktop",
    "Laptop",
    "Server",
    "NAS",
    "Tablet",
    "Rasberry PI",
  ];
  const os = [
    "Win 11",
    "Win 10",
    "Win 8",
    "Win 7",
    "Win XP",
    "Embleded",
    "MAC",
    "WIN 10-TEST",
  ];
  const osVersion = ["64 bit", "32 bit", "21H2-TEST"];
  const startDate = ["2021-10-01", "2021-10-02"];
  const [macAddress, setMacAddress] = useState([]);
  const [ipAddress, setIpAddress] = useState([]);
  const connectType = ["LAN (WAN)", "WIFI (PRD_SCAN)", "WIFI (PRD_OFFICE)"];
  const joinDomain = ["Yes", "No"];
  const joinDomainDate = ["2021-10-01", "2021-10-02"];

  //User Data
  const pcUseFor = [
    "Personal",
    "Machine",
    "Scan WIP",
    "CCTV",
    "Scrap",
    "Center",
    "Server",
  ];
  const [idCode, setIdCode] = useState([]);
  const [nameSurname, setNameSurname] = useState([]);
  const [email, setEmail] = useState([]);
  const [jobLevel, setJobLevel] = useState([]);
  const [division, setDivision] = useState([]);
  const [department, setDepartment] = useState([]);
  const [manager, setManager] = useState([]);
  const [costCenter, setCostCenter] = useState([]);
  const building = ["A", "B", "C", "C1", "C2", "C2 2F", "C3", "D"];
  const [area, setArea] = useState([]);

  //Permission Data
  const mfgPro = ["Yes", "No"];
  const btp = ["Yes", "No"];
  const fpc = ["Yes", "No"];
  const humatrix = ["Yes", "No"];
  const zwcad = ["Yes", "No"];
  const a1Server = ["Yes", "No"];
  const outsystem = ["Yes", "No"];

  //Security Data
  const antivirus = ["Kastersky", "Symantec", "Trend Micro", "McAfee"];
  const antivirusStatus = ["Normal", "Abnormal"];
  const edrStatus = ["Normal", "Abnormal"];

  //*Responsive for Navbar *//
  const [isNavbarOpen, setIsNavbarOpen] = React.useState(false);

  const handleNavbarToggle = (openStatus) => {
    setIsNavbarOpen(openStatus);
  };

  return (
    <>
      <Navbar onToggle={handleNavbarToggle} />
      <ThemeProvider theme={theme}>
        <Container maxWidth="lg">
          <Box marginLeft={isNavbarOpen ? "220px" : 4} marginTop={8}>
            {/* //Chart Group */}

            <div className="flex flex-col sm:flex-row gap-4 w-screen">
              <div className="col-span-1 w-72 hover:translate-x-1 hover:-translate-y-1 transition duration-300 ease-in-out cursor-pointer">
                <div className="bg-blue-500 rounded-lg p-4">
                  <p className="text-white text-xl font-bold">Total PC</p>
                  <div className="bg-white rounded-lg p-4 mt-4">
                    <p className="text-gray-700 text-2xl font-bold">240</p>
                  </div>
                </div>
              </div>

              <div className="col-span-1 w-72 hover:translate-x-1 hover:-translate-y-1 transition duration-300 ease-in-out cursor-pointer">
                <div className="bg-green-500 rounded-lg p-4">
                  <p className="text-white text-xl font-bold">PC Connect</p>
                  <div className="bg-white rounded-lg p-4 mt-4">
                    <p className="text-gray-700 text-2xl font-bold">150</p>
                  </div>
                </div>
              </div>

              <div className="col-span-1 w-72 hover:translate-x-1 hover:-translate-y-1 transition duration-300 ease-in-out cursor-pointer">
                <div className="bg-yellow-500 rounded-lg p-4">
                  <p className="text-white text-xl font-bold">Wait Connect</p>
                  <div className="bg-white rounded-lg p-4 mt-4">
                    <p className="text-gray-700 text-2xl font-bold">90</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-row w-screen sm:w-1/3">
                <BarChart />
                <BarChart />
                <DonutChart />
              </div>
            </div>

            {/* //Search Group */}

            <div>
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
              style={{
                height: "60vh",
                width: isNavbarOpen ? "calc(90vw - 10vw)" : "90vw",
                marginTop: "16px",
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
                      <div className="bg-white p-4 rounded-2xl">
                        <p className="dialog-head">Computer Data</p>
                        <label className="font-bold text-blue-300 flex items-center">
                          PC Name
                          <Autocomplete
                            disablePortal
                            id="pc-name-autocomplete"
                            options={pcName}
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
                            onChange={(event, newValue) => {
                              setFormData((prev) => ({
                                ...prev,
                                pcName: newValue,
                              }));
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          PC Type
                          <Autocomplete
                            disablePortal
                            id="pc-type-autocomplete"
                            options={pcType}
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
                            onChange={(event, newValue) => {
                              setFormData((prev) => ({
                                ...prev,
                                pcType: newValue,
                              }));
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          OS
                          <Autocomplete
                            disablePortal
                            id="os-autocomplete"
                            options={os}
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
                            onChange={(event, newValue) => {
                              setFormData((prev) => ({
                                ...prev,
                                os: newValue,
                              }));
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          OS Version
                          <Autocomplete
                            disablePortal
                            id="os-version-autocomplete"
                            options={osVersion}
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
                            onChange={(event, newValue) => {
                              setFormData((prev) => ({
                                ...prev,
                                osVersion: newValue,
                              }));
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          Start Date
                          <TextField
                            disabled
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
                            id="mac-address-autocomplete"
                            options={macAddress}
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
                            onChange={(event, newValue) => {
                              setFormData((prev) => ({
                                ...prev,
                                macAddress: newValue,
                              }));
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          IP Address
                          <TextField
                            disabled
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
                      <div className="bg-white p-4 rounded-2xl">
                        <p className="dialog-head">User Data</p>
                        <label className="font-bold text-blue-300 flex items-center">
                          PC Use For
                          <Autocomplete
                            disablePortal
                            id="pc-use-for-autocomplete"
                            options={pcUseFor}
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
                            onChange={(event, newValue) => {
                              setFormData((prev) => ({
                                ...prev,
                                pcUseFor: newValue,
                              }));
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          ID Code
                          <Autocomplete
                            disablePortal
                            id="id-code-autocomplete"
                            options={idCode}
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
                            onChange={(event, newValue) => {
                              setFormData((prev) => ({
                                ...prev,
                                idCode: newValue,
                              }));
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          Name - Surname
                          <TextField
                            disabled
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
                            id="cost-center-autocomplete"
                            options={costCenter}
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
                            onChange={(event, newValue) => {
                              setFormData((prev) => ({
                                ...prev,
                                costCenter: newValue,
                              }));
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          Building
                          <Autocomplete
                            disablePortal
                            id="building-autocomplete"
                            options={building}
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
                            onChange={(event, newValue) => {
                              setFormData((prev) => ({
                                ...prev,
                                building: newValue,
                              }));
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-300 flex items-center">
                          Area
                          <Autocomplete
                            disablePortal
                            id="area-autocomplete"
                            options={area}
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
                            onChange={(event, newValue) => {
                              setFormData((prev) => ({
                                ...prev,
                                area: newValue,
                              }));
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    {/* //*permission Data */}

                    <div className="permission-data">
                      <div className="bg-white p-4 rounded-2xl">
                        <p className="dialog-head">Permission Data</p>
                        <label className="font-bold text-blue-300 flex items-center">
                          MFG Pro
                          <Autocomplete
                            disablePortal
                            id="mfg-pro-autocomplete"
                            options={mfgPro}
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
                            id="btp-autocomplete"
                            options={btp}
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
                            id="fpc-autocomplete"
                            options={fpc}
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
                            id="humatrix-autocomplete"
                            options={humatrix}
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
                            id="zwcad-autocomplete"
                            options={zwcad}
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
                            id="a1-server-autocomplete"
                            options={a1Server}
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
                            id="outsystem-autocomplete"
                            options={outsystem}
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
                      <div className="bg-white p-4 rounded-2xl">
                        <p className="dialog-head">Security Data</p>
                        <label className="font-bold text-blue-300 flex items-center">
                          Antivirus
                          <Autocomplete
                            disablePortal
                            id="antivirus-autocomplete"
                            options={antivirus}
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
                            id="antivirus-status-autocomplete"
                            options={antivirusStatus}
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
                            id="edr-status-autocomplete"
                            options={edrStatus}
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
