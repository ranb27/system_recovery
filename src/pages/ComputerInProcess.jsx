import axios from "axios";
import Swal from "sweetalert2";
import * as React from "react";
import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

//* Computer in process page component *//

import Navbar from "../components/Navbar/Navbar";
import Computer_In_Process_Search_Group from "../components/searchgroup/computer_in_process_search";
import Chart from "react-apexcharts";

//*mui imports //

import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";

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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

//*Set style for dialog *//
const StatusInput = ({ label, options, value, onChange }) => {
  return (
    <label className="font-bold text-blue-400 drop-shadow-md flex items-center gap-2">
      {label}
      <Autocomplete
        size="small"
        options={options}
        getOptionLabel={(option) => option}
        value={value}
        onChange={onChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label=""
            InputProps={{
              ...params.InputProps,
              style: {
                backgroundColor:
                  value === "Yes" ||
                  value === "Normal" ||
                  value === "Kastersky" ||
                  value === "Symantec" ||
                  value === "Trend Micro"
                    ? "#bbf7d0"
                    : "#fef08a",
              },
            }}
          />
        )}
        sx={{
          width: 220,
          mt: 1,
          mb: 1,
          marginLeft: "auto",
        }}
        renderOption={(props, option) => {
          const backgroundColor =
            option === "Yes" ||
            option === "Normal" ||
            option === "Kastersky" ||
            option === "Symantec" ||
            option === "Trend Micro"
              ? "#bbf7d0"
              : "#fef08a";

          return (
            <li {...props} style={{ backgroundColor }}>
              {option}
            </li>
          );
        }}
      />
    </label>
  );
};

//* Main component *//
export default function ComputerInProcess() {
  // useEffect(() => {
  //   // Display the SweetAlert when the component is mounted
  //   Swal.fire({
  //     title: "Please Search Area",
  //     icon: "info",
  //     text: "Select and Search before editing data",
  //     confirmButtonText: "OK",
  //   });
  // }, []);

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

          // const macAddresses = Array.from(
          //   new Set(res.data.map((item) => item.mac_address))
          // );
          // setMacAddressOption(macAddresses);

          const idCodes = Array.from(
            new Set(res.data.map((item) => item.employee_id))
          );
          setIdCodeOption(idCodes);

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
    {
      field: "factory_emp",
      headerName: "Factory",
      width: 60,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "pc_name",
      headerName: "PC Name",
      width: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "pc_type",
      headerName: "PC Type",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "os",
      headerName: "OS",
      width: 70,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "pc_use_for",
      headerName: "PC Use For",
      width: 110,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "building",
      headerName: "Building",
      width: 80,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "process",
      headerName: "Process",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "area",
      headerName: "Area",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "employee_id",
      headerName: "User ID Code",
      width: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "emp_name_eng",
      headerName: "Name - Surname",
      width: 340,
      headerAlign: "center",
    },
    {
      field: "job_level",
      headerName: "Job Level",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "connect_status",
      headerName: "Status Connect",
      width: 160,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div
          style={{
            borderRadius: 10,
            padding: "4px 12px",
            color: params.value === "Network Connected" ? "white" : "black",
            backgroundColor:
              params.value === "Network Connected"
                ? "rgb(34 197 94)"
                : "rgb(234 179 8)",
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "cost_center_code",
      headerName: "Cost Center",
      width: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 80,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (userRoleNo === 1 || userRoleNo === 2 || userRoleNo === 5) {
          return (
            <Button variant="contained" onClick={() => handleOpen(params.row)}>
              <EditIcon />
            </Button>
          );
        } else if (userRoleNo === 3 && userIdCode === params.row.employee_id) {
          // Users with role 1 can only edit rows where their userIdCode matches the row's employee_id
          return (
            <Button variant="contained" onClick={() => handleOpen(params.row)}>
              <EditIcon />
            </Button>
          );
        } else if (userRoleNo === 4) {
          return (
            <Button disabled>
              <EditIcon />
            </Button>
          );
        } else {
          return (
            <Button disabled>
              <EditIcon />
            </Button>
          );
        }
      },
    },
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
  // const [selectedDataRow, setSelectedDataRow] = useState({});

  const handleOpen = (data) => {
    const selectedID = data.id;
    localStorage.setItem("selectedID", selectedID);
    setSelectedData(data);
    // localStorage.setItem("selectedDataRow", JSON.stringify(data));
    // setSelectedDataRow(data);

    setPcName(data["pc_name"]);
    setPcType(data["pc_type"]);
    setOs(data["os"]);
    setOsVersion(data["os_version"]);
    setStartDate(data["update_datetime"]);
    setMacAddress(data["mac_address"]);
    setIpAddress(data["new_ip"]);
    setConnectType(data["connect_type"]);
    setJoinDomain(data["join_domain_status"]);
    setJoinDomainDate(data["join_domain_date"]);

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

    setMfgPro(data["mfgpro_btp_fpc"]);
    setBtp(data["btp_only"]);
    setFpc(data["fpc_only"]);
    setHumatrix(data["humatrix"]);
    setZwcad(data["zwcad"]);
    setA1Server(data["a1_server"]);
    setEWorking(data["internet"]);
    setInternet(data["internet"]);

    setAntivirus(data["antivirus"]);
    setAntivirusStatus(data["antivirus_status"]);
    setEdrStatus(data["edr_status"]);

    setOpen(true);
  };

  //*Monitor selected ID after handleOpen *//
  let selectedID = localStorage.getItem("selectedID");
  let selectedComputerName = rows.find((row) => row.id === selectedID)?.pc_name;

  // console.log("Selected Data Row:", selectedDataRow);
  // console.log("Selected Data Row ID Code:", selectedDataRow.employee_id);

  //* Get user for update by data*//
  const userLoginInfo =
    localStorage.getItem("guestToken") || localStorage.getItem("userToken");
  const userLoginInfoJSON = userLoginInfo ? JSON.parse(userLoginInfo) : null;
  const userLogin = userLoginInfoJSON ? userLoginInfoJSON.user_login : null;
  // const userName = userLoginInfoJSON ? userLoginInfoJSON.user_name : null;
  // const userSurname = userLoginInfoJSON ? userLoginInfoJSON.user_surname : null;

  //* Get user role no *//
  const userRoleNo = userLoginInfoJSON.role_no;

  //* Get user id code *//
  let userIdCode = userLoginInfoJSON.user_id_code;
  let selectedDataIdCode = rows.find(
    (row) => row.id === selectedID
  )?.employee_id;

  // console.log("User Login:", userLoginInfo);
  console.log(
    `User Login: ${userLogin},
    User Role No: ${userRoleNo},
    Local Row ID Selected: ${selectedID},
    Selected Computer Name: ${selectedComputerName},
    Selected Data ID Code: ${selectedDataIdCode}`
  );

  const handleClose = () => {
    setOpen(false);
  };

  //*Update Date Time *//
  const updateDateTime = new Date(new Date().getTime() + 7 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  console.log("Update Date Time:", updateDateTime);

  //*Update Permission *//
  const handlePermissionUpdate = () => {
    axios
      .get(
        `http://10.17.66.242:3001/api/smart_recovery/update-data-computer-permission?pc_name=${pcName}&new_ip=${ipAddress}&mfgpro_btp_fpc=${mfgPro}&btp_only=${btp}&fpc_only=${fpc}&humatrix=${humatrix}&zwcad=${zwcad}&a1_server=${a1Server}&e_working=${eWorking}&internet=${internet}`
      )
      .then((secondRes) => {
        console.log("Permission Update Success:", secondRes.data);
      })
      .catch((secondError) => {
        console.error("Permission Update Error:", secondError);
      });

    fetchData();
  };

  const handleSave = () => {
    // const updateByInfo = `${userLogin} ${userName} ${userSurname}`;

    const editedData = {
      id: selectedData.id,
      selectedComputerName,
      pcName,
      pcType,
      os,
      osVersion,
      startDate,
      macAddress,
      ipAddress,
      connectType,
      joinDomain,
      joinDomainDate,

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

      mfgPro,
      btp,
      fpc,
      humatrix,
      zwcad,
      a1Server,
      eWorking,
      internet,

      antivirus,
      antivirusStatus,
      edrStatus,

      updateBy: userLogin,
      updateDateTime,
    };

    console.log("Edited Data:", editedData);

    handleClose();

    Swal.fire({
      title: "Are you sure?",
      text: "Please check the data before saving",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Save",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .get(
            `http://10.17.66.242:3001/api/smart_recovery/update-data-computer-master?row_id=${selectedData.id}&pc_name=${pcName}&pc_type=${pcType}&os=${os}&os_version=${osVersion}&mac_address=${macAddress}&pc_use_for=${pcUseFor}&employee_id=${idCode}&cost_center_code=${costCenter}&building=${building}&area=${area}&update_by=${userLogin}&antivirus=${antivirus}&antivirus_status=${antivirusStatus}&edr_status=${edrStatus}&update_datetime=${updateDateTime}`
          )
          .then((res) => {
            handlePermissionUpdate();

            console.log("Success:", res.data);
          });

        Swal.fire({
          icon: "success",
          title: "Save Success",
          text: "Save data to the database successfully",
          confirmButtonText: "OK",
        });

        fetchData();
      }
    });
  };

  //*Edit *//

  //state for edit data
  const [pcName, setPcName] = useState("");
  const [pcType, setPcType] = useState("");
  const [os, setOs] = useState("");
  const [osVersion, setOsVersion] = useState("");
  const [startDate, setStartDate] = useState("");
  const [macAddress, setMacAddress] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [connectType, setConnectType] = useState("");
  const [joinDomain, setJoinDomain] = useState("");
  const [joinDomainDate, setJoinDomainDate] = useState("");

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

  const [mfgPro, setMfgPro] = useState("");
  const [btp, setBtp] = useState("");
  const [fpc, setFpc] = useState("");
  const [humatrix, setHumatrix] = useState("");
  const [zwcad, setZwcad] = useState("");
  const [a1Server, setA1Server] = useState("");
  const [eWorking, setEWorking] = useState("");
  const [internet, setInternet] = useState("");

  const [antivirus, setAntivirus] = useState("");
  const [antivirusStatus, setAntivirusStatus] = useState("");
  const [edrStatus, setEdrStatus] = useState("");

  //*Option *//
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

  // const startDateOption = ["2021-10-01", "2021-10-02"];
  // const [macAddressOption, setMacAddressOption] = useState([]);
  // const [ipAddressOption, setIpAddressOption] = useState([]);
  // const connectTypeOption = [
  //   "LAN (WAN)",
  //   "WIFI (PRD_SCAN)",
  //   "WIFI (PRD_OFFICE)",
  // ];

  //User Data
  const pcUseForOption = [
    "Personal",
    "Machine",
    "Scan WIP",
    "CCTV",
    "Scrap",
    "Center",
    "Server",
    "Resign",
  ];
  const [idCodeOption, setIdCodeOption] = useState([]);
  // const [nameSurnameOption, setNameSurnameOption] = useState([]);
  // const [emailOption, setEmailOption] = useState([]);
  // const [jobLevelOption, setJobLevelOption] = useState([]);
  // const [divisionOption, setDivisionOption] = useState([]);
  // const [departmentOption, setDepartmentOption] = useState([]);
  // const [managerOption, setManagerOption] = useState([]);
  const [costCenterOption, setCostCenterOption] = useState([]);
  const buildingOption = ["A", "B", "C", "C1", "C2", "C2 2F", "C3", "D"];
  const [areaOption, setAreaOption] = useState([]);

  //Permission Data
  // const mfgProOption = ["Yes", "No"];
  // const btpOption = ["Yes", "No"];
  // const fpcOption = ["Yes", "No"];
  // const humatrixOption = ["Yes", "No"];
  // const zwcadOption = ["Yes", "No"];
  // const a1ServerOption = ["Yes", "No"];
  // const eWorkingOption = ["Yes", "No"];
  // const internetOption = ["Yes", "No"];

  //Security Data
  // const antivirusOption = ["Kastersky", "Symantec", "Trend Micro", "McAfee"];
  // const antivirusStatusOption = ["Normal", "Abnormal"];
  // const edrStatusOption = ["Normal", "Abnormal"];

  //*Handle Change Background Color For Option Inuput*//
  const [mfgProColor, setMfgProColor] = useState("");
  const [btpColor, setBtpColor] = useState("");
  const [fpcColor, setFpcColor] = useState("");
  const [humatrixColor, setHumatrixColor] = useState("");
  const [zwcadColor, setZwcadColor] = useState("");
  const [a1ServerColor, setA1ServerColor] = useState("");
  const [eWorkingColor, setEWorkingColor] = useState("");
  const [internetColor, setInternetColor] = useState("");

  // const [antivirusColor, setAntivirusColor] = useState("");
  // const [antivirusStatusColor, setAntivirusStatusColor] = useState("");
  // const [edrStatusColor, setEdrStatusColor] = useState("");

  //*Responsive for Navbar *//
  const [isNavbarOpen, setIsNavbarOpen] = React.useState(false);

  const handleNavbarToggle = (openStatus) => {
    setIsNavbarOpen(openStatus);
  };

  //*Total PC *//
  const [pcStatus, setPcStatus] = useState([]);

  useEffect(() => {
    const fetchDataPC = async () => {
      const response = await axios.get(
        `http://10.17.66.242:3001/api/smart_recovery/filter-data-count-status?division=${selecteddivision}&department=${selectedDepartment}&cost_center=${selectedCostCenter}`
      );
      const data = response.data;

      const statusData = {
        total_pc: 0,
        pc_connect: 0,
        wait_connect: 0,
      };

      data.map((item) => {
        statusData.total_pc = item.total_pc;
        statusData.pc_connect = item.pc_connect;
        statusData.wait_connect = item.wait_connect;
      });

      // console.log("Status Data:", statusData);

      setPcStatus(statusData);
    };

    fetchDataPC();
  }, [selecteddivision, selectedDepartment, selectedCostCenter]);

  //*Charts *//

  //*Use For Chart *//
  const BarChartUseFor = () => {
    const [useForData, setUseForData] = useState({});

    useEffect(() => {
      const fetchDataUseForChart = async () => {
        const response = await axios.get(
          `http://10.17.66.242:3001/api/smart_recovery/filter-data-count-chart-pc-use-for?division=${selecteddivision}&department=${selectedDepartment}&cost_center=${selectedCostCenter}`
        );

        let data = response.data;

        // console.log("Data:", data);

        const useForData = {
          Center: 0,
          Personal: 0,
          Resign: 0,
        };

        data.forEach((item) => {
          useForData[item.pc_use_for] = item.count_pc_use_for;
        });

        // console.log("Use For Data:", useForData);

        setUseForData(useForData);
      };

      fetchDataUseForChart();
    }, [selecteddivision, selectedDepartment, selectedCostCenter]);

    const state = {
      series: [
        {
          name: "Center",
          data: [useForData.Center],
        },
        {
          name: "Personal",
          data: [useForData.Personal],
        },
        {
          name: "Resign",
          data: [useForData.Resign],
        },
        {
          name: "Machine",
          data: [useForData.Machine],
        },
        {
          name: "Scan WIP",
          data: [useForData.Scan],
        },
        {
          name: "CCTV",
          data: [useForData.Cctv],
        },
        {
          name: "Scrap",
          data: [useForData.Scrap],
        },
        {
          name: "Server",
          data: [useForData.Server],
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

  //*Building Chart *//
  const BarChartBuilding = () => {
    const [buildingData, setBuildingData] = useState({});

    useEffect(() => {
      const fetchDataBuildingChart = async () => {
        const response = await axios.get(
          `http://10.17.66.242:3001/api/smart_recovery/filter-data-count-chart-building?division=${selecteddivision}&department=${selectedDepartment}&cost_center=${selectedCostCenter}`
        );

        let data = response.data;

        // console.log("Building Data:", data);

        const buildingData = {
          A: 0,
          B: 0,
          C: 0,
          C1: 0,
          C2: 0,
          C2_2F: 0,
          C3: 0,
          D: 0,
        };

        data.map((item) => {
          buildingData[item.building] = item.count_building;
        });

        // console.log("Building Data:", buildingData);

        setBuildingData(buildingData);
      };

      fetchDataBuildingChart();
    }, [selecteddivision, selectedDepartment, selectedCostCenter]);

    const state = {
      series: [
        {
          name: "A",
          data: [buildingData.A],
        },
        {
          name: "B",
          data: [buildingData.B],
        },
        {
          name: "C",
          data: [buildingData.C],
        },
        {
          name: "C1",
          data: [buildingData.C1],
        },
        {
          name: "C2",
          data: [buildingData.C2],
        },
        {
          name: "C2 2F",
          data: [buildingData.C2_2F],
        },
        {
          name: "C3",
          data: [buildingData.C3],
        },
        {
          name: "D",
          data: [buildingData.D],
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

  //*Join Domain Chart *//
  const DonutChartJoinDomain = () => {
    const [chartOptions, setChartOptions] = useState({});
    const [chartSeries, setChartSeries] = useState([]);
    const [dataFetched, setDataFetched] = useState(false); // Track if data is fetched

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `http://10.17.66.242:3001/api/smart_recovery/filter-data-count-chart-join-domain?division=${selecteddivision}&department=${selectedDepartment}&cost_center=${selectedCostCenter}`
          );
          const data = response.data;

          if (data && data.length > 0) {
            // Data is available, prepare chart options and series
            const sortedData = [...data].sort(
              (a, b) => a.count_join_domain - b.count_join_domain
            );
            const labels = sortedData.map((item) => item.join_domain_status);
            const values = sortedData.map((item) =>
              parseInt(item.count_join_domain)
            );

            setChartOptions({
              chart: {
                id: "donut-chart",
                toolbar: {
                  show: true,
                },
              },
              labels,
              legend: {
                position: "right",
              },
              dataLabels: {
                enabled: true,
              },

              colors: [" #22c55e ", " #eab308 "],
            });

            setChartSeries(values);
            setDataFetched(true); // Set dataFetched to true when data is fetched
          } else {
            setChartOptions({});
            setChartSeries([]);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }, []);

    return (
      <div>
        {dataFetched ? ( // Conditionally render the chart when data is fetched
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="donut"
            width={350}
            height={150}
          />
        ) : (
          <div className="flex flex-col justify-center items-center h-48 mx-8 lg:mx-24">
            <CircularProgress color="success" />
            <span className=" text-yellow-600 text-md font-bold mt-4 whitespace-nowrap">
              Waiting for Search
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Navbar onToggle={handleNavbarToggle} />
      <ThemeProvider theme={theme}>
        <div className="container mx-16 mt-24 w-screen">
          <Box
            marginLeft={isNavbarOpen ? "220px" : 4}
            marginTop={8}
            className={`transition-all duration-500 ease-in-out ${
              isNavbarOpen ? "ml-64" : ""
            }`}
          >
            {/* //Chart Group */}

            <div className="flex flex-col lg:flex-row gap-4">
              <div className="container flex gap-4 w-fit h-48">
                <div className="col-span-1 w-52 hover:translate-x-1 hover:-translate-y-1 transition duration-300 ease-in-out cursor-pointer">
                  <div className="bg-blue-500 rounded-lg p-4 shadow-lg hover:bg-blue-600 transition-colors ease-linear duration-300 hover:shadow-none">
                    <p className="text-slate-50 text-xl font-bold">Total PC</p>
                    <div className="bg-slate-50 rounded-lg p-4 mt-9 h-16">
                      <p className="text-blue-700 text-3xl font-bold">
                        {pcStatus.total_pc}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-span-1 w-52 hover:translate-x-1 hover:-translate-y-1 transition duration-300 ease-in-out cursor-pointer">
                  <div className="bg-green-500 rounded-lg p-4 shadow-lg hover:bg-green-600 transition-colors ease-linear duration-300 hover:shadow-none">
                    <p className="text-slate-50 text-xl font-bold">
                      PC Connect
                    </p>
                    <div className="bg-slate-50 rounded-lg p-4 mt-9 h-16">
                      <p className="text-green-700 text-3xl font-bold">
                        {pcStatus.pc_connect !== null ? pcStatus.pc_connect : 0}{" "}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-span-1 w-52 hover:translate-x-1 hover:-translate-y-1 transition duration-300 ease-in-out cursor-pointer">
                  <div className="bg-yellow-500 rounded-lg p-4 shadow-lg hover:bg-yellow-600 transition-colors ease-linear duration-300 hover:shadow-none">
                    <p className="text-slate-50 text-xl font-bold">
                      Wait Connect
                    </p>
                    <div className="bg-slate-50 rounded-lg p-4 mt-9 h-16">
                      <p className="text-yellow-700 text-3xl font-bold">
                        {pcStatus.wait_connect !== null
                          ? pcStatus.wait_connect
                          : 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col w-screen lg:w-1/3 lg:flex-row">
                <div className="container flex h-48">
                  <div className="bg-slate-50 rounded-lg mb-8 mr-4 shadow-lg text-left w-52 lg:w-full overflow-hidden lg:overflow-visible ">
                    <BarChartUseFor />
                  </div>
                  <div className="bg-slate-50 rounded-lg mb-8 mr-4 shadow-lg text-left w-52 lg:w-full overflow-hidden lg:overflow-visible ">
                    <BarChartBuilding />
                  </div>
                  <div className="bg-slate-50 rounded-lg mb-8 mr-4 shadow-lg text-left w-52 lg:w-full overflow-hidden lg:overflow-visible flex items-center">
                    <DonutChartJoinDomain />
                  </div>
                </div>
              </div>
            </div>

            {/* //Search Group */}

            <div className="mb-60 lg:mb-6">
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
                width: isNavbarOpen ? "calc(95vw - 10vw)" : "90vw",
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
                <DialogContent>
                  <div className="flex flex-row">
                    <div className="computer-data">
                      <div className="bg-white p-4 rounded-2xl mx-2 mt-2 shadow-md h-full">
                        <p className="flex font-bold text-lg mb-6 justify-center underline decoration-sky-500 drop-shadow-md">
                          Computer Data
                        </p>
                        <label className="font-bold text-blue-400 drop-shadow-md flex items-center gap-2">
                          PC Name
                          <Autocomplete
                            disablePortal
                            size="small"
                            id="pc-name-autocomplete"
                            options={pcNameOption}
                            getOptionLabel={(option) => option}
                            defaultValue={selectedData.pc_name}
                            renderInput={(params) => (
                              <TextField {...params} label="" />
                            )}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                              backgroundColor: " #cffafe ",
                            }}
                            onChange={(event, newValue) => setPcName(newValue)}
                          />
                        </label>
                        <label className="font-bold text-blue-400 drop-shadow-md flex items-center gap-2">
                          PC Type
                          <Autocomplete
                            disablePortal
                            size="small"
                            id="pc-type-autocomplete"
                            options={pcTypeOption}
                            getOptionLabel={(option) => option}
                            defaultValue={selectedData.pc_type}
                            renderInput={(params) => (
                              <TextField {...params} label="" />
                            )}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                              backgroundColor: " #cffafe ",
                            }}
                            onChange={(event, newValue) => setPcType(newValue)}
                          />
                        </label>
                        <label className="font-bold text-blue-400 drop-shadow-md flex items-center gap-2">
                          OS
                          <Autocomplete
                            disablePortal
                            size="small"
                            id="os-autocomplete"
                            options={osOption}
                            getOptionLabel={(option) => option}
                            defaultValue={selectedData.os}
                            renderInput={(params) => (
                              <TextField {...params} label="" />
                            )}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                              backgroundColor: " #cffafe ",
                            }}
                            onChange={(event, newValue) => setOs(newValue)}
                          />
                        </label>
                        <label className="font-bold text-blue-400 drop-shadow-md flex items-center gap-2">
                          OS Version
                          <Autocomplete
                            disablePortal
                            size="small"
                            id="os-version-autocomplete"
                            options={osVersionOption}
                            getOptionLabel={(option) => option}
                            defaultValue={selectedData.os_version}
                            renderInput={(params) => (
                              <TextField {...params} label="" />
                            )}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                              backgroundColor: " #cffafe ",
                            }}
                            onChange={(event, newValue) =>
                              setOsVersion(newValue)
                            }
                          />
                        </label>
                        <label className="font-bold text-blue-400 drop-shadow-md flex items-center gap-2">
                          Start Date
                          <TextField
                            disabled
                            size="small"
                            id="outlined-disabled"
                            defaultValue={new Date(
                              selectedData.update_datetime
                            ).toLocaleDateString("en-CA")}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-400 drop-shadow-md flex items-center gap-2">
                          MAC Address
                          <TextField
                            size="small"
                            id="mac-address-textfield"
                            defaultValue={selectedData.mac_address}
                            label=""
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                              backgroundColor: " #cffafe ",
                            }}
                            onChange={(event) =>
                              setMacAddress(event.target.value)
                            }
                          />
                        </label>
                        <label className="font-bold text-blue-400 drop-shadow-md flex items-center gap-2">
                          IP Address
                          <TextField
                            disabled
                            size="small"
                            id="outlined-disabled"
                            defaultValue={selectedData.new_ip}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-400 drop-shadow-md flex items-center gap-2">
                          Connect Type
                          <TextField
                            disabled
                            size="small"
                            id="outlined-disabled"
                            defaultValue={selectedData.connect_type}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-400 drop-shadow-md flex items-center gap-2">
                          Join Domain
                          <TextField
                            disabled
                            size="small"
                            id="outlined-disabled"
                            defaultValue={selectedData.join_domain_status}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-400 drop-shadow-md flex items-center gap-2">
                          Join Domain Date
                          <TextField
                            disabled
                            size="small"
                            id="outlined-disabled"
                            defaultValue={selectedData.join_domain_date}
                            sx={{
                              width: 220,
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
                      <div className="bg-white p-4 rounded-2xl mx-2 mt-2 shadow-md h-full">
                        <p className="flex font-bold text-lg mb-6 justify-center underline decoration-pink-500 drop-shadow-md">
                          User Data
                        </p>
                        <label className="font-bold text-blue-400 drop-shadow-md flex items-center gap-2">
                          PC Use For
                          <Autocomplete
                            disablePortal
                            size="small"
                            id="pc-use-for-autocomplete"
                            options={pcUseForOption}
                            getOptionLabel={(option) => option}
                            defaultValue={selectedData.pc_use_for}
                            renderInput={(params) => (
                              <TextField {...params} label="" />
                            )}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                              backgroundColor: " #cffafe ",
                            }}
                            onChange={(event, newValue) =>
                              setPcUseFor(newValue)
                            }
                          />
                        </label>
                        <label className="font-bold text-blue-400 drop-shadow-md flex items-center gap-2">
                          ID Code
                          <Autocomplete
                            disablePortal
                            size="small"
                            id="id-code-autocomplete"
                            options={idCodeOption}
                            getOptionLabel={(option) => option}
                            defaultValue={selectedData.employee_id}
                            renderInput={(params) => (
                              <TextField {...params} label="" />
                            )}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                              backgroundColor: " #cffafe ",
                            }}
                            onChange={(event, newValue) => setIdCode(newValue)}
                          />
                        </label>
                        <label className="font-bold text-blue-400 drop-shadow-md flex items-center gap-2">
                          Name - Surname
                          <TextField
                            disabled
                            size="small"
                            id="outlined-disabled"
                            defaultValue={selectedData.emp_name_eng}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                          />
                        </label>

                        <label className="font-bold text-blue-400 drop-shadow-md flex items-center gap-2">
                          Email
                          <TextField
                            disabled
                            size="small"
                            id="outlined-disabled"
                            defaultValue={selectedData.user_email}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-400 drop-shadow-md flex items-center gap-2">
                          Job Level
                          <TextField
                            disabled
                            size="small"
                            id="outlined-disabled"
                            defaultValue={selectedData.job_level}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-400 drop-shadow-md flex items-center gap-2">
                          Division
                          <TextField
                            disabled
                            size="small"
                            id="outlined-disabled"
                            defaultValue={selectedData.division}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-400 drop-shadow-md flex items-center gap-2">
                          Department
                          <TextField
                            disabled
                            size="small"
                            id="outlined-disabled"
                            defaultValue={selectedData.department_unit}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-400 drop-shadow-md flex items-center gap-2">
                          Manager
                          <TextField
                            disabled
                            size="small"
                            id="outlined-disabled"
                            defaultValue={selectedData.supervision_name}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                            }}
                          />
                        </label>
                        <label className="font-bold text-blue-400 drop-shadow-md flex items-center gap-2">
                          Cost Center
                          <Autocomplete
                            disablePortal
                            size="small"
                            id="cost-center-autocomplete"
                            options={costCenterOption}
                            getOptionLabel={(option) => option}
                            defaultValue={selectedData.cost_center_code}
                            renderInput={(params) => (
                              <TextField {...params} label="" />
                            )}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                              backgroundColor: " #cffafe ",
                            }}
                            onChange={(event, newValue) =>
                              setCostCenter(newValue)
                            }
                          />
                        </label>
                        <label className="font-bold text-blue-400 drop-shadow-md flex items-center gap-2">
                          Building
                          <Autocomplete
                            disablePortal
                            size="small"
                            id="building-autocomplete"
                            options={buildingOption}
                            getOptionLabel={(option) => option}
                            defaultValue={selectedData.building}
                            renderInput={(params) => (
                              <TextField {...params} label="" />
                            )}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                              backgroundColor: " #cffafe ",
                            }}
                            onChange={handleBuildingChange}
                          />
                        </label>
                        <label className="font-bold text-blue-400 drop-shadow-md flex items-center gap-2">
                          Area
                          <Autocomplete
                            disablePortal
                            size="small"
                            id="area-autocomplete"
                            options={areaOption}
                            getOptionLabel={(option) => option}
                            defaultValue={selectedData.area}
                            renderInput={(params) => (
                              <TextField {...params} label="" />
                            )}
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                              backgroundColor: " #cffafe ",
                            }}
                            onChange={(event, newValue) => setArea(newValue)}
                          />
                        </label>
                      </div>
                    </div>

                    {/* //*permission Data */}

                    <div className="permission-data">
                      <div className="bg-white p-4 rounded-2xl mx-2 mt-2 shadow-md h-full">
                        <p className="flex font-bold text-lg mb-6 justify-center underline decoration-green-500 drop-shadow-md">
                          Permission Data
                        </p>
                        <StatusInput
                          label="MFG Pro"
                          value={mfgPro}
                          options={["Yes", "No"]}
                          onChange={(event, newValue) => setMfgPro(newValue)}
                          color={mfgProColor}
                          setColor={setMfgProColor}
                        />

                        <StatusInput
                          label="BTP"
                          value={btp}
                          options={["Yes", "No"]}
                          onChange={(event, newValue) => setBtp(newValue)}
                          color={btpColor}
                          setColor={setBtpColor}
                        />

                        <StatusInput
                          label="FPC"
                          value={fpc}
                          options={["Yes", "No"]}
                          onChange={(event, newValue) => setFpc(newValue)}
                          color={fpcColor}
                          setColor={setFpcColor}
                        />

                        <StatusInput
                          label="Humatrix"
                          value={humatrix}
                          options={["Yes", "No"]}
                          onChange={(event, newValue) => setHumatrix(newValue)}
                          color={humatrixColor}
                          setColor={setHumatrixColor}
                        />

                        <StatusInput
                          label="ZWCAD"
                          value={zwcad}
                          options={["Yes", "No"]}
                          onChange={(event, newValue) => setZwcad(newValue)}
                          color={zwcadColor}
                          setColor={setZwcadColor}
                        />

                        <StatusInput
                          label="A1 Server"
                          value={a1Server}
                          options={["Yes", "No"]}
                          onChange={(event, newValue) => setA1Server(newValue)}
                          color={a1ServerColor}
                          setColor={setA1ServerColor}
                        />

                        <StatusInput
                          label="E-Working"
                          value={eWorking}
                          options={["Yes", "No"]}
                          onChange={(event, newValue) => setEWorking(newValue)}
                          color={eWorkingColor}
                          setColor={setEWorkingColor}
                        />

                        <StatusInput
                          label="Internet"
                          value={internet}
                          options={["Yes", "No"]}
                          onChange={(event, newValue) => setInternet(newValue)}
                          color={internetColor}
                          setColor={setInternetColor}
                        />
                      </div>
                    </div>

                    {/* //*Security Data */}

                    <div className="security-data">
                      <div className="bg-white p-4 rounded-2xl mx-2 mt-2 shadow-md h-full">
                        <p className="flex font-bold text-lg mb-6 justify-center underline decoration-orange-500 drop-shadow-md">
                          Security Data
                        </p>
                        <StatusInput
                          label="Antivirus"
                          options={["Kastersky", "Symantec", "Trend Micro"]}
                          value={antivirus}
                          onChange={(event, newValue) => setAntivirus(newValue)}
                        />

                        <StatusInput
                          label="Antivirus Status"
                          options={["Normal", "Abnormal"]}
                          value={antivirusStatus}
                          onChange={(event, newValue) =>
                            setAntivirusStatus(newValue)
                          }
                        />
                        <StatusInput
                          label="EDR Status"
                          options={["Normal", "Abnormal"]}
                          value={edrStatus}
                          onChange={(event, newValue) => setEdrStatus(newValue)}
                        />
                      </div>
                    </div>
                  </div>
                </DialogContent>
                <DialogActions>
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded hover:scale-105 transform transition-all duration-300 active:bg-green-600 active:scale-95"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded hover:scale-105 transform transition-all duration-300 active:bg-red-600 active:scale-95"
                    onClick={handleClose}
                  >
                    Cancel
                  </button>
                </DialogActions>
              </Dialog>
            )}
          </Box>
        </div>
      </ThemeProvider>
    </>
  );
}
