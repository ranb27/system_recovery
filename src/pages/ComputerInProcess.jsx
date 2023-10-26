//* Computer in process page component *//
import "./styles/ComputerInProcess.css";
import Navbar from "../components/Navbar/Navbar";

import DonutChart from "../components/charts/ComputerInProcessDonutChart";
import BarChart from "../components/charts/ComputerInProcessBarCharts";

import { useState, useEffect } from "react";

//*mui imports //

import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";

import {
  Container,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";

const StyledDataGrid = styled(DataGrid)({
  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: "bold",
    color: " #3371ff",
  },
});

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

  console.log(divisions);
  console.log(departments);
  console.log(costCenters);

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
          `http://10.17.66.242:3001/api/smart_recovery/filter-data-computer-list?division=Division&department=Department&cost_center=Cost%20Center`
        )
        .then((res) => {
          setRows(res.data);
        });
      return response;
    };
    getRows();
  }, []);

  const columns = [
    { field: "id", headerName: "No", width: 70 },
    { field: "factory_emp", headerName: "Factory", width: 70 },
    { field: "pc_name", headerName: "PC Name", width: 120 },
    { field: "pc_type", headerName: "PC Type", width: 100 },
    { field: "os", headerName: "OS", width: 70 },
    { field: "pc_use_for", headerName: "PC Use For", width: 120 },
    { field: "building", headerName: "Building", width: 70 },
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

    handleClose();
  };

  //* Option for DataGrid *//

  return (
    <>
      <Container maxWidth="lg">
        <Navbar />
        <Box sx={{ ml: 4, mt: 8 }}>
          <div className="columns is-desktop">
            <div className="column is-one-quarter">
              <div className="box has-background-info">
                <p className="title is-4">Total PC</p>
                <p className="subtitle">240</p>
              </div>
            </div>

            <div className="column is-one-quarter">
              <div className="box has-background-success">
                <p className="title is-4">PC Connect</p>
                <p className="subtitle">150</p>
              </div>
            </div>

            <div className="column is-one-quarter">
              <div className="box has-background-warning">
                <p className="title is-4">Wait Connect</p>
                <p className="subtitle">190</p>
              </div>
            </div>
            <BarChart />
          </div>

          {/* Autocomplete for Division, Department, Cost Center */}

          <div className="autocomplete">
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
            <Autocomplete
              disablePortal
              id="department-autocomplete"
              options={departments} // use the departments state here
              getOptionLabel={(option) => option.department} // assuming the object has a 'department' property
              sx={{ width: 300, ml: 2 }}
              renderInput={(params) => (
                <TextField {...params} label="Department" />
              )}
            />
            <Autocomplete
              disablePortal
              id="costcenter-autocomplete"
              options={costCenters} // use the costCenters state here
              getOptionLabel={(option) => option.costcenter} // assuming the object has a 'costcenter' property
              sx={{ width: 300, ml: 2 }}
              renderInput={(params) => (
                <TextField {...params} label="Cost Center" />
              )}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ borderRadius: 2, ml: 2, height: 50, width: 100 }}
            >
              Search
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ borderRadius: 2, ml: 2, height: 50, width: 150 }}
            >
              Request SE
            </Button>
          </div>

          {/* Autocomplete for Division, Department, Cost Center */}

          {/* Table for Computer in Process */}
          <div style={{ height: 600, width: "90vw", marginTop: 16 }}>
            <StyledDataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              slots={{ toolbar: GridToolbar }}
            />
          </div>

          {selectedData && (
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Edit User</DialogTitle>
              <DialogContent>
                <TextField
                  margin="dense"
                  label="Name"
                  fullWidth
                  value={selectedData.name}
                />
                <TextField
                  margin="dense"
                  label="Age"
                  type="number"
                  fullWidth
                  value={selectedData.age}
                />
                <TextField
                  margin="dense"
                  label="Occupation"
                  fullWidth
                  value={selectedData.occupation}
                />
                {/* Add more fields as required */}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleSave} color="primary">
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          )}
        </Box>
      </Container>
    </>
  );
}
