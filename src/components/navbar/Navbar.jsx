import * as React from "react"; // นำเข้าโมดูลทั้งหมดที่ต้องการจาก React, ให้เราสามารถใช้งานฟีเจอร์ต่างๆ ของ React
import { styled, useTheme } from "@mui/material/styles"; // นำเข้าโมดูล "styled" และ "useTheme" จาก "@mui/material/styles" สำหรับการใช้งาน Styled Components และเข้าถึง Theme จาก Material-UI
import Box from "@mui/material/Box"; // นำเข้า Box จาก "@mui/material/Box" ซึ่งเป็นคอมโพเนนต์ที่ให้ความสะดวกในการจัดการ layout และ spacing
import MuiDrawer from "@mui/material/Drawer"; // นำเข้า Drawer จาก "@mui/material/Drawer" ซึ่งเป็นคอมโพเนนต์ที่เปิดเมนูแบบเลื่อนได้จากข้าง
import MuiAppBar from "@mui/material/AppBar"; // นำเข้า AppBar จาก "@mui/material/AppBar" ซึ่งเป็นคอมโพเนนต์สำหรับส่วนหัวของหน้าเว็บ
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Fuji from "/Fuji.png";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

//*mui icon ******************************************************
import ComputerIcon from "@mui/icons-material/Computer";
import CableIcon from "@mui/icons-material/Cable";
import StayPrimaryPortraitIcon from "@mui/icons-material/StayPrimaryPortrait";
import MemoryIcon from "@mui/icons-material/Memory";
import DomainIcon from "@mui/icons-material/Domain";

import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import AccountMenu from "./AccountMenu";

const drawerWidth = 240; // กำหนดค่าความกว้างของ Drawer เป็น 240

// สร้าง mixin สำหรับสไตล์ของ Drawer เมื่อถูกเปิด
const openedMixin = (theme) => ({
  // กำหนดความกว้างของ Drawer ให้เท่ากับ drawerWidth ที่กำหนดไว้
  width: drawerWidth,

  // กำหนด transition ของความกว้างของ Drawer เมื่อมันถูกเปิด
  // โดยใช้ฟังก์ชันสร้าง transition ของ theme ที่ได้รับจาก Material-UI
  // และกำหนดค่า easing และ duration ตามที่กำหนดใน theme
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),

  // กำหนด overflowX เป็น "hidden" เพื่อป้องกันการเลื่อนแนวนอน
  // ที่อาจเกิดขึ้นเมื่อความกว้างของ Drawer มากกว่า viewport
  overflowX: "hidden",
});

