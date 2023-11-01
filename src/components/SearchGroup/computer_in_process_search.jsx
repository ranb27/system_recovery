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
  const handleDivisionChange = (event, newValue) => {
    if (newValue !== null && newValue.length !== 0) {
      setSelecteddivision(newValue);
    } else {
      setSelecteddivision({ division: "Division" });
    }
  };

  const handleDepartmentChange = (event, newValue) => {
    if (newValue !== null && newValue.length !== 0) {
      setSelectedDepartment(newValue);
    } else {
      setSelectedDepartment({ dep_unit: "Department" });
    }
  };

  const handleCostcenterChange = (event, newValue) => {
    if (newValue !== null && newValue.length !== 0) {
      setSelectedCostCenter(newValue);
    } else {
      setSelectedCostCenter({ cost_center_name: "Cost Center" });
    }
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
    <>
      <Box maxWidth="xl" sx={{ width: "100%", height: 50, mb: 1 }}>
        <Grid container spacing={0} className="w-1350">
          <div className="flex flex-row gap-4">
            <div className="flex items-center">
              <Autocomplete
                disablePortal
                id="division"
                options={distinctdivision}
                getOptionLabel={(option) => option && option.division}
                value={selecteddivision}
                onChange={handleDivisionChange}
                className="w-96 h-auto"
                renderInput={(params) => (
                  <TextField {...params} label="Division" />
                )}
                isOptionEqualToValue={(option, value) =>
                  option && value && option.division === value.division
                }
              />
            </div>

            <div className="flex items-center">
              <Autocomplete
                disablePortal
                id="department"
                options={distinctDepartment}
                getOptionLabel={(option) => option && option.dep_unit}
                value={selectedDepartment}
                onChange={handleDepartmentChange}
                className="w-96 h-auto"
                renderInput={(params) => (
                  <TextField {...params} label="Department" />
                )}
                isOptionEqualToValue={(option, value) =>
                  option && value && option.dep_unit === value.dep_unit
                }
              />
            </div>

            <div className="flex items-center">
              <Autocomplete
                disablePortal
                id="costcenter"
                options={distinctCostCenter}
                getOptionLabel={(option) => option && option.cost_center_name}
                value={selectedCostCenter}
                onChange={handleCostcenterChange}
                className="w-96 h-auto"
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

            <Button
              variant="contained"
              // size="small"
              style={{
                width: 100,
                height: "50px",
                borderRadius: 10,
              }}
              onClick={handleSearch}
            >
              Search
            </Button>

            <Button
              variant="contained"
              // size="small"
              style={{
                width: 150,
                height: "50px",
                borderRadius: 10,
              }}
            >
              Request SE
            </Button>
          </div>
        </Grid>
      </Box>
    </>
  );
}

export default Computer_In_Process_Search_Group;
