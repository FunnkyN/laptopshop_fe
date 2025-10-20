import React, { useEffect, useState } from "react";
import { Alert, AlertTitle } from "@mui/material";
import { useLocation } from "react-router-dom";
import { getInfoPayment } from "../../until/common/index.js";
import api from "../../Config/api.js";
import { useDispatch } from "react-redux";
import { getCart } from "../../Redux/Customers/Cart/Action.js";

const PaymentSuccess = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [info, setInfo] = useState({});

  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");

  const orderCode = queryParams.get("orderCode");

  useEffect(() => {
    const get = async () => {
      try {
        const payment = await getInfoPayment(orderCode);
        setInfo(payment);

        if (payment.status === "PAID") {
          const parts = payment.transactions[0].description.split(" ");
          const order_id = parts[3];

          await api.put(
            `/api/orders/${order_id}?paymentStatus=COMPLETED`
          );

          if (jwt) {
             dispatch(getCart(jwt));
          }
        }
      } catch (error) {
        console.error("Lỗi xác nhận thanh toán:", error);
      }
    };

    if (orderCode) {
        get();
    }
  }, [orderCode, dispatch, jwt]);

  return (
    <div className="px-2 lg:px-36">
      <div className="flex flex-col justify-center items-center">
        <Alert
          variant="filled"
          severity="success"
          sx={{ mb: 6, width: "fit-content" }}
        >
          <AlertTitle>Thanh toán thành công</AlertTitle>
          Bạn đã thanh toán thành công số tiền {info?.amount?.toLocaleString('vi-VN')} VND
        </Alert>
      </div>
    </div>
  );
};

export default PaymentSuccess;