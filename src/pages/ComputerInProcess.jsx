//* Computer in process page component *//
import "./styles/ComputerInProcess.css";
import Navbar from "../components/Navbar/Navbar";

import DonutChart from "../components/charts/ComputerInProcessDonutChart";
import BarChart from "../components/charts/ComputerInProcessBarCharts";

import { useState, useEffect } from "react";

//*mui imports //
import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import axios from "axios";

function createData(name, calories, fat, carbs, protein, price) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
    price,
    history: [
      {
        date: "2020-01-05",
        customerId: "11091700",
        amount: 3,
      },
      {
        date: "2020-01-02",
        customerId: "Anonymous",
        amount: 1,
      },
    ],
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">{row.calories}</TableCell>
        <TableCell align="right">{row.fat}</TableCell>
        <TableCell align="right">{row.carbs}</TableCell>
        <TableCell align="right">{row.protein}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Total price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell align="right">{historyRow.amount}</TableCell>
                      <TableCell align="right">
                        {Math.round(historyRow.amount * row.price * 100) / 100}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    calories: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      })
    ).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
  }).isRequired,
};

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0, 3.99),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3, 4.99),
  createData("Eclair", 262, 16.0, 24, 6.0, 3.79),
  createData("Cupcake", 305, 3.7, 67, 4.3, 2.5),
  createData("Gingerbread", 356, 16.0, 49, 3.9, 1.5),
];

export default function ComputerInProcess() {
  //*Get data from API for Division, Department, Cost Center *//

  //*Division *//
  const [divisions, setDivisions] = useState([]);
  //*Department *//
  const [departments, setDepartments] = useState([]);
  //*Cost Center *//
  const [costCenters, setCostCenters] = useState([]);

  useEffect(() => {
    axios
      .get(`http://10.17.66.242:3001/api/smart_recovery/filter-division-list`)
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          setDivisions(res.data);
          setDepartments(res.data);
          setCostCenters(res.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching divisions:", error);
      });
  }, []);

  return (
    <>
      <Navbar />
      <Box>
        <div className="content">
          <div className="container is-fluid">
            <div className="container">
              <div className="columns">
                <div className="column">
                  <div className="card has-background-info">
                    <div className="card-content">
                      <p className="title">Total PC</p>
                      <p className="subtitle">240</p>
                    </div>
                  </div>
                </div>

                <div className="column">
                  <div className="card has-background-success">
                    <div className="card-content">
                      <p className="title">PC Connect</p>
                      <p className="subtitle">150</p>
                    </div>
                  </div>
                </div>

                <div className="column">
                  <div className="card has-background-warning">
                    <div className="card-content">
                      <p className="title">Wait Connect</p>
                      <p className="subtitle">190</p>
                    </div>
                  </div>
                </div>

                <div className="column">
                  <DonutChart />
                </div>
                <div className="col"></div>
              </div>
            </div>

            {/* Autocomplete for Division, Department, Cost Center */}
            <div className="container is-fluid">
              <div className="autocomplete">
                <Autocomplete
                  disablePortal
                  id="division-autocomplete"
                  options={divisions} // use the divisions state here
                  getOptionLabel={(option) => option.division} // assuming the object has a 'division' property
                  sx={{ width: 240 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Division" />
                  )}
                />
                <Autocomplete
                  disablePortal
                  id="department-autocomplete"
                  options={departments} // use the departments state here
                  getOptionLabel={(option) => option.department} // assuming the object has a 'department' property
                  sx={{ width: 240, ml: 2 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Department" />
                  )}
                />
                <Autocomplete
                  disablePortal
                  id="costcenter-autocomplete"
                  options={costCenters} // use the costCenters state here
                  getOptionLabel={(option) => option.costcenter} // assuming the object has a 'costcenter' property
                  sx={{ width: 240, ml: 2 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Cost Center" />
                  )}
                />
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ borderRadius: 4, ml: 2 }}
                >
                  Search
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ borderRadius: 4, ml: 2 }}
                >
                  Request SE
                </Button>
              </div>
            </div>
            {/* Autocomplete for Division, Department, Cost Center */}

            {/* Table for Computer in Process */}
            <div className="table-container">
              <div className="container is-fluid">
                <TableContainer component={Paper}>
                  <Table aria-label="collapsible table">
                    <TableHead>
                      <TableRow>
                        <TableCell />
                        <TableCell>Dessert (100g serving)</TableCell>
                        <TableCell align="right">Calories</TableCell>
                        <TableCell align="right">Fat&nbsp;(g)</TableCell>
                        <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                        <TableCell align="right">Protein&nbsp;(g)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <Row key={row.name} row={row} />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </>
  );
}
