import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import CountUsageCIP from "../catchcount/CountUsageCIP";

function ComputerInProcessSearch({ onSearch }) {
  const [selectedDivision, setSelectedDivision] = useState({ division: "ALL" });
  const [selectedDepartment, setSelectedDepartment] = useState({
    dep_unit: "ALL",
  });
  const [selectedCostCenter, setSelectedCostCenter] = useState({
    cost_center_name: "ALL",
  });

  const [distinctDivision, setDistinctDivision] = useState([]);
  const [distinctDepartment, setDistinctDepartment] = useState([]);
  const [distinctCostCenter, setDistinctCostCenter] = useState([]);

  const fetchDivision = async () => {
    try {
      const response = await axios.get(
        "http://10.17.66.242:3001/api/smart_recovery/filter-division-list"
      );
      setDistinctDivision(response.data);
    } catch (error) {
      console.error(`Error fetching distinct data division List: ${error}`);
    }
  };

  const fetchDepartment = async (division) => {
    try {
      const response = await axios.get(
        `http://10.17.66.242:3001/api/smart_recovery/filter-department-list?division=${division}`
      );
      setDistinctDepartment(response.data);
    } catch (error) {
      console.error(`Error fetching distinct data Department List: ${error}`);
    }
  };

  const fetchCostCenter = async () => {
    try {
      const response = await axios.get(
        `http://10.17.66.242:3001/api/smart_recovery/filter-costcenter-list?division=${selectedDivision.division}&department=${selectedDepartment.dep_unit}`
      );
      setDistinctCostCenter(response.data);
    } catch (error) {
      console.error(`Error fetching distinct data Department List: ${error}`);
    }
  };

  useEffect(() => {
    fetchDivision();
  }, []);

  useEffect(() => {
    fetchDepartment(selectedDivision.division);
    fetchCostCenter();
  }, [selectedDivision, selectedDepartment]);

  const handleDivisionChange = (event, newValue) => {
    setSelectedDivision(newValue);
    setSelectedDepartment({ dep_unit: "ALL" });
    setSelectedCostCenter({ cost_center_name: "ALL" });
    if (!newValue) {
      setSelectedDivision({ division: "ALL" });
      setSelectedDepartment({ dep_unit: "ALL" });
      setSelectedCostCenter({ cost_center_name: "ALL" });
    }
  };

  const handleDepartmentChange = (event, newValue) => {
    setSelectedDepartment(newValue);
    setSelectedCostCenter({ cost_center_name: "ALL" });
    if (!newValue) {
      setSelectedDepartment({ dep_unit: "ALL" });
      setSelectedCostCenter({ cost_center_name: "ALL" });
    }
  };

  const handleCostCenterChange = (event, newValue) => {
    setSelectedCostCenter(newValue);
    if (!newValue) {
      setSelectedCostCenter({ cost_center_name: "ALL" });
    }
  };

  const handleSearch = () => {
    const queryParams = {
      division: selectedDivision.division,
      Department: selectedDepartment.dep_unit,
      Cost_center: selectedCostCenter.cost_center_name,
    };
    onSearch(queryParams);
    CountUsageCIP();
  };

  return (
    <Box maxWidth="xl" sx={{ width: "100%", height: 50, mb: 1 }}>
      <div className="container">
        <div className="flex flex-col gap-4 lg:flex-row animate-fade">
          <AutocompleteDropdown
            id="division"
            options={distinctDivision}
            value={selectedDivision}
            onChange={handleDivisionChange}
            label="Division"
            optionLabel="division"
          />
          <AutocompleteDropdown
            id="department"
            options={distinctDepartment}
            value={selectedDepartment}
            onChange={handleDepartmentChange}
            label="Department"
            optionLabel="dep_unit"
          />
          <AutocompleteDropdown
            id="costcenter"
            options={distinctCostCenter}
            value={selectedCostCenter}
            onChange={handleCostCenterChange}
            label="Cost Center"
            optionLabel="cost_center_name"
          />
          <div className="flex flex-row gap-4">
            <button
              className="bg-blue-500 w-24 h-12 font-bold rounded-lg px-4 shadow-lg text-white hover:bg-blue-700 ease-linear transition-colors duration-300 transform hover:scale-105 motion-reduce:transform-none transfrom active:scale-95 motion-reduce:transfrom-none lg:w-fit lg:h-full animate-fade hover:shadow-blue-200 hover:shadow-lg"
              onClick={handleSearch}
            >
              Search
            </button>
            <button
              className="bg-green-500 w-36 h-12 font-bold rounded-lg px-4 shadow-lg text-white hover:bg-green-700 ease-linear transition-colors duration-300 transform hover:scale-105 motion-reduce:transform-none transfrom active:scale-95 motion-reduce:transfrom-none lg:w-fit lg:h-full whitespace-nowrap animate-fade hover:shadow-lime-200 hover:shadow-lg"
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
  );
}

function AutocompleteDropdown({
  id,
  options,
  value,
  onChange,
  label,
  optionLabel,
}) {
  return (
    <div className="flex items-center shadow-md w-fit">
      <Autocomplete
        disablePortal
        id={id}
        options={options}
        getOptionLabel={(option) => option && option[optionLabel]}
        value={value}
        onChange={onChange}
        className="w-96 h-auto"
        renderInput={(params) => <TextField {...params} label={label} />}
        renderOption={(props, option) => (
          <li
            {...props}
            style={{ textAlign: "left" }} // Add this style to justify to the left
          >
            <span>{option[optionLabel]}</span>
          </li>
        )}
        isOptionEqualToValue={(option, val) =>
          option && val && option[optionLabel] === val[optionLabel]
        }
      />
    </div>
  );
}

export default ComputerInProcessSearch;