// สร้าง mixin สำหรับสไตล์ของ Drawer เมื่อถูกปิด
const closedMixin = (theme) => ({
  // ฟังก์ชันที่รับ theme และคืนค่าสไตล์เมื่อ Drawer ปิด
  // กำหนด transition ของความกว้างของ Drawer เมื่อมันถูกปิด
  // โดยใช้ฟังก์ชันสร้าง transition ของ theme ที่ได้รับจาก Material-UI
  // และกำหนดค่า easing และ duration ตามที่กำหนดใน theme
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  // กำหนด overflowX เป็น "hidden" เพื่อป้องกันการเลื่อนแนวนอน
  // ที่อาจเกิดขึ้นเมื่อความกว้างของ Drawer น้อยกว่า viewport
  overflowX: "hidden",
  // กำหนดความกว้างของ Drawer ให้เท่ากับ 7 หน่วยของ theme spacing + 1px
  width: `calc(${theme.spacing(7)} + 1px)`,
  // กำหนดความกว้างของ Drawer ให้เท่ากับ 8 หน่วยของ theme spacing + 1px เมื่อขนาดหน้าจอมากกว่าหรือเท่ากับ sm
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

// สร้างคอมโพเนนต์ styled ชื่อ DrawerHeader
const DrawerHeader = styled("div")(({ theme }) => ({
  // กำหนดให้ DrawerHeader เป็น flex container ที่จัดเรียง item แบบแนวนอน
  display: "flex",
  // กำหนดให้ item ใน DrawerHeader มีการจัดให้อยู่ตรงกลางแนวตั้ง
  alignItems: "center",
  // กำหนดให้ item ใน DrawerHeader มีการจัดให้อยู่ทางด้านขวาแนวนอน
  justifyContent: "flex-end",
  // กำหนด padding ของ DrawerHeader ด้วยฟังก์ชัน spacing ของ theme
  padding: theme.spacing(0, 1),
  // ใช้ mixin toolbar ของ theme เพื่อกำหนดสไตล์ของ DrawerHeader ให้เหมือนกับ toolbar ทั่วไป
  ...theme.mixins.toolbar,
}));

// สร้างคอมโพเนนต์เพื่อ AppBar
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  // สร้างคอมโพเนนต์ styled ชื่อ AppBar ที่มี props เป็น open สำหรับการกำหนดสถานะเปิดปิดของ Drawer
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function Navbar() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const location = useLocation();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  //bind value user from localstorage
  const userString = localStorage.getItem("userToken");
  const userObject = JSON.parse(userString);
  const userName = userObject?.user_name;
  const userSurname = userObject?.user_surname;
  // const userRole = userObject?.role_type;

  const userGuest = localStorage.getItem("guestToken");
  const userGuestObject = JSON.parse(userGuest);
  const userGuestName = userGuestObject?.user_login;
  // const userGuestRole = userGuestObject?.role_type;

  //*Menu name ******************************************************

  const [menuName, setMenuName] = React.useState("System Recovery");

  React.useEffect(() => {
    switch (location.pathname) {
      case "/computer_in_process":
        setMenuName("Computer in Process");
        break;
      case "/connect_network":
        setMenuName("PC Connect Network");
        break;
      case "/tablet":
        setMenuName("Tablet");
        break;
      case "/rasbery_pi":
        setMenuName("Rasbery Pi");
        break;
      case "/join_domain":
        setMenuName("Join Domain");
        break;
      default:
        setMenuName("System Recovery");
    }
  }, [location.pathname]);

  return (
    <>
      <Box sx={{ display: "flex" }}>
        {/* <CssBaseline /> */}

        {/* HEADER MUI APPBAR */}

        <AppBar position="fixed" open={open}>
          <Toolbar
            sx={{ display: "flex", justifyContent: "space-between" }} // Add this
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {" "}
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{
                  marginRight: 5,
                  ...(open && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  fontWeight: "bold",
                }}
              >
                {menuName}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="p" sx={{ mr: 1, fontWeight: "Bold" }}>
                {userName && userSurname
                  ? `${userName} ${userSurname}`
                  : userGuestName}
              </Typography>

              <AccountMenu />

              {/* If you have other elements, you can continue adding them here */}
            </Box>
          </Toolbar>
        </AppBar>

        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <Link to="/home">
              <img
                src={Fuji}
                alt="คำอธิบายภาพ"
                style={{
                  width: 180, // กำหนดความกว้างของภาพให้เต็มขนาดของพื้นที่ที่รองรับ
                  height: 45, // กำหนดความสูงของภาพให้ปรับแต่งตามอัตราส่วนต้นฉบับ
                }}
              />
            </Link>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />

          {/* //*Menu list ****************************************************** */}

          {/* //Computer in Process */}
          <List open={open}>
            <ListItem
              onClick={() => setMenuName("Computer in Process")}
              disablePadding
              sx={{ display: "block", color: "black" }}
              component={Link}
              to="/computer_in_process"
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "inherit", // Set initial color
                    "&:hover": {
                      color: "primary.main", // Change color on hover
                    },
                  }}
                >
                  <ComputerIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Computer in Process"
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>

            {/* //Project PC */}
            <ListItem
              onClick={() => setMenuName("PC Connect Network")}
              disablePadding
              sx={{ display: "block", color: "black" }}
              component={Link}
              to="/connect_network"
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "inherit", // Set initial color
                    "&:hover": {
                      color: "primary.main", // Change color on hover
                    },
                  }}
                >
                  <CableIcon />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography>Connect Network</Typography>}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>

            {/* //Project Tablet */}
            <ListItem
              onClick={() => setMenuName("Tablet")}
              disablePadding
              sx={{ display: "block", color: "black" }}
              component={Link}
              to="/tablet"
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "inherit", // Set initial color
                    "&:hover": {
                      color: "primary.main", // Change color on hover
                    },
                  }}
                >
                  <StayPrimaryPortraitIcon />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography>Tablet</Typography>}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>

            {/* //Project Rasbery Pi */}
            <ListItem
              onClick={() => setMenuName("Rasbery Pi")}
              disablePadding
              sx={{ display: "block", color: "black" }}
              component={Link}
              to="/rasbery_pi"
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "inherit", // Set initial color
                    "&:hover": {
                      color: "primary.main", // Change color on hover
                    },
                  }}
                >
                  <MemoryIcon />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography>Rasbery Pi</Typography>}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>

            {/* //Join Domain */}
            <ListItem
              onClick={() => setMenuName("Join Domain")}
              disablePadding
              sx={{ display: "block", color: "black" }}
              component={Link}
              to="/join_domain"
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "inherit", // Set initial color
                    "&:hover": {
                      color: "primary.main", // Change color on hover
                    },
                  }}
                >
                  <DomainIcon />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography>Join Domain</Typography>}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
      </Box>
    </>
  );
}
