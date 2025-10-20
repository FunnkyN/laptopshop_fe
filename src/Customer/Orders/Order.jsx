import { Box, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import OrderCard from "./OrderCard";
import { useDispatch, useSelector } from "react-redux";
import { getOrderHistory } from "../../Redux/Customers/Order/Action";
import { useLocation, useNavigate } from "react-router-dom";
import Pagination from "@mui/material/Pagination";

const orderStatus = [
    { label: "Đang chờ phê duyệt", value: "PENDING" },
    { label: "Đã xác nhận", value: "CONFIRMED" },
    { label: "Đang giao", value: "SHIPPED" },
    { label: "Đã giao", value: "DELIVERED" },
    { label: "Đã hủy", value: "CANCELLED" },
];

const Order = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const jwt = localStorage.getItem("jwt");
    const { order } = useSelector((store) => store);
    const [status, setStatus] = useState("");
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const page = queryParams.get("page") ?? 1;

    console.log("order", page);

    const handlePaginationChange = (event, value) => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set("page", value);
        const query = searchParams.toString();
        navigate({ search: `?${query}` });
    };

    useEffect(() => {
        if (!jwt) {
            navigate("/");
        } else {
            dispatch(getOrderHistory(status, page));
        }
    }, [jwt, status, page, dispatch, navigate]);

    return (
        // [Responsive] Giảm padding trên mobile (px-2) và tăng trên desktop (lg:px-10)
        <Box className="px-2 lg:px-10 py-5">
            <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
                
                {/* --- PHẦN BỘ LỌC --- */}
                {/* [Responsive] xs={12}: Full width trên mobile, lg={3}: 25% width trên desktop */}
                <Grid item xs={12} lg={3}>
                    <div className="h-auto shadow-lg bg-white border p-5 sticky top-20 rounded-md">
                        <h1 className="font-bold text-lg mb-4">Lọc trạng thái</h1>
                        
                        {/* [Responsive] Mobile: flex-row wrap (ngang), Desktop: flex-col (dọc) */}
                        <div className="flex flex-row flex-wrap gap-4 lg:flex-col lg:gap-4 lg:space-y-4">
                            <div className="flex items-center min-w-[45%] lg:min-w-0">
                                <input
                                    type="radio"
                                    name="status"
                                    value=""
                                    onChange={() => setStatus("")}
                                    checked={status === ""}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                    id="status-all"
                                />
                                <label htmlFor="status-all" className="ml-3 text-sm text-gray-600 cursor-pointer">
                                    Tất cả
                                </label>
                            </div>
                            
                            {orderStatus.map((option) => (
                                <div key={option.value} className="flex items-center min-w-[45%] lg:min-w-0">
                                    <input
                                        defaultValue={option.value}
                                        type="radio"
                                        name="status"
                                        onChange={(e) => setStatus(e.target.value)}
                                        checked={status === option.value}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                        id={`status-${option.value}`}
                                    />
                                    <label
                                        htmlFor={`status-${option.value}`}
                                        className="ml-3 text-sm text-gray-600 cursor-pointer"
                                    >
                                        {option.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </Grid>

                {/* --- PHẦN DANH SÁCH ĐƠN HÀNG --- */}
                {/* [Responsive] xs={12}: Full width trên mobile, lg={9}: 75% width trên desktop */}
                <Grid item xs={12} lg={9}>
                    <Box className="space-y-5">
                        {order.orders?.content?.length > 0 ? (
                            order.orders?.content?.map((order) => {
                                return order?.orderItems?.map((item, index) => (
                                    <OrderCard key={`${order.id}-${item.id}`} item={item} order={order} />
                                ));
                            })
                        ) : (
                            <div className="mx-auto px-4 py-10 flex justify-center bg-gray-50 rounded-md text-gray-500">
                                Không tìm thấy đơn hàng nào
                            </div>
                        )}
                    </Box>
                    
                    {/* Pagination */}
                    {order.orders?.totalPages > 1 && (
                        <section className="w-full mt-8">
                            <div className="mx-auto px-4 py-5 flex justify-center">
                                <Pagination
                                    count={order.orders?.totalPages}
                                    color="primary"
                                    page={parseInt(page)}
                                    onChange={handlePaginationChange}
                                />
                            </div>
                        </section>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default Order;