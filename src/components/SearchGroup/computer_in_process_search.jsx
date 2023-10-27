import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import React, { useState, useEffect } from "react";
import axios from "axios";

function Computer_In_Process_Search_Group({ onSearch }) {
  const [error, setError] = useState(null);

  //Set Dropdown List
  const [selecteddivision, setSelecteddivision] = useState({
    division: "Division",
  });
  const [selectedDepartment, setSelectedDepartment] = useState({
    dep_unit: "Department",
  });
  const [selectedCostCenter, setSelectedCostCenter] = useState({
    cost_center_name: "Cost Center",
  });

  //Set Parameter from API
  const [distinctdivision, setDistinctdivision] = useState([]);
  const [distinctDepartment, setDistinctDepartment] = useState([]);
  const [distinctCostCenter, setDistinctCostCenter] = useState([]);

  const fetchdivision = async () => {
    try {
      const response = await axios.get(
        "http://10.17.66.242:3001/api/smart_recovery/filter-division-list"
      );
      const datadivision = response.data;
      setDistinctdivision(datadivision);
      console.log(datadivision);
    } catch (error) {
      console.error(`Error fetching distinct data division List: ${error}`);
    }
  };

  const fetchDepartment = async (division) => {
    console.log("division 1", division);

    try {
      const response = await axios.get(
        `http://10.17.66.242:3001/api/smart_recovery/filter-department-list?division=${division}`
      );
      const dataDepartment = response.data;
      console.log("Dep", dataDepartment);
      // const dataDepartment = await response.data;
      setDistinctDepartment(dataDepartment);
    } catch (error) {
      console.error(`Error fetching distinct data Department List: ${error}`);
    }
  };

  const fetchCostCenter = async () => {
    try {
      const response = await axios.get(
        `http://10.17.66.242:3001/api/smart_recovery/filter-costcenter-list?division=${selecteddivision.division}&department=${selectedDepartment.dep_unit}`
      );
      const dataCostCenter = response.data;
      console.log("Cost", dataCostCenter);
      // const dataCostCenter = await response.data;
      setDistinctCostCenter(dataCostCenter);
    } catch (error) {
      console.error(`Error fetching distinct data Department List: ${error}`);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  //สร้าง Function selection change
  const handledivisionChange = (event, newValue) => {
    setSelecteddivision(newValue);
    setSelectedDepartment({ dep_unit: "Department" });
    setSelectedCostCenter({ cost_center_name: "Cost Center" });
  };

  const handleDepartmentChange = (event, newValue) => {
    setSelectedDepartment(newValue);
    setSelectedCostCenter({ cost_center_name: "Cost Center" });
  };

  const handleCostcenterChange = (event, newValue) => {
    setSelectedCostCenter(newValue);
  };

  const handleSearch = () => {
    // const formattedDate = selectedDate ? dayjs(selectedDate).format('DD/MM/YYYY') : null;
    const queryParams = {
      division: selecteddivision.division,
      Department: selectedDepartment.dep_unit,
      Cost_center: selectedCostCenter.cost_center_name,
    };
    console.log("Query Params:", queryParams);
    onSearch(queryParams);
  };

  // useEffect(() => {
  //     fetchdivision();
  // }, []);

  useEffect(() => {
    fetchdivision();
    if (selecteddivision) {
      fetchDepartment(selecteddivision.division);
    }
    fetchCostCenter();
  }, [selecteddivision, selectedDepartment, selectedCostCenter]);

  return (
    <React.Fragment>
      <Box maxWidth="xl" sx={{ width: "100%", height: 50 }}>
        <Grid container spacing={0} style={{ width: 1350 }}>
          <Grid item xs={2} md={2}>
            <div style={{ display: "grid", placeItems: "center" }}>
              <Autocomplete
                disablePortal
                id="combo-box-demo-series"
                // size="small"
                options={distinctdivision}
                getOptionLabel={(option) => option && option.division}
                value={selecteddivision}
                onChange={handledivisionChange}
                sx={{
                  width: 250,
                  height: "60px",
                  marginTop: "8px",
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Division" />
                )}
                isOptionEqualToValue={(option, value) =>
                  option && value && option.division === value.division
                }
              />
            </div>
          </Grid>
          <Grid item xs={2} md={2}>
            <div style={{ display: "grid", placeItems: "center" }}>
              <Autocomplete
                disablePortal
                // freeSolo
                id="combo-box-demo-product"
                // size="small"
                options={distinctDepartment}
                getOptionLabel={(option) => option && option.dep_unit}
                value={selectedDepartment}
                onChange={handleDepartmentChange}
                sx={{
                  width: 250,
                  height: "60px",
                  marginTop: "8px",
                  marginLeft: "40px",
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Department" />
                )}
                isOptionEqualToValue={(option, value) =>
                  option && value && option.dep_unit === value.dep_unit
                }
              />
            </div>
          </Grid>
          <Grid item xs={2} md={2}>
            <div style={{ display: "grid", placeItems: "center" }}>
              <Autocomplete
                disablePortal
                // freeSolo
                id="combo-box-demo-product"
                // size="small"
                options={distinctCostCenter}
                getOptionLabel={(option) => option && option.cost_center_name}
                value={selectedCostCenter}
                onChange={handleCostcenterChange}
                sx={{
                  width: 250,
                  height: "60px",
                  marginTop: "8px",
                  marginLeft: "80px",
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Cost Center" />
                )}
                isOptionEqualToValue={(option, value) =>
                  option &&
                  value &&
                  option.cost_center_name === value.cost_center_name
                }
              />
            </div>
          </Grid>
          <Grid item xs={2} md={2}>
            <Button
              variant="contained"
              // size="small"
              style={{
                width: 150,
                height: "50px",
                marginTop: "10px",
                marginLeft: "130px",
                borderRadius: 10,
              }}
              onClick={handleSearch}
            >
              Search
            </Button>
          </Grid>
          <Grid item xs={2} md={2}>
            <Button
              variant="contained"
              // size="small"
              style={{
                width: 150,
                height: "50px",
                marginTop: "10px",
                marginLeft: "60px",
                borderRadius: 10,
              }}
            >
              Request SE
            </Button>
          </Grid>
        </Grid>
      </Box>
    </React.Fragment>
  );
}

export default Computer_In_Process_Search_Group;
