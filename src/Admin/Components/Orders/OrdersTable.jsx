import {
    Avatar,
    AvatarGroup,
    Box,
    Button,
    Card,
    CardHeader,
    Chip,
    Menu,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    confirmOrder,
    deleteOrder,
    deliveredOrder,
    getOrders,
    shipOrder,
} from "../../../Redux/Admin/Orders/Action";
// [UPDATE] Import BlobImage & API_BASE_URL
import { API_BASE_URL } from "../../../Config/api";
import BlobImage from "../../../until/BlobImage";

const OrdersTable = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({status: "", sort: ""});
    const [orderStatus, setOrderStatus] = useState("");
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt");
    const {adminOrder} = useSelector((store) => store);

    const [anchorElArray, setAnchorElArray] = useState([]);

    useEffect(() => {
        dispatch(getOrders({jwt}));
    }, [jwt, adminOrder?.delivered, adminOrder?.shipped, adminOrder?.confirmed]);

    const handleUpdateStatusMenuClick = (event, index) => {
        const newAnchorElArray = [...anchorElArray];
        newAnchorElArray[index] = event.currentTarget;
        setAnchorElArray(newAnchorElArray);
    };

    const handleUpdateStatusMenuClose = (index) => {
        const newAnchorElArray = [...anchorElArray];
        newAnchorElArray[index] = null;
        setAnchorElArray(newAnchorElArray);
    };

    const handleConfirmedOrder = (orderId, index) => {
        handleUpdateStatusMenuClose(index);
        dispatch(confirmOrder(orderId));
        setOrderStatus("CONFIRMED")
    };

    const handleShippedOrder = (orderId, index) => {
        handleUpdateStatusMenuClose(index);
        dispatch(shipOrder(orderId))
        setOrderStatus("ShIPPED")
    };

    const handleDeliveredOrder = (orderId, index) => {
        handleUpdateStatusMenuClose(index);
        dispatch(deliveredOrder(orderId))
        setOrderStatus("DELIVERED")
    };

    const handleDeleteOrder = (orderId) => {
        handleUpdateStatusMenuClose();
        dispatch(deleteOrder(orderId));
    };

    return (
        <Box>
            <Card className="mt-2">
                <CardHeader
                    title="Danh sách đơn hàng"
                    sx={{
                        pt: 2,
                        alignItems: "center",
                        "& .MuiCardHeader-action": {mt: 0.6},
                    }}
                />
                <TableContainer>
                    <Table sx={{minWidth: 800}} aria-label="table in dashboard">
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>Sản phẩm</TableCell>
                                <TableCell>Giá trị đơn hàng</TableCell>
                                <TableCell>Id</TableCell>
                                <TableCell sx={{textAlign: "center"}}>Trạng thái</TableCell>
                                <TableCell sx={{textAlign: "center"}}>Cập nhật</TableCell>
                                <TableCell sx={{textAlign: "center"}}>Xóa</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {adminOrder?.orders?.map((item, index) => (
                                <TableRow
                                    hover
                                    key={item.id}
                                    sx={{"&:last-of-type td, &:last-of-type th": {border: 0}}}
                                >
                                    <TableCell sx={{}}>
                                        <AvatarGroup max={4} sx={{justifyContent: 'start'}}>
                                            {item.orderItems.map((orderItem) => (
                                                /* [UPDATE] Bỏ src trong Avatar, thay bằng child BlobImage */
                                                <Avatar key={orderItem.id} alt={orderItem.laptop.model}>
                                                    <BlobImage
                                                        src={orderItem.laptop.imageUrls && orderItem.laptop.imageUrls.length > 0
                                                            ? `${API_BASE_URL}${orderItem.laptop.imageUrls[0]}`
                                                            : ""}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </Avatar>
                                            ))}
                                        </AvatarGroup>
                                    </TableCell>

                                    <TableCell
                                        sx={{py: (theme) => `${theme.spacing(0.5)} !important`}}
                                    >
                                        <Box sx={{display: "flex", flexDirection: "column"}}>
                                            <Typography
                                                sx={{
                                                    fontWeight: 500,
                                                    fontSize: "0.875rem !important",
                                                }}
                                            >
                                                {item?.orderItems.map((order) => (
                                                    <span key={order.id} className=""> {order?.laptop.model},</span>
                                                ))}
                                            </Typography>
                                            <Typography variant="caption">
                                                {item?.orderItems.map((order) => (
                                                    <span key={order.id} className="opacity-60">
                            {" "}
                                                        {order.laptop.brand.name},
                          </span>
                                                ))}
                                            </Typography>
                                        </Box>
                                    </TableCell>

                                    <TableCell>{item.totalPrice.toLocaleString('vi-VN')} VND</TableCell>
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell className="text-white">
                                        <Chip
                                            sx={{
                                                color: "white !important",
                                                fontWeight: "bold",
                                                textAlign: "center",
                                            }}
                                            label={item.orderStatus}
                                            size="small"
                                            color={
                                                item.orderStatus === "PENDING" ? "info" : item.orderStatus === "DELIVERED" ? "success" : "secondary"
                                            }
                                            className="text-white"
                                        />
                                    </TableCell>
                                    <TableCell
                                        sx={{textAlign: "center"}}
                                        className="text-white"
                                    >
                                        <div>
                                            <Button
                                                id={`basic-button-${item.id}`}
                                                aria-controls={`basic-menu-${item.id}`}
                                                aria-haspopup="true"
                                                aria-expanded={Boolean(anchorElArray[index])}
                                                onClick={(event) =>
                                                    handleUpdateStatusMenuClick(event, index)
                                                }
                                            >
                                                Trạng thái
                                            </Button>
                                            <Menu
                                                id={`basic-menu-${item.id}`}
                                                anchorEl={anchorElArray[index]}
                                                open={Boolean(anchorElArray[index])}
                                                onClose={() => handleUpdateStatusMenuClose(index)}
                                                MenuListProps={{
                                                    "aria-labelledby": `basic-button-${item.id}`,
                                                }}
                                            >
                                                <MenuItem
                                                    onClick={() => handleConfirmedOrder(item.id, index)}
                                                    disabled={item.orderStatus === "DELIVERED" || item.orderStatus === "SHIPPED" || item.orderStatus === "CONFIRMED"}
                                                >
                                                    Xác nhận đơn hàng
                                                </MenuItem>
                                                <MenuItem
                                                    disabled={item.orderStatus === "DELIVERED" || item.orderStatus === "SHIPPED"}
                                                    onClick={() => handleShippedOrder(item.id, index)}
                                                >
                                                    Đang giao hàng
                                                </MenuItem>
                                                <MenuItem onClick={() => handleDeliveredOrder(item.id)}>
                                                   Đã giao hàng
                                                </MenuItem>
                                            </Menu>
                                        </div>
                                    </TableCell>
                                    <TableCell
                                        sx={{textAlign: "center"}}
                                        className="text-white"
                                    >
                                        <Button
                                            onClick={() => handleDeleteOrder(item.id)}
                                            variant="text"
                                        >
                                            Xóa
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Box>
    );
};

export default OrdersTable;