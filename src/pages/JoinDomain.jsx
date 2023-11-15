import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactApexChart from "react-apexcharts";
import Chart from "react-apexcharts";
import CircularProgress from "@mui/material/CircularProgress";
import Swal from "sweetalert2";

//* Components
import Navbar from "../components/Navbar/Navbar";
import JoinDomainSearch from "../components/searchgroup/JoinDomainSearch";
import CountUsageJD from "../components/catchcount/CountUsageJD";

//* MUI
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { GridToolbar } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import dayjs from "dayjs";

//* Styled Data Grid
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
  "& ::-webkit-scrollbar": {
    width: "8px",
    height: "8px",
  },
  "& ::-webkit-scrollbar-track": {
    backgroundColor: "#ffffff",
  },
  "& ::-webkit-scrollbar-thumb": {
    borderRadius: "4px",

    backgroundColor: "#3b82f6",
  },
});

//*Set style for dialog
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
                  value === "Trend Micro" ||
                  value === "Finished" ||
                  value === "Joined"
                    ? "#bbf7d0"
                    : value === "Problem"
                    ? "#e84548"
                    : "#fef08a",

                color: value === "Problem" ? "white" : "black",
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
            option === "Trend Micro" ||
            option === "Finished" ||
            option === "Joined"
              ? "#bbf7d0"
              : option === "Problem"
              ? "#e84548"
              : "#fef08a";

          const color = option === "Problem" ? "white" : "black";
          return (
            <li {...props} style={{ backgroundColor, color }}>
              {option}
            </li>
          );
        }}
      />
    </label>
  );
};

function JoinDomain() {
  //* Responsive Navbar
  const [isNavbarOpen, setIsNavbarOpen] = React.useState(false);

  const handleNavbarToggle = (openStatus) => {
    setIsNavbarOpen(openStatus);
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

  //*Filter Date Range
  const [fromDateFilter, setFromDateFilter] = useState("");
  const [toDateFilter, setToDateFilter] = useState("");

  console.log("From Date Filter:", fromDateFilter);
  console.log("To Date Filter:", toDateFilter);

  //*Monitor selected ID after handleOpen *//

  let selectedID = localStorage.getItem("selectedID");
  // let selectedComputerName = rows.find((row) => row.id === selectedID)?.pc_name;

  //* Get user for update by data*//
  const userLoginInfo =
    localStorage.getItem("guestToken") || localStorage.getItem("userToken");
  const userLoginInfoJSON = userLoginInfo ? JSON.parse(userLoginInfo) : null;
  const userLogin = userLoginInfoJSON ? userLoginInfoJSON.user_login : null;
  //? Get user role no *//
  const userRoleNo = userLoginInfoJSON.role_no;
  //? Get user id code *//
  let userIdCode = userLoginInfoJSON.user_id_code;

  console.log(
    `User Login: ${userLogin},
    User Role No: ${userRoleNo},
    Local Row ID Selected: ${selectedID},
    User ID Code: ${userIdCode}`
  );

  //*Dialog

  const updateDateTime = new Date(new Date().getTime() + 7 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  console.log("Update Date Time:", updateDateTime);

  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState({});

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

    setJoinDomainStatus(data["join_domain_status"]);
    setJoinDomainDate(data["join_domain_date"]);
    setJoinDomainTime(data["join_domain_time"]);
    setSeSupportBy(data["join_domain_by"]);

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    // const updateByInfo = `${userLogin} ${userName} ${userSurname}`;

    const editedData = {
      id: selectedData.id,

      pcName,
      pcType,
      os,
      osVersion,
      startDate,
      macAddress,
      ipAddress,
      connectType,

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

      joinDomainStatus,
      joinDomainDate,
      joinDomainTime,
      seSupportBy,
      remark,

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
            `http://10.17.66.242:3001/api/smart_recovery/update-data-computer-master-join-domain?row_id=${selectedData.id}&pc_name=${pcName}&pc_type=${pcType}&os=${os}&os_version=${osVersion}&mac_address=${macAddress}&new_ip=${ipAddress}&connect_type=${connectType}&pc_use_for=${pcUseFor}&employee_id=${idCode}&cost_center_code=${costCenter}&building=${building}&area=${area}&antivirus=${antivirus}&antivirus_status=${antivirusStatus}&edr_status=${edrStatus}&join_domain_status=${joinDomainStatus}&join_domain_date=${joinDomainDate}&join_domain_time=${joinDomainTime}&join_domain_by=${seSupportBy}&remark=${remark}&update_by=${userLogin}&update_datetime=${updateDateTime}
            `
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

  const handlePermissionUpdate = () => {
    axios
      .get(
        `http://10.17.66.242:3001/api/smart_recovery/update-data-computer-permission?pc_name=${pcName}&new_ip=${ipAddress}&mfgpro_btp_fpc=${mfgPro}&btp_only=${btp}&fpc_only=${fpc}&humatrix=${humatrix}&zwcad=${zwcad}&a1_server=${a1Server}&e_working=${eWorking}&internet=${internet}`
      )
      .then((secondRes) => {
        console.log("Permission Update Success:", secondRes.data);
        fetchData();
      })
      .catch((secondError) => {
        console.error("Permission Update Error:", secondError);
      });
  };

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

  //*Filter Model
  const [filterModel, setFilterModel] = React.useState({
    items: [],
    quickFilterExcludeHiddenColumns: true,
    quickFilterValues: [""],
  });

  const sortModel = [
    { field: "join_domain_by", sort: "asc" },
    { field: "join_domain_date", sort: "asc" },
    { field: "join_domain_time", sort: "asc" },
    { field: "building", sort: "asc" },
    { field: "process", sort: "asc" },
  ];

  //* Data Grid
  const columns = [
    {
      field: "id",
      headerName: "No",
      width: 60,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "join_domain_by",
      headerName: "SE Support By",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "join_domain_date",
      headerName: "Plan Date",
      width: 120,
      headerAlign: "center",
    },
    {
      field: "join_domain_time",
      headerName: "Time",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "join_domain_status",
      headerName: "Join Domain Status",
      width: 160,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div
          style={{
            borderRadius: 10,
            padding: "4px 12px",
            width: 90,
            color:
              params.value === "Finished" || params.value === "Problem"
                ? "white"
                : "black",
            backgroundColor:
              params.value === "Finished"
                ? "rgb(34 197 94)"
                : params.value === "Waiting"
                ? "rgb(234 179 8)"
                : "#e84548",
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "owner_comfirm_schedule",
      headerName: "Owner Confirm Schedule",
      width: 200,
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
      field: "pc_use_for",
      headerName: "PC Use For",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "employee_id",
      headerName: "Employee ID",
      width: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "cost_center_code2",
      headerName: "Cost Center",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "user_email",
      headerName: "E-mail",
      width: 260,
      headerAlign: "center",
    },
    {
      field: "new_ip",
      headerName: "New IP",
      width: 110,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "connect_status",
      headerName: "Network Status",
      width: 160,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "os",
      headerName: "OS",
      width: 100,
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
      width: 80,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "person_in_chart",
      headerName: "Person In Chart",
      width: 140,
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
            <button
              className="bg-purple-500 px-2 py-1.5 rounded-xl text-white hover:bg-purple-700 hover:scale-110 duration-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
              onClick={() => handleOpen(params.row)}
            >
              <EditIcon />
            </button>
          );
        } else if (userRoleNo === 3 && userIdCode === params.row.employee_id) {
          // Users with role 1 can only edit rows where their userIdCode matches the row's employee_id
          return (
            <button
              className="bg-purple-500 px-2 py-1.5 rounded-xl text-white hover:bg-purple-700 hover:scale-110 duration-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
              onClick={() => handleOpen(params.row)}
            >
              <EditIcon />
            </button>
          );
        } else if (userRoleNo === 4) {
          return (
            <button className="text-slate-300" disabled>
              <EditIcon />
            </button>
          );
        } else {
          return (
            <button className="text-slate-300" disabled>
              <EditIcon />
            </button>
          );
        }
      },
    },
  ];

  //*Total PC
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

  //*Charts

  //?Use For Chart
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
        width={310}
      />
    );
  };

  //?Building Chart
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
        width={290}
      />
    );
  };

  //?Join Domain Chart
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

              colors: [" #eab308 ", " #22c55e "],
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
            width={300}
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

  //*Table
  const [rows, setRows] = useState([]);
  useEffect(() => {
    const getRows = async () => {
      try {
        const response = await axios.get(
          `http://10.17.66.242:3001/api/smart_recovery/filter-data-computer-list?division=${selecteddivision}&department=${selectedDepartment}&cost_center=${selectedCostCenter}`
        );

        // Check if either fromDateFilter or toDateFilter is not null
        if (fromDateFilter !== null || toDateFilter !== null) {
          const getJoinDomainDate = response.data.map(
            (item) => item.join_domain_date
          );
          console.log("Join Domain Date:", getJoinDomainDate);

          const convertJoinDomainDate = getJoinDomainDate.map((item) =>
            dayjs(item).format("YYYY-MM-DD")
          );
          console.log("Convert Join Domain Date:", convertJoinDomainDate);

          // Filter out null dates
          const validDates = convertJoinDomainDate.filter(
            (date) => date !== null
          );

          const filterJoinDomainDateRange = validDates.filter(
            (item) =>
              item &&
              dayjs(item).isAfter(fromDateFilter) &&
              dayjs(item).isBefore(toDateFilter)
          );
          console.log(
            "Filter Join Domain Date Range:",
            filterJoinDomainDateRange
          );

          // Filter rows based on date range
          const filteredRows = response.data.filter((item) =>
            item.join_domain_date
              ? filterJoinDomainDateRange.includes(
                  dayjs(item.join_domain_date).format("YYYY-MM-DD")
                )
              : false
          );

          // Set filtered rows
          setRows(filteredRows);
        } else {
          // If both fromDateFilter and toDateFilter are null, set rows to the original data
          setRows(response.data);
        }

        console.log("res", response.data);

        // Set other state variables
        const pcNames = Array.from(
          new Set(response.data.map((item) => item.pc_name))
        );
        setPcNameOption(pcNames);

        const osVersions = Array.from(
          new Set(response.data.map((item) => item.os_version))
        );
        setOsVersionOption(osVersions);

        const idCodes = Array.from(
          new Set(response.data.map((item) => item.employee_id))
        );
        setIdCodeOption(idCodes);

        const costCenters = Array.from(
          new Set(response.data.map((item) => item.cost_center_code))
        );
        setCostCenterOption(costCenters);
      } catch (err) {
        console.log(err);
      }
    };

    getRows();
  }, [
    selecteddivision,
    selectedDepartment,
    selectedCostCenter,
    fromDateFilter,
    toDateFilter,
  ]);

  //*Edit *//
  //?state for edit data
  const [pcName, setPcName] = useState("");
  const [pcType, setPcType] = useState("");
  const [os, setOs] = useState("");
  const [osVersion, setOsVersion] = useState("");
  const [startDate, setStartDate] = useState("");
  const [macAddress, setMacAddress] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [connectType, setConnectType] = useState("");

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

  const [joinDomainStatus, setJoinDomainStatus] = useState("");
  const [joinDomainDate, setJoinDomainDate] = useState("");
  const [joinDomainTime, setJoinDomainTime] = useState("");
  const [seSupportBy, setSeSupportBy] = useState("");
  const [remark, setRemark] = useState("");

  //?Filter option for building and area
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

  //?option for edit data
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
  const connectTypeOption = [
    "LAN (WAN)",
    "WIFI (PRD_SCAN)",
    "WIFI (PRD_OFFICE)",
  ];

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

  const [costCenterOption, setCostCenterOption] = useState([]);
  const buildingOption = ["A", "B", "C", "C1", "C2", "C2 2F", "C3", "D"];
  const [areaOption, setAreaOption] = useState([]);

  const joinDomainTimeOption = [
    "08:00-10:00",
    "10:00-12:00",
    "12:00-14:45",
    "14:45-16:45",
  ];
  const seSupportByOption = [
    "Amnart.S",
    "Boonlert.M",
    "Chalermpon.S",
    "Naratip.S",
    "Supharat.D",
    "Theerawat.T",
    "Ukrith.K",
  ];

  //?bg color for edit data
  const [mfgProColor, setMfgProColor] = useState("");
  const [btpColor, setBtpColor] = useState("");
  const [fpcColor, setFpcColor] = useState("");
  const [humatrixColor, setHumatrixColor] = useState("");
  const [zwcadColor, setZwcadColor] = useState("");
  const [a1ServerColor, setA1ServerColor] = useState("");
  const [eWorkingColor, setEWorkingColor] = useState("");
  const [internetColor, setInternetColor] = useState("");

  return (
    <>
      <Navbar onToggle={handleNavbarToggle} />
      <div className="container mt-20 ml-12">
        <Box
          marginLeft={isNavbarOpen ? "210px" : 4}
          marginTop={8}
          className={`transition-all duration-500 ease-in-out ${
            isNavbarOpen ? "ml-64" : ""
          }`}
        >
          {/* //Chart Group */}

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="container flex gap-4 w-fit h-fit">
              <div className="col-span-1 w-52 hover:translate-x-1 hover:-translate-y-1 transition duration-300 ease-in-out cursor-pointer">
                <div className="bg-blue-500 rounded-lg p-4 shadow-lg hover:bg-blue-600 transition-colors ease-linear duration-300 hover:shadow-cyan-100 hover:shadow-xl animate-fade">
                  <p className="text-white text-xl font-bold">Total PC</p>
                  <div className="bg-white rounded-lg p-4 mt-9 h-16">
                    <p className="text-blue-700 text-3xl font-bold">
                      {pcStatus.total_pc}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-span-1 w-52 hover:translate-x-1 hover:-translate-y-1 transition duration-300 ease-in-out cursor-pointer">
                <div className="bg-green-500 rounded-lg p-4 shadow-lg hover:bg-green-600 transition-colors ease-linear duration-300 hover:shadow-lime-100 hover:shadow-xl animate-fade">
                  <p className="text-white text-xl font-bold">PC Connect</p>
                  <div className="bg-white rounded-lg p-4 mt-9 h-16">
                    <p className="text-green-700 text-3xl font-bold">
                      {" "}
                      {pcStatus.pc_connect !== null
                        ? pcStatus.pc_connect
                        : 0}{" "}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-span-1 w-52 hover:translate-x-1 hover:-translate-y-1 transition duration-300 ease-in-out cursor-pointer">
                <div className="bg-yellow-500 rounded-lg p-4 shadow-lg hover:bg-yellow-600 transition-colors ease-linear duration-300 hover:shadow-amber-100 hover:shadow-xl animate-fade">
                  <p className="text-white text-xl font-bold">Wait Connect</p>
                  <div className="bg-white rounded-lg p-4 mt-9 h-16">
                    <p className="text-yellow-700 text-3xl font-bold">
                      {pcStatus.wait_connect !== null
                        ? pcStatus.wait_connect
                        : 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col w-screen lg:w-1/3 lg:flex-row animate-fade">
              <div className="container flex h-48">
                <div className="bg-white rounded-lg mb-8 mr-4 shadow-lg text-left w-52 lg:w-full overflow-hidden lg:overflow-visible">
                  <BarChartUseFor />
                </div>
                <div className="bg-white rounded-lg mb-8 mr-4 shadow-lg text-left w-52 lg:w-full overflow-hidden lg:overflow-visible">
                  <BarChartBuilding />
                </div>
                <div className="bg-white rounded-lg mb-8 mr-4 shadow-lg text-left w-52 lg:w-full overflow-hidden lg:overflow-visible flex items-center">
                  <DonutChartJoinDomain />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-80 lg:mb-6">
            {/* <Computer_In_Process_Search_Group onSearch={onSearch} /> */}
            <JoinDomainSearch
              onSearch={(queryParams) => {
                setSelecteddivision(queryParams.division);
                setSelectedDepartment(queryParams.Department);
                setSelectedCostCenter(queryParams.Cost_center);
                // console.log("Filtering date range:", queryParams);
                setFromDateFilter(queryParams.startDate);
                setToDateFilter(queryParams.endDate);
              }}
            />
          </div>

          {/* Table for Computer in Process */}
          <div
            className="shadow-xl animate-delay"
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
              sortModel={sortModel}
            />
          </div>

          {selectedData && (
            <Dialog open={open} onClose={handleClose} maxWidth="100vw">
              <DialogContent>
                <div className="grid grid-flow-row gap-2 2xl:grid-flow-col 2xl:gap-0">
                  {/* //*Computer Data  */}

                  <div className="computer-data">
                    <div className="bg-white p-4 rounded-2xl mx-2 mt-2 shadow-md h-full">
                      <p className="flex font-bold text-lg mb-6 justify-center underline decoration-sky-500 drop-shadow-md">
                        Computer Data
                      </p>
                      <label className="font-bold text-blue-400 drop-shadow-md flex items-center gap-2">
                        PC Name
                        <Autocomplete
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
                          onChange={(event, newValue) => setOsVersion(newValue)}
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
                          size="small"
                          id="outlined-disabled"
                          defaultValue={selectedData.new_ip}
                          sx={{
                            width: 220,
                            mt: 1,
                            mb: 1,
                            marginLeft: "auto",
                            backgroundColor: " #cffafe ",
                          }}
                        />
                      </label>
                      <label className="font-bold text-blue-400 drop-shadow-md flex items-center gap-2">
                        Connect Type
                        <Autocomplete
                          size="small"
                          id="connect-type-autocomplete"
                          options={connectTypeOption}
                          getOptionLabel={(option) => option}
                          defaultValue={selectedData.connect_type}
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
                            setConnectType(newValue)
                          }
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
                          onChange={(event, newValue) => setPcUseFor(newValue)}
                        />
                      </label>
                      <label className="font-bold text-blue-400 drop-shadow-md flex items-center gap-2">
                        ID Code
                        <Autocomplete
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

                  {/* //*Permission Data */}

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

                  <div className="grid grid-cols-1 gap-4 h-full">
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

                    {/* //*Join Domain Data */}

                    <div className="join-domain-data">
                      <div className="bg-white p-4 rounded-2xl mx-2 mt-2 shadow-md h-full">
                        <p className="flex font-bold text-lg mb-6 justify-center underline decoration-purple-500 drop-shadow-md">
                          Join Domain Data
                        </p>

                        <StatusInput
                          label="Join Domain Status"
                          options={["Waiting", "Problem", "Finished"]}
                          value={joinDomainStatus}
                          onChange={(event, newValue) =>
                            setJoinDomainStatus(newValue)
                          }
                        />

                        <label className="font-bold text-blue-400 drop-shadow-md flex items-center gap-6 mb-2">
                          Join Domain Date
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={["DatePicker"]}>
                              <DatePicker
                                label=""
                                format="YYYY-MM-DD"
                                size="small"
                                sx={{
                                  width: 220,
                                  mt: 1,
                                  mb: 1,
                                  marginLeft: "auto",
                                  backgroundColor: " #cffafe ",
                                }}
                                onChange={(newValue) =>
                                  setJoinDomainDate(
                                    newValue.format("YYYY-MM-DD")
                                  )
                                }
                              />
                            </DemoContainer>
                          </LocalizationProvider>
                        </label>
                        <label className="font-bold text-blue-400 drop-shadow-md flex items-center gap-2">
                          Join Domain Time
                          <Autocomplete
                            size="small"
                            id="join-domain-time-autocomplete"
                            options={joinDomainTimeOption}
                            getOptionLabel={(option) => option}
                            defaultValue={joinDomainTime}
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
                              setJoinDomainTime(newValue)
                            }
                          />
                        </label>
                        <label className="font-bold text-blue-400 drop-shadow-md flex items-center gap-2">
                          SE Support By
                          <Autocomplete
                            size="small"
                            id="se-support-by-autocomplete"
                            options={seSupportByOption}
                            getOptionLabel={(option) => option}
                            defaultValue={seSupportBy}
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
                              setSeSupportBy(newValue)
                            }
                          />
                        </label>
                        <label className="font-bold text-blue-400 drop-shadow-md flex items-center gap-2">
                          Remark
                          <TextField
                            multiline
                            maxRows={3}
                            id="remark"
                            // defaultValue="Remark"
                            sx={{
                              width: 220,
                              mt: 1,
                              mb: 1,
                              marginLeft: "auto",
                              backgroundColor: " #cffafe ",
                            }}
                            placeholder="Remark"
                            onChange={(event) => setRemark(event.target.value)}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
              <DialogActions>
                <button
                  className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded hover:scale-105 transform transition-all duration-300 active:bg-green-600 active:scale-95"
                  onClick={() => {
                    handleSave();
                    CountUsageJD();
                  }}
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
    </>
  );
}

export default JoinDomain;
