//* Computer in process page component *//
import "./styles/ComputerInProcess.css";
import Navbar from "../components/Navbar/Navbar";

import DonutChart from "../components/charts/ComputerInProcessDonutChart";
import BarChart from "../components/charts/ComputerInProcessBarCharts";

import { useState, useEffect } from "react";

//*mui imports //

import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
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

  //*Table *//
  const rows = [
    { id: 1, name: "John Doe", age: 25, occupation: "Engineer" },
    { id: 2, name: "Jane Smith", age: 30, occupation: "Doctor" },
    // ... add more rows as needed
  ];

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "age", headerName: "Age", width: 100 },
    { field: "occupation", headerName: "Occupation", width: 150 },
    // ... add more columns as needed
  ];

  return (
    <>
      <Container maxWidth="lg">
        <Navbar />
        <Box>
          <div className="columns is-desktop">
            <div className="column is-one-quarter">
              <div className="box has-background-info">
                <p className="title">Total PC</p>
                <p className="subtitle">240</p>
              </div>
            </div>

            <div className="column is-one-quarter">
              <div className="box has-background-success">
                <p className="title">PC Connect</p>
                <p className="subtitle">150</p>
              </div>
            </div>

            <div className="column is-one-quarter">
              <div className="box has-background-warning">
                <p className="title">Wait Connect</p>
                <p className="subtitle">190</p>
              </div>
            </div>
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
          <div style={{ height: 680, width: "100%", marginTop: 16 }}>
            <DataGrid rows={rows} columns={columns} pageSize={5} />
          </div>
        </Box>
      </Container>
    </>
  );
}
