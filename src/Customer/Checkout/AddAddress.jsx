import * as React from "react";
import { Grid, TextField, Button, Box, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Typography, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setOrderData } from "../../Redux/Customers/Order/Action";
import AddressCard from "../Address/AddressCard";
import { useState, useEffect } from "react";

export default function AddDeliveryAddressForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { auth } = useSelector((store) => store);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [localError, setLocalError] = useState("");

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setLocalError("");
  }

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  // Hàm chung để chuyển sang bước 3
  const proceedToSummary = (shippingAddress) => {
      if (!paymentMethod) {
          setLocalError("Vui lòng chọn phương thức thanh toán!");
          return;
      }

      // Lưu thông tin tạm vào Redux
      const dataToSave = {
          shippingAddress: shippingAddress,
          paymentMethod: paymentMethod
      };

      dispatch(setOrderData(dataToSave));

      // Chuyển sang bước 3 (chưa tạo đơn hàng database)
      navigate("/checkout?step=3");
  };

  const handleExistingAddressSubmit = () => {
    if (!selectedAddress) {
        setLocalError("Vui lòng chọn một địa chỉ hoặc nhập địa chỉ mới!");
        return;
    }
    proceedToSummary(selectedAddress);
  };

  const handleNewAddressSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const address = {
      name: data.get("name"),
      streetAddress: data.get("streetAddress"),
      city: data.get("city"),
      phoneNumber: data.get("phoneNumber"),
    };

    if (!address.name || !address.streetAddress || !address.city || !address.phoneNumber) {
        setLocalError("Vui lòng điền đầy đủ thông tin giao hàng.");
        return;
    }

    proceedToSummary(address);
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} lg={5}>
        <Box className="border rounded-md shadow-md h-[30.5rem] overflow-y-scroll">
          {auth?.user?.addresses?.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelectAddress(item)}
              className={`p-5 py-7 border-b cursor-pointer ${selectedAddress?.id === item.id ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'}`}
            >
              <AddressCard address={item} />
              {selectedAddress?.id === item.id && (
                <Button
                  sx={{ mt: 2 }}
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                      e.stopPropagation();
                      handleExistingAddressSubmit();
                  }}
                >
                  Giao hàng đến địa chỉ này
                </Button>
              )}
            </div>
          ))}
        </Box>
      </Grid>

      <Grid item xs={12} lg={7}>
        <Box className="border rounded-md shadow-md p-5">
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <FormLabel component="legend" className="font-bold mb-2">Phương thức thanh toán</FormLabel>
            <RadioGroup
              row
              aria-label="paymentMethod"
              name="paymentMethod"
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
            >
              <FormControlLabel value="COD" control={<Radio />} label="Thanh toán khi nhận hàng (COD)" />
              <FormControlLabel value="VISA" control={<Radio />} label="Chuyển khoản (PayOS/QR)" />
            </RadioGroup>
          </FormControl>

          {localError && (
            <Typography color="error" variant="body2" sx={{ mb: 2, fontWeight: 'bold' }}>
              {localError}
            </Typography>
          )}

          <form onSubmit={handleNewAddressSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField required id="name" name="name" label="Họ và tên" fullWidth autoComplete="given-name" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField required id="phoneNumber" name="phoneNumber" label="Số điện thoại" fullWidth autoComplete="tel" />
              </Grid>
              <Grid item xs={12}>
                <TextField required id="streetAddress" name="streetAddress" label="Địa chỉ cụ thể (Số nhà, đường...)" fullWidth multiline rows={2} />
              </Grid>
              <Grid item xs={12} >
                <TextField required id="city" name="city" label="Tỉnh / Thành phố" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <Button
                  sx={{ padding: ".9rem 1.5rem" }}
                  size="large"
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Tiếp tục đến bước xác nhận
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
}