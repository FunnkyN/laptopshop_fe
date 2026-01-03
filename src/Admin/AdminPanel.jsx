import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import {ThemeProvider} from "@emotion/react";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useTheme} from "@mui/material/styles";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import ChatIcon from "@mui/icons-material/Chat";
import ArticleIcon from '@mui/icons-material/Article';
import ListItemIcon from "@mui/material/ListItemIcon";
import {customTheme} from "./Theme/CustomTheme";
import AdminNavbar from "./Navigation/AdminNavbar";
import Dashboard from "./Views/Dashboard";
import {Route, Routes, useNavigate} from "react-router-dom";
import DemoAdmin from "./Views/DemoAdmin";
import CreateLaptopForm from "./Components/CreateLaptop/CreateLaptopFrom";
import "./AdminPanel.css";
import LaptopsTable from "./Components/Laptops/LaptopsTable";
import OrdersTable from "./Components/Orders/OrdersTable";
import Customers from "./Components/Customers/customers";
import UpdateLaptopForm from "./Components/UpdateLaptop/UpdateLaptop";
import BannerManagement from "./Components/BannerManagement/BannerManagement";
import AdminChat from "./Components/Chat/AdminChat";

import PostTable from "./Components/Post/PostTable";
import CreatePostForm from "./Components/Post/CreatePostForm";

const drawerWidth = 240;

const menu = [
    {name: "Tổng quan", path: "/admin", icon: <InboxIcon />},
    {name: "Thêm sản phẩm", path: "/admin/laptop/create", icon: <InboxIcon />},
    {name: "Danh sách sản phẩm", path: "/admin/laptops", icon: <InboxIcon />},
    {name: "Danh sách khách hàng", path: "/admin/customers", icon: <InboxIcon />},
    {name: "Quản lý đơn hàng", path: "/admin/orders", icon: <InboxIcon />},
    {name: "Quản lý banner", path: "/admin/banner", icon: <InboxIcon />},
    {name: "Quản lý bài viết", path: "/admin/posts", icon: <ArticleIcon />},
    {name: "Chat hỗ trợ", path: "/admin/chat", icon: <ChatIcon />},
];

export default function AdminPanel() {
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
    const [sideBarVisible, setSideBarVisible] = React.useState(false);
    const navigate = useNavigate();

    const drawer = (
        <Box
        >
            {isLargeScreen && <Toolbar/>}
            <List>
                {menu.map((item, index) => (
                    <ListItem key={item.name} disablePadding onClick={() => navigate(item.path)}>
                        <ListItemButton>
                            <ListItemIcon>
                                {item.icon ? item.icon : (index % 2 === 0 ? <InboxIcon/> : <MailIcon/>)}
                            </ListItemIcon>
                            <ListItemText primary={item.name}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    const handleSideBarViewInMobile = () => {
        setSideBarVisible(true);
    };

    const handleCloseSideBar = () => {
        setSideBarVisible(false);
    };

    const drawerVariant = isLargeScreen ? "permanent" : "temporary";

    return (
        <ThemeProvider theme={customTheme}>
            <Box sx={{display: `${isLargeScreen ? "flex" : "block"}`}}>
                <CssBaseline/>
                <AdminNavbar handleSideBarViewInMobile={handleSideBarViewInMobile}/>
                <Drawer
                    variant={drawerVariant}
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: {
                            width: drawerWidth,
                            boxSizing: "border-box",
                            ...(drawerVariant === "temporary" && {
                                top: 0,
                                [`& .MuiPaper-root.MuiDrawer-paperAnchorTop.MuiDrawer-paperTemporary`]:
                                    {
                                        position: "fixed",
                                        left: 0,
                                        right: 0,
                                        height: "100%",
                                        zIndex: (theme) => theme.zIndex.drawer + 2,
                                    },
                            }),
                        },
                    }}
                    open={isLargeScreen || sideBarVisible}
                    onClose={handleCloseSideBar}
                >
                    {drawer}
                </Drawer>
                <Box className="adminContainer" component="main" sx={{flexGrow: 1}}>
                    <Toolbar/>
                    <Routes>
                        <Route path="/" element={ <Dashboard />}></Route>
                        <Route path="/laptop/create" element={<CreateLaptopForm/>}></Route>
                        <Route path="/laptops" element={<LaptopsTable/>}></Route>
                        <Route path="/orders" element={<OrdersTable/>}></Route>
                        <Route path="/customers" element={<Customers/>}></Route>
                        <Route path="/banner" element={<BannerManagement/>}></Route>
                        <Route path="/chat" element={<AdminChat/>}></Route>

                        {}
                        <Route path="/posts" element={<PostTable/>}></Route>
                        <Route path="/posts/create" element={<CreatePostForm/>}></Route>
                        <Route path="/posts/update/:postId" element={<CreatePostForm/>}></Route>
                    </Routes>
                </Box>
            </Box>
        </ThemeProvider>
    );
}