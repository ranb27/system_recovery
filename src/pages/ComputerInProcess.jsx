//* Computer in process page component *//

import * as React from "react";
import "./styles/ComputerInProcess.css";
import Navbar from "../components/Navbar/Navbar";

// import DonutChart from "../components/charts/ComputerInProcessDonutChart";
import BarChart from "../components/charts/ComputerInProcessBarCharts";

import { useState, useEffect } from "react";

//*mui imports //

import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import Computer_In_Process_Search_Group from "../components/SearchGroup/computer_in_process_search";

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
// import Swal from "sweetalert2";

//*Set style for table *//

const StyledDataGrid = styled(DataGrid)({
  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: "bold",
    color: " #3371ff",
    fontSize: "15px",
    textAlign: "center",
  },
});

//Todo : Add filter about division, department, cost center to display in the table //from p'Keem
//Todo : Add edit function to save data to database with update API

export default function ComputerInProcess() {
  //*Get data from API for Division, Department, Cost Center *//

  //   API : filter-division-list
  // http://10.17.66.242:3001/api/smart_recovery/filter-division-list

  // API : filter-department-list
  // http://10.17.66.242:3001/api/smart_recovery/filter-department-list?division=Division
  // http://10.17.66.242:3001/api/smart_recovery/filter-department-list?division=Business%20Operation%20Div.

  // API : filter-costcenter-list
  // http://10.17.66.242:3001/api/smart_recovery/filter-costcenter-list?division=Division&department=Department

  // http://10.17.66.242:3001/api/smart_recovery/filter-costcenter-list?division=Business%20Operation%20Div.&department=Department

  // http://10.17.66.242:3001/api/smart_recovery/filter-costcenter-list?division=Division&department=PLN

  // http://10.17.66.242:3001/api/smart_recovery/filter-costcenter-list?division=Business%20Operation%20Div.&department=LOG

  //* Get data to display in the table *//
  // http://10.17.66.242:3001/api/smart_recovery/filter-data-computer-list?division=Division&department=Department&cost_center=Cost%20Center

  // http://10.17.66.242:3001/api/smart_recovery/filter-data-computer-list?division=Business%20Operation%20Div.&department=Department&cost_center=Cost%20Center

  // http://10.17.66.242:3001/api/smart_recovery/filter-data-computer-list?division=Business%20Operation%20Div.&department=PLN&cost_center=Cost%20Center

  // http://10.17.66.242:3001/api/smart_recovery/filter-data-computer-list?division=Business%20Operation%20Div.&department=PLN&cost_center=R310-1C/PLN

  // http://10.17.66.242:3001/api/smart_recovery/filter-data-computer-list?division=Division&department=PLN&cost_center=Cost%20Center

  // http://10.17.66.242:3001/api/smart_recovery/filter-data-computer-list?division=Division&department=Department&cost_center=R310-1C/PLN

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

  const columns = [
    { field: "id", headerName: "No", width: 70 },
    { field: "factory_emp", headerName: "Factory", width: 70 },
    { field: "pc_name", headerName: "PC Name", width: 120 },
    { field: "pc_type", headerName: "PC Type", width: 100 },
    { field: "os", headerName: "OS", width: 70 },
    { field: "pc_use_for", headerName: "PC Use For", width: 120 },
    { field: "building", headerName: "Building", width: 90 },
    { field: "process", headerName: "Process", width: 100 },
    { field: "area", headerName: "Area", width: 100 },
    { field: "employee_id", headerName: "User ID Code", width: 120 },
    { field: "emp_name_eng", headerName: "Name - Surname", width: 300 },
    { field: "job_level", headerName: "Job Level", width: 100 },
    { field: "connect_status", headerName: "Status Connect", width: 150 },
    { field: "cost_center_code", headerName: "Cost Center", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <Button variant="outlined" onClick={() => handleOpen(params.row)}>
          Edit
        </Button>
      ),
    },
  ];

  //*Dialog *//
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const handleOpen = (data) => {
    setSelectedData(data);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    //TODO : Save data to database
    console.log(formData);
    if (formData === null) {
      setFormData(selectedData);
    }

    setFormData({});
    handleClose();
  };

  //*Filter *//
  const [filterModel, setFilterModel] = React.useState({
    items: [],
    quickFilterExcludeHiddenColumns: true,
    quickFilterValues: [""],
  });

  //*Edit *//
  const [formData, setFormData] = useState({});

  const [pcName, setPcName] = useState([]);
  const pcType = ["Desktop", "Laptop"];
  const os = [
    "Windows 10",
    "Windows 7",
    "Windows 8",
    "Windows XP",
    "Embleded",
    "MAC OS",
  ];
  const osVersion = ["64 bit", "32 bit"];
  const startDate = ["2021-10-01", "2021-10-02"];
  const [macAddress, setMacAddress] = useState([]);
  const [ipAddress, setIpAddress] = useState([]);
  const connectType = ["LAN (WAN)", "WIFI (PRD_SCAN)", "WIFI (PRD_OFFICE)"];
  const joinDomain = ["Yes", "No"];
  const joinDomainDate = ["2021-10-01", "2021-10-02"];
  const pcUseFor = ["Personal"];
  const [idCode, setIdCode] = useState([]);
  const [nameSurname, setNameSurname] = useState([]);
  const [email, setEmail] = useState([]);
  const [jobLevel, setJobLevel] = useState([]);
  const [division, setDivision] = useState([]);
  const [department, setDepartment] = useState([]);
  const [manager, setManager] = useState([]);
  const [costCenter, setCostCenter] = useState([]);
  const building = ["A", "B", "C1", "C2", "C3", "D"];
  const [area, setArea] = useState([]);
  const [mfgPro, setMfgPro] = useState([]);
  const [btp, setBtp] = useState([]);
  const [fpc, setFpc] = useState([]);
  const [humatrix, setHumatrix] = useState([]);
  const [zwcad, setZwcad] = useState([]);
  const [a1Server, setA1Server] = useState([]);
  const [outsystem, setOutsystem] = useState([]);
  const antivirus = ["Kastersky", "Symantec", "Trend Micro", "McAfee"];
  const antivirusStatus = ["Normal", "Abnormal"];
  const edrStatus = ["Normal", "Abnormal"];

  return (
    <>
      <Container maxWidth="lg">
        <Navbar />
        <Box sx={{ ml: 4, mt: 8 }}>
          <div className="columns is-desktop">
            <div className="column is-one-quarter">
              <div className="box has-background-info">
                <p className="title is-4">Total PC</p>
                <div className="card">
                  <p className="subtitle">240</p>
                </div>
              </div>
            </div>

            <div className="column is-one-quarter">
              <div className="box has-background-success">
                <p className="title is-4">PC Connect</p>
                <div className="card">
                  <p className="subtitle">150</p>
                </div>
              </div>
            </div>

            <div className="column is-one-quarter">
              <div className="box has-background-warning">
                <p className="title is-4">Wait Connect</p>
                <div className="card">
                  <p className="subtitle">190</p>
                </div>
              </div>
            </div>

            <div className="column is-half">
              <div className="card">
                <BarChart />
              </div>
            </div>
          </div>

          {/* Autocomplete for Division, Department, Cost Center */}
          {/* <div className="columns is-desktop">
            <div className="autocomplete">
              <div className="column is-one-quarter">
                <Autocomplete
                  disablePortal
                  id="division-autocomplete"
                  options={divisions} // use the divisions state here
                  getOptionLabel={(option) => option.division} // assuming the object has a 'division' property
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Division" />
                  )}
                />
              </div>
              <div className="column is-one-quarter">
                <Autocomplete
                  disablePortal
                  id="department-autocomplete"
                  options={departments} // use the departments state here
                  getOptionLabel={(option) => option.department} // assuming the object has a 'department' property
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Department" />
                  )}
                />
              </div>
              <div className="column is-one-quarter">
                <Autocomplete
                  disablePortal
                  id="costcenter-autocomplete"
                  options={costCenters} // use the costCenters state here
                  getOptionLabel={(option) => option.costcenter} // assuming the object has a 'costcenter' property
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Cost Center" />
                  )}
                />
              </div>
              <div className="column">
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    borderRadius: 2,
                    height: 50,
                    width: 100,
                    ml: 2,
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  Search
                </Button>
              </div>
              <div className="column">
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    borderRadius: 2,
                    height: 50,
                    width: 150,
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  Request SE
                </Button>
              </div>
            </div>
          </div> */}

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

          {/* Autocomplete for Division, Department, Cost Center */}

          {/* Table for Computer in Process */}
          <div
            style={{
              height: 500,
              width: "90vw",
              marginTop: 16,
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
                <div className="dialog-content">
                  <div className="computer-data">
                    <div className="card">
                      <p className="dialog-head">Computer Data</p>
                      <label className="label-autocomplete">
                        PC Name
                        <Autocomplete
                          disablePortal
                          id="pc-name-autocomplete"
                          options={pcName}
                          getOptionLabel={(option) => option}
                          renderInput={(params) => (
                            <TextField {...params} label="PC Name" />
                          )}
                          sx={{ width: 300, mt: 1, mb: 1 }}
                          onChange={(event, newValue) => {
                            setFormData((prev) => ({
                              ...prev,
                              pcName: newValue,
                            }));
                          }}
                        />
                      </label>
                      <label className="label-autocomplete">
                        PC Type
                        <Autocomplete
                          disablePortal
                          id="pc-type-autocomplete"
                          options={pcType}
                          getOptionLabel={(option) => option}
                          renderInput={(params) => (
                            <TextField {...params} label="PC Type" />
                          )}
                          sx={{ width: 300, mt: 1, mb: 1 }}
                          onChange={(event, newValue) => {
                            setFormData((prev) => ({
                              ...prev,
                              pcType: newValue,
                            }));
                          }}
                        />
                      </label>
                      <label className="label-autocomplete">
                        OS
                        <Autocomplete
                          disablePortal
                          id="os-autocomplete"
                          options={os}
                          getOptionLabel={(option) => option}
                          renderInput={(params) => (
                            <TextField {...params} label="OS" />
                          )}
                          sx={{ width: 300, mt: 1, mb: 1 }}
                          onChange={(event, newValue) => {
                            setFormData((prev) => ({
                              ...prev,
                              os: newValue,
                            }));
                          }}
                        />
                      </label>
                      <label className="label-autocomplete">
                        OS Version
                        <Autocomplete
                          disablePortal
                          id="os-version-autocomplete"
                          options={osVersion}
                          getOptionLabel={(option) => option}
                          renderInput={(params) => (
                            <TextField {...params} label="OS Version" />
                          )}
                          sx={{ width: 300, mt: 1, mb: 1 }}
                          onChange={(event, newValue) => {
                            setFormData((prev) => ({
                              ...prev,
                              osVersion: newValue,
                            }));
                          }}
                        />
                      </label>
                      <label className="label-autocomplete">
                        Start Date
                        <Autocomplete
                          disablePortal
                          id="start-date-autocomplete"
                          options={startDate}
                          getOptionLabel={(option) => option}
                          renderInput={(params) => (
                            <TextField {...params} label="Start Date" />
                          )}
                          sx={{ width: 300, mt: 1, mb: 1 }}
                          onChange={(event, newValue) => {
                            setFormData((prev) => ({
                              ...prev,
                              startDate: newValue,
                            }));
                          }}
                        />
                      </label>
                      <label className="label-autocomplete">
                        MAC Address
                        <Autocomplete
                          disablePortal
                          id="mac-address-autocomplete"
                          options={macAddress}
                          getOptionLabel={(option) => option}
                          renderInput={(params) => (
                            <TextField {...params} label="Mac Address" />
                          )}
                          sx={{ width: 300, mt: 1, mb: 1 }}
                          onChange={(event, newValue) => {
                            setFormData((prev) => ({
                              ...prev,
                              macAddress: newValue,
                            }));
                          }}
                        />
                      </label>
                      <label className="label-autocomplete">
                        IP Address
                        <Autocomplete
                          disablePortal
                          id="ip-address-autocomplete"
                          options={ipAddress}
                          getOptionLabel={(option) => option}
                          renderInput={(params) => (
                            <TextField {...params} label="IP Address" />
                          )}
                          sx={{ width: 300, mt: 1, mb: 1 }}
                          onChange={(event, newValue) => {
                            setFormData((prev) => ({
                              ...prev,
                              ipAddress: newValue,
                            }));
                          }}
                        />
                      </label>
                      <label className="label-autocomplete">
                        Connect Type
                        <Autocomplete
                          disablePortal
                          id="connect-type-autocomplete"
                          options={connectType}
                          getOptionLabel={(option) => option}
                          renderInput={(params) => (
                            <TextField {...params} label="Connect Type" />
                          )}
                          sx={{ width: 300, mt: 1, mb: 1 }}
                          onChange={(event, newValue) => {
                            setFormData((prev) => ({
                              ...prev,
                              connectType: newValue,
                            }));
                          }}
                        />
                      </label>
                      <label className="label-autocomplete">
                        Join Domain
                        <Autocomplete
                          disablePortal
                          id="join-domain-autocomplete"
                          options={joinDomain}
                          getOptionLabel={(option) => option}
                          renderInput={(params) => (
                            <TextField {...params} label="Join Domain" />
                          )}
                          sx={{ width: 300, mt: 1, mb: 1 }}
                          onChange={(event, newValue) => {
                            setFormData((prev) => ({
                              ...prev,
                              joinDomain: newValue,
                            }));
                          }}
                        />
                      </label>
                      <label className="label-autocomplete">
                        Join Domain Date
                        <Autocomplete
                          type="date"
                          disablePortal
                          id="join-domain-date-autocomplete"
                          options={joinDomainDate}
                          getOptionLabel={(option) => option}
                          renderInput={(params) => (
                            <TextField {...params} label="Join Domain Date" />
                          )}
                          sx={{ width: 300, mt: 1, mb: 1 }}
                          onChange={(event, newValue) => {
                            setFormData((prev) => ({
                              ...prev,
                              joinDomainDate: newValue,
                            }));
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* //*User Data  */}

                  <div className="user-data">
                    <div className="card">
                      <p className="dialog-head">User Data</p>
                      <label className="label-autocomplete">
                        PC Use For
                        <Autocomplete
                          disablePortal
                          id="pc-use-for-autocomplete"
                          options={pcUseFor}
                          getOptionLabel={(option) => option}
                          renderInput={(params) => (
                            <TextField {...params} label="PC Use For" />
                          )}
                          sx={{ width: 300, mt: 1, mb: 1 }}
                        />
                      </label>
                      <label className="label-autocomplete">
                        ID Code
                        <Autocomplete
                          disablePortal
                          id="id-code-autocomplete"
                          options={idCode}
                          getOptionLabel={(option) => option}
                          renderInput={(params) => (
                            <TextField {...params} label="ID Code" />
                          )}
                          sx={{ width: 300, mt: 1, mb: 1 }}
                        />
                      </label>
                      <label className="label-autocomplete">
                        Name - Surname
                        <Autocomplete
                          disablePortal
                          id="name-surname-autocomplete"
                          options={nameSurname}
                          getOptionLabel={(option) => option}
                          renderInput={(params) => (
                            <TextField {...params} label="Name - Surname" />
                          )}
                          sx={{ width: 300, mt: 1, mb: 1 }}
                        />
                      </label>
                      <label className="label-autocomplete">
                        Email
                        <Autocomplete
                          disablePortal
                          id="email-autocomplete"
                          options={email}
                          getOptionLabel={(option) => option}
                          renderInput={(params) => (
                            <TextField {...params} label="Email" />
                          )}
                          sx={{ width: 300, mt: 1, mb: 1 }}
                        />
                      </label>
                      <label className="label-autocomplete">
                        Job Level
                        <Autocomplete
                          disablePortal
                          id="job-level-autocomplete"
                          options={jobLevel}
                          getOptionLabel={(option) => option}
                          renderInput={(params) => (
                            <TextField {...params} label="Job Level" />
                          )}
                          sx={{ width: 300, mt: 1, mb: 1 }}
                        />
                      </label>
                      <label className="label-autocomplete">
                        Division
                        <Autocomplete
                          disablePortal
                          id="division-autocomplete"
                          options={division}
                          getOptionLabel={(option) => option}
                          renderInput={(params) => (
                            <TextField {...params} label="Division" />
                          )}
                          sx={{ width: 300, mt: 1, mb: 1 }}
                        />
                      </label>
                      <label className="label-autocomplete">
                        Department
                        <Autocomplete
                          disablePortal
                          id="department-autocomplete"
                          options={department}
                          getOptionLabel={(option) => option}
                          renderInput={(params) => (
                            <TextField {...params} label="Department" />
                          )}
                          sx={{ width: 300, mt: 1, mb: 1 }}
                        />
                      </label>
                      <label className="label-autocomplete">
                        Manager
                        <Autocomplete
                          disablePortal
                          id="manager-autocomplete"
                          options={manager}
                          getOptionLabel={(option) => option}
                          renderInput={(params) => (
                            <TextField {...params} label="Manager" />
                          )}
                          sx={{ width: 300, mt: 1, mb: 1 }}
                        />
                      </label>
                      <label className="label-autocomplete">
                        Cost Cente
                        <Autocomplete
                          disablePortal
                          id="cost-center-autocomplete"
                          options={costCenter}
                          getOptionLabel={(option) => option}
                          renderInput={(params) => (
                            <TextField {...params} label="Cost Center" />
                          )}
                          sx={{ width: 300, mt: 1, mb: 1 }}
                        />
                      </label>
                      <label className="label-autocomplete">
                        Building
                        <Autocomplete
                          disablePortal
                          id="building-autocomplete"
                          options={building}
                          getOptionLabel={(option) => option}
                          renderInput={(params) => (
                            <TextField {...params} label="Building" />
                          )}
                          sx={{ width: 300, mt: 1, mb: 1 }}
                        />
                      </label>
                      <label className="label-autocomplete">
                        Area
                        <Autocomplete
                          disablePortal
                          id="area-autocomplete"
                          options={area}
                          getOptionLabel={(option) => option}
                          renderInput={(params) => (
                            <TextField {...params} label="Area" />
                          )}
                          sx={{ width: 300, mt: 1, mb: 1 }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* //*permission Data */}

                  <div className="permission-data">
                    <div className="card">
                      <p className="dialog-head">Permission Data</p>
                      <label className="label-autocomplete">
                        MFG Pro
                        <Autocomplete
                          disablePortal
                          id="mfg-pro-autocomplete"
                          options={mfgPro}
                          getOptionLabel={(option) => option}
                          renderInput={(params) => (
                            <TextField {...params} label="MFG Pro" />
                          )}
                          sx={{ width: 300, mt: 1, mb: 1 }}
                        />
                      </label>
                      <label className="label-autocomplete">
                        BTP
                        <Autocomplete
                          disablePortal
                          id="btp-autocomplete"
                          options={btp}
                          getOptionLabel={(option) => option}
                          renderInput={(params) => (
                            <TextField {...params} label="BTP" />
                          )}
                          sx={{ width: 300, mt: 1, mb: 1 }}
                        />
                      </label>
                      <label className="label-autocomplete">
                        FPC
                        <Autocomplete
                          disablePortal
                          id="fpc-autocomplete"
                          options={fpc}
                          getOptionLabel={(option) => option}
                          renderInput={(params) => (
                            <TextField {...params} label="FPC" />
                          )}
                          sx={{ width: 300, mt: 1, mb: 1 }}
                        />
                      </label>
                      <label className="label-autocomplete">
                        Humatrix
                        <Autocomplete
                          disablePortal
                          id="humatrix-autocomplete"
                          options={humatrix}
                          getOptionLabel={(option) => option}
                          renderInput={(params) => (
                            <TextField {...params} label="Humatrix" />
                          )}
                          sx={{ width: 300, mt: 1, mb: 1 }}
                        />
                      </label>
                      <label className="label-autocomplete">
                        ZWCAD
                        <Autocomplete
                          disablePortal
                          id="zwcad-autocomplete"
                          options={zwcad}
                          getOptionLabel={(option) => option}
                          renderInput={(params) => (
                            <TextField {...params} label="ZWCAD" />
                          )}
                          sx={{ width: 300, mt: 1, mb: 1 }}
                        />
                      </label>
                      <label className="label-autocomplete">
                        A1 Server
                        <Autocomplete
                          disablePortal
                          id="a1-server-autocomplete"
                          options={a1Server}
                          getOptionLabel={(option) => option}
                          renderInput={(params) => (
                            <TextField {...params} label="A1 Server" />
                          )}
                          sx={{ width: 300, mt: 1, mb: 1 }}
                        />
                      </label>
                      <label className="label-autocomplete">
                        Outsystem
                        <Autocomplete
                          disablePortal
                          id="outsystem-autocomplete"
                          options={outsystem}
                          getOptionLabel={(option) => option}
                          renderInput={(params) => (
                            <TextField {...params} label="Outsystem" />
                          )}
                          sx={{ width: 300, mt: 1, mb: 1 }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* //*Security Data */}

                  <div className="security-data">
                    <div className="card">
                      <p className="dialog-head">Security Data</p>
                      <label className="label-autocomplete">
                        Antivirus
                        <Autocomplete
                          disablePortal
                          id="antivirus-autocomplete"
                          options={antivirus}
                          getOptionLabel={(option) => option}
                          renderInput={(params) => (
                            <TextField {...params} label="Antivirus" />
                          )}
                          sx={{ width: 300, mt: 1, mb: 1 }}
                        />
                      </label>

                      <label className="label-autocomplete">
                        Antivirus Status
                        <Autocomplete
                          disablePortal
                          id="antivirus-status-autocomplete"
                          options={antivirusStatus}
                          getOptionLabel={(option) => option}
                          renderInput={(params) => (
                            <TextField {...params} label="Antivirus Status" />
                          )}
                          sx={{ width: 300, mt: 1, mb: 1 }}
                        />
                      </label>
                      <label className="label-autocomplete">
                        EDR Status
                        <Autocomplete
                          disablePortal
                          id="edr-status-autocomplete"
                          options={edrStatus}
                          getOptionLabel={(option) => option}
                          renderInput={(params) => (
                            <TextField {...params} label="EDR Status" />
                          )}
                          sx={{ width: 300, mt: 1, mb: 1 }}
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
    </>
  );
}
