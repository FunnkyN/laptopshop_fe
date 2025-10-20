import React, { useState, useEffect } from "react";
import { Button, Snackbar, Alert, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CartItem from "../Cart/CartItem";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../../Redux/Customers/Order/Action";
import { getCart } from "../../Redux/Customers/Cart/Action";
import AddressCard from "../Address/AddressCard";
import { createUrLPayment } from "../../until/common";

const OrderSummary = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { order, cart } = useSelector(state => state);
    const jwt = localStorage.getItem("jwt");

    const { orderData, selectedCartItems } = order;

    const [isProcessing, setIsProcessing] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    useEffect(() => {
        if (!orderData || !selectedCartItems || selectedCartItems.length === 0) {
            navigate("/checkout?step=2");
        }
    }, [orderData, selectedCartItems, navigate]);

    const calculateTotals = () => {
        let totalPrice = 0;
        let totalDiscountedPrice = 0;
        let totalItem = 0;

        const itemsToProcess = selectedCartItems || [];

        itemsToProcess.forEach(item => {

            const originalPrice = item.laptopPrice || 0;
            const discount = item.discountPercent || 0;
            const quantity = item.quantity || 1;

            const discountedPrice = originalPrice * (100 - discount) / 100;

            totalPrice += originalPrice * quantity;
            totalDiscountedPrice += discountedPrice * quantity;
            totalItem += quantity;
        });

        return { totalPrice, totalDiscountedPrice, totalItem, itemsToProcess };
    };

    const { totalPrice, totalDiscountedPrice, totalItem, itemsToProcess } = calculateTotals();

    const handleConfirmAndPay = async () => {
        if (isProcessing) return;
        setIsProcessing(true);

        try {

            const createOrderPayload = {
                shippingAddress: orderData.shippingAddress,
                paymentMethod: orderData.paymentMethod,
                cartItems: itemsToProcess
            };

            dispatch(createOrder(createOrderPayload));

        } catch (error) {
            setAlertMessage("Có lỗi xảy ra khi khởi tạo đơn hàng.");
            setOpenAlert(true);
            setIsProcessing(false);
        }
    };

    useEffect(() => {

        if (isProcessing) {
            if (order.order && order.success) {

                const createdOrder = order.order;

                if (jwt) dispatch(getCart(jwt));

                if (createdOrder.paymentMethod === 'COD') {
                    navigate('/account/order');
                } else {

                    createUrLPayment(createdOrder.totalDiscountedPrice, createdOrder.id, createdOrder.paymentMethod)
                        .then(url => {
                            if (url) window.location.href = url;
                        })
                        .catch(err => {
                            setAlertMessage("Lỗi tạo cổng thanh toán: " + err.message);
                            setOpenAlert(true);
                            setIsProcessing(false);
                        });
                }
            }
            else if (order.error) {

                setAlertMessage("Lỗi tạo đơn hàng: " + order.error);
                setOpenAlert(true);
                setIsProcessing(false);
            }
        }
    }, [order.order, order.error, order.success, isProcessing, dispatch, navigate, jwt]);

    return (
        <div className="space-y-5">
            <Snackbar
                open={openAlert}
                autoHideDuration={6000}
                onClose={() => setOpenAlert(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert severity="error" sx={{ width: "100%" }}>
                    {alertMessage}
                </Alert>
            </Snackbar>

            <div className="p-5 shadow-lg rounded-md border ">
                <AddressCard address={orderData?.shippingAddress} />
            </div>

            <div className="lg:grid grid-cols-3 relative justify-between">
                <div className="lg:col-span-2 ">
                    <div className=" space-y-3">
                        {}
                        {itemsToProcess.map((item) => (
                            <CartItem key={item.id} item={item} showButton={false} />
                        ))}
                    </div>
                </div>

                <div className="sticky top-0 h-[100vh] mt-5 lg:mt-0 ml-5">
                    <div className="border p-5 bg-white shadow-lg rounded-md">
                        <p className="font-bold opacity-60 pb-4">Xác nhận thanh toán</p>
                        <hr />

                        <div className="space-y-3 font-semibold">
                            <div className="flex justify-between pt-3 text-black ">
                                <span>Tổng giá trị ({totalItem} sản phẩm)</span>
                                <span>{totalPrice.toLocaleString('vi-VN')} VND</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Giảm giá</span>
                                <span className="text-green-700">{(totalDiscountedPrice - totalPrice).toLocaleString('vi-VN')} VND</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Phương thức</span>
                                <span className="text-blue-700 font-bold">{orderData?.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản Online'}</span>
                            </div>
                            <hr />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Tổng thanh toán</span>
                                <span className="text-green-700">{totalDiscountedPrice.toLocaleString('vi-VN')} VND</span>
                            </div>
                        </div>

                        <Button
                            onClick={handleConfirmAndPay}
                            disabled={isProcessing}
                            variant="contained"
                            fullWidth
                            sx={{ padding: ".8rem 2rem", marginTop: "2rem" }}
                        >
                            {isProcessing ? <CircularProgress size={24} color="inherit" /> : "XÁC NHẬN ĐẶT HÀNG"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;