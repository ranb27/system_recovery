import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import CountUsageCIP from "../catchcount/CountUsageCIP";

function ComputerInProcessSearch({ onSearch }) {
  const [error, setError] = useState(null);

  //Set Dropdown List
  const [selecteddivision, setSelecteddivision] = useState({
    division: "ALL",
  });
  const [selectedDepartment, setSelectedDepartment] = useState({
    dep_unit: "ALL",
  });
  const [selectedCostCenter, setSelectedCostCenter] = useState({
    cost_center_name: "ALL",
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
    setSelecteddivision(newValue);
    setSelectedDepartment({ dep_unit: "ALL" });
    setSelectedCostCenter({ cost_center_name: "ALL" });
    if (newValue === null || newValue === undefined) {
      setSelecteddivision({ division: "ALL" });
      setSelectedDepartment({ dep_unit: "ALL" });
      setSelectedCostCenter({ cost_center_name: "ALL" });
    }
  };

  const handleDepartmentChange = (event, newValue) => {
    setSelectedDepartment(newValue);
    setSelectedCostCenter({ cost_center_name: "ALL" });
    if (newValue === null || newValue === undefined) {
      setSelectedDepartment({ dep_unit: "ALL" });
      setSelectedCostCenter({ cost_center_name: "ALL" });
    }
  };

  const handleCostcenterChange = (event, newValue) => {
    setSelectedCostCenter(newValue);
    if (newValue === null || newValue === undefined) {
      setSelectedCostCenter({ cost_center_name: "ALL" });
    }
  };

  const handleSearch = () => {
    // const formattedDate = selectedDate ? dayjs(selectedDate).format('DD/MM/YYYY') : null;
    const queryParams = {
      division: selecteddivision.division,
      Department: selectedDepartment.dep_unit,
      Cost_center: selectedCostCenter.cost_center_name,
    };
    // console.log("Query Params:", queryParams);
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
        <div className="container">
          <div className="flex flex-col gap-4 lg:flex-row animate-fade">
            <div className="flex items-center shadow-md w-fit">
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
                renderOption={(props, option) => {
                  return (
                    <li
                      {...props}
                      style={{ textAlign: "left" }} // Add this style to justify to the left
                    >
                      <span>{option.division}</span>
                    </li>
                  );
                }}
                isOptionEqualToValue={(option, value) =>
                  option && value && option.division === value.division
                }
              />
            </div>

            <div className="flex items-center shadow-md w-fit">
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
                renderOption={(props, option) => {
                  return (
                    <li
                      {...props}
                      style={{ textAlign: "left" }} // Add this style to justify to the left
                    >
                      <span>{option.dep_unit}</span>
                    </li>
                  );
                }}
                isOptionEqualToValue={(option, value) =>
                  option && value && option.dep_unit === value.dep_unit
                }
              />
            </div>

            <div className="flex items-center shadow-md w-fit">
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
                renderOption={(props, option) => {
                  return (
                    <li
                      {...props}
                      style={{ textAlign: "left" }} // Add this style to justify to the left
                    >
                      <span>{option.cost_center_name}</span>
                    </li>
                  );
                }}
                isOptionEqualToValue={(option, value) =>
                  option &&
                  value &&
                  option.cost_center_name === value.cost_center_name
                }
              />
            </div>
            <div className="flex flex-row gap-4">
              <button
                className="bg-blue-500 w-24 h-12 font-bold rounded-lg px-4 shadow-lg text-white hover:bg-blue-700 ease-linear transition-colors duration-300 transform hover:scale-105 motion-reduce:transform-none transfrom active:scale-95 motion-reduce:transfrom-none lg:w-fit lg:h-full animate-fade"
                onClick={() => {
                  handleSearch();
                  CountUsageCIP();
                }}
              >
                Search
              </button>

              <button
                className="bg-green-500 w-36 h-12 font-bold rounded-lg px-4 shadow-lg text-white hover:bg-green-700 ease-linear transition-colors duration-300 transform hover:scale-105 motion-reduce:transform-none transfrom active:scale-95 motion-reduce:transfrom-none lg:w-fit lg:h-full whitespace-nowrap animate-fade"
                onClick={() => {
                  Swal.fire({
                    title: "This feature is not available",
                    icon: "warning",
                    showCancelButton: false,
                    confirmButtonText: "OK",
                    confirmButtonColor: "#3085d6",
                  });
                }}
              >
                Request SE
              </button>
            </div>
          </div>
        </div>
      </Box>
    </>
  );
}

export default ComputerInProcessSearch;
