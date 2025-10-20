import React from "react";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { removeCartItem, updateCartItem, getCart } from "../../Redux/Customers/Cart/Action";
import { IconButton } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { API_BASE_URL } from "../../Config/api";
// [UPDATE] Import BlobImage
import BlobImage from "../../until/BlobImage";

const CartItem = ({ item, showButton }) => {
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt");

    const handleRemoveItemFromCart = async () => {
        try {
            const data = { cartItemId: item?.id, jwt };
            await dispatch(removeCartItem(data));
            dispatch(getCart(jwt));
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    const handleUpdateCartItem = async (num) => {
        try {
            const data = { data: { quantity: item.quantity + num }, cartItemId: item?.id, jwt };
            await dispatch(updateCartItem(data));
            dispatch(getCart(jwt));
        } catch (error) {
            console.error("Error updating item quantity:", error);
        }
    };

    const colorName = item?.colorName ?? item.color.name
    const laptopPrice = item?.laptopPrice ?? item.laptop.price
    const discountPercent = item?.discountPercent ?? item.laptop.discountPercent
    const firstImageUrl = item?.firstImageUrl ?? item.laptop.imageUrls[0]

    return (
        <div className="p-5 shadow-lg border rounded-md">
            <div className="flex items-center">
                <div className="w-[5rem] h-[5rem] lg:w-[9rem] lg:h-[9rem] ">
                    {/* [UPDATE] Thay thế img bằng BlobImage */}
                    <BlobImage
                        className="w-full h-full object-cover object-top"
                        src={`${API_BASE_URL}${firstImageUrl}`}
                        alt={item?.laptopModel}
                    />
                </div>
                <div className="ml-5 space-y-1">
                    <p className="font-semibold">{item?.laptopModel}</p>
                    <p className="opacity-70">Màu: {colorName}</p>
                    
                    <div className="flex space-x-2 items-center pt-3">
                        <p className="opacity-50 line-through">{laptopPrice?.toLocaleString('vi-VN')} VND</p>
                        <p className="font-semibold text-lg">
                            {(laptopPrice * (100 - discountPercent) / 100)?.toLocaleString('vi-VN')} VND
                        </p>
                        <p className="text-green-600 font-semibold">
                            {discountPercent}%
                        </p>
                    </div>
                </div>
            </div>
            {showButton && <div className="lg:flex items-center lg:space-x-10 pt-4">
                <div className="flex items-center space-x-2 ">
                    <IconButton onClick={() => handleUpdateCartItem(-1)} disabled={item?.quantity <= 1} color="primary"
                        aria-label="decrease quantity">
                        <RemoveCircleOutlineIcon />
                    </IconButton>

                    <span className="py-1 px-7 border rounded-sm">{item?.quantity + '/' + item?.stock }</span>
                    <IconButton onClick={() => handleUpdateCartItem(1)} color="primary" aria-label="increase quantity">
                        <AddCircleOutlineIcon />
                    </IconButton>
                </div>
                <div className="flex text-sm lg:text-base mt-5 lg:mt-0">
                    <Button onClick={handleRemoveItemFromCart} variant="text">
                        Remove
                    </Button>
                </div>
            </div>}
        </div>
    );
};

export default CartItem;