import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Checkbox } from "@mui/material";
import { getCart } from "../../Redux/Customers/Cart/Action";
import { setSelectedCartItems } from "../../Redux/Customers/Order/Action";
import CartItem from "./CartItem";

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const jwt = localStorage.getItem("jwt");

    const { cart } = useSelector(store => store.cart);
    const [selectedItems, setSelectedItems] = useState([]);

    const calculateTotalPrice = () => {
        return selectedItems.reduce((total, itemId) => {
            const item = cart.find((i) => i.id === itemId);
            const itemPrice = item?.laptopPrice * (100 - item?.discountPercent) / 100 || 0;
            return total + (itemPrice * item?.quantity);
        }, 0);
    };
    const calculateTotalItem = () => {
        return selectedItems.reduce((total, itemId) => {
            const item = cart.find((i) => i.id === itemId);
            return total + item?.quantity;
        }, 0);
    };

const [totalPrice, setTotalPrice] = useState(0);
const [totalDiscount, setTotalDiscount] = useState(0);
const [totalItem, setTotalItem] = useState(0);

    useEffect(() => {
        dispatch(getCart(jwt));
        if (!jwt) {
            navigate('/');
        }
    }, [jwt, dispatch]);

    const handleCheckboxChange = (itemId) => {
        setSelectedItems((prev) =>
            prev.includes(itemId)
                ? prev.filter((id) => id !== itemId)
                : [...prev, itemId]
        );
    };

    const handleCheckout = () => {
        const itemsToCheckout = cart.filter((item) => selectedItems.includes(item.id));
        dispatch(setSelectedCartItems(itemsToCheckout));
        navigate("/checkout?step=2");
    };

    const handleSelectAll = () => {
        if (selectedItems.length === cart.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(cart.map((item) => item.id));
        }
    };

    useEffect(() => {
        setTotalPrice(calculateTotalPrice());
        setTotalItem(calculateTotalItem());
    }, [selectedItems, cart]);

    const totalQuantity = selectedItems.length;

    return (
        <div>
            {cart?.length > 0 ? (
                <div className="lg:grid grid-cols-3 lg:px-16 relative">
                    <div className="lg:col-span-2 lg:px-5 bg-white">
                        <div className="space-y-3">
                            <div className="flex items-center space-x-4">
                                <Checkbox
                                    checked={selectedItems.length === cart.length}
                                    onChange={handleSelectAll}
                                />
                                <span>Chọn tất cả</span>
                            </div>
                            {cart.map((item) => (
                                <div key={item.id} className="flex items-center space-x-4">
                                    <div className="shrink-0">
                                        <Checkbox
                                            checked={selectedItems.includes(item.id)}
                                            onChange={() => handleCheckboxChange(item.id)}
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <CartItem item={item} showButton={true} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="px-5 sticky top-0 h-[100vh] mt-5 lg:mt-0">
                        <div className="border p-5 bg-white shadow-lg rounded-md">
                            <div className="space-y-3 font-semibold">
                                <div className="flex justify-between">
                                    <span>Số sản phẩm đã chọn</span>
                                    <span>{totalQuantity}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tổng số lượng sản phẩm </span>
                                    <span>{totalItem}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tổng giá trị</span>
                                    <span className="font-bold text-xl">
                                        {totalPrice.toLocaleString("vi-VN")} VND
                                    </span>
                                </div>
                                {

}
                                <hr />
                            </div>

                            <Button
                                onClick={handleCheckout}
                                variant="contained"
                                type="submit"
                                sx={{ padding: ".8rem 2rem", marginTop: "2rem", width: "100%" }}
                                disabled={selectedItems.length === 0}
                            >
                                Mua hàng
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex w-full justify-center">Không có sản phẩm nào trong giỏ hàng</div>
            )}
        </div>
    );
};

export default Cart;

