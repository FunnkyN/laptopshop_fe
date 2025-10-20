import { Box, Button, Grid } from "@mui/material";
import React from "react";
import OrderTraker from "./OrderTraker";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate, useParams } from "react-router-dom";
import AddressCard from "../Address/AddressCard";
import { deepPurple } from "@mui/material/colors";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getOrderById } from "../../Redux/Customers/Order/Action";
// [UPDATE] Import API_BASE_URL và BlobImage
import { API_BASE_URL } from "../../Config/api";
import BlobImage from "../../until/BlobImage";

const OrderDetails = () => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { orderId } = useParams();
  const { order } = useSelector((store) => store);

  console.log("order", order.order);

  useEffect(() => {
    dispatch(getOrderById(orderId));
  }, []);

  const navigate = useNavigate();
  return (
    <div className=" px-2 lg:px-36 space-y-7 ">
      <Grid container className="p-3 shadow-lg">
        <Grid xs={12}>
          <p className="font-bold text-lg py-2">Delivery Address</p>
        </Grid>
        <Grid item xs={6}>
          <AddressCard address={order.order?.shippingAddress} />
        </Grid>
      </Grid>
      <Box className="p-5 shadow-lg border rounded-md">
        <Grid
          container
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Grid item xs={9}>
            <OrderTraker
              activeStep={
                order.order?.orderStatus === "PLACED"
                  ? 1
                  : order.order?.orderStatus === "CONFIRMED"
                  ? 2
                  : order.order?.orderStatus === "SHIPPED"
                  ? 3
                  : 5
              }
            />
          </Grid>
          <Grid item>
           {order.order?.orderStatus==="DELIVERED" && <Button sx={{ color: ""}} color="error" variant="text" >
              RETURN
            </Button>}

            {order.order?.orderStatus!=="DELIVERED" && <Button sx={{ color: deepPurple[500] }} variant="text">
              cancel order
            </Button>}
          </Grid>
        </Grid>
      </Box>

      <Grid container className="space-y-5">
        {order.order?.orderItems.map((item) => (
          <Grid
            container
            item
            className="shadow-xl rounded-md p-5 border"
            sx={{ alignItems: "center", justifyContent: "space-between" }}
            key={item.id}
          >
            <Grid item xs={6}>
              <div className="flex items-center">
                {/* [UPDATE] Thay thế img bằng BlobImage */}
                <div className="w-[5rem] h-[5rem]">
                    <BlobImage
                      className="w-full h-full object-cover object-top"
                      // Nếu item.laptop.imageUrl chưa có http, thêm API_BASE_URL vào
                      src={item?.laptop?.imageUrl?.startsWith("http") 
                            ? item.laptop.imageUrl 
                            : `${API_BASE_URL}${item.laptop.imageUrl}`}
                      alt={item?.laptop?.title}
                    />
                </div>
                
                <div className="ml-5 space-y-2">
                  <p className="">{item.laptop.title}</p>
                  <p className="opacity-50 text-xs font-semibold space-x-5">
                    <span>Color: {item.laptop.color || 'N/A'}</span> <span>Size: {item.size || 'N/A'}</span>
                  </p>
                  <p>Seller: {item.laptop.brand}</p>
                  <p>{item.price?.toLocaleString('vi-VN')} VND</p>
                </div>
              </div>
            </Grid>
            <Grid item>
              {
                <Box
                  sx={{ color: deepPurple[500] }}
                  onClick={() => navigate(`/account/rate/${item.laptop.id}`)}
                  className="flex items-center cursor-pointer"
                >
                  <StarIcon
                    sx={{ fontSize: "2rem" }}
                    className="px-2 text-5xl"
                  />
                  <span>Rate & Review Laptop</span>
                </Box>
              }
            </Grid>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default OrderDetails;