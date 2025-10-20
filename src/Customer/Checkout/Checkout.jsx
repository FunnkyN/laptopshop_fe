import * as React from "react";
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Button,
    Typography
} from "@mui/material";
import AddDeliveryAddressForm from "./AddAddress";
import {useLocation, useNavigate} from "react-router-dom";
import OrderSummary from "./OrderSummary";

const steps = [
    "Đăng nhập",
    "Chọn địa chỉ giao hàng và phương thức thanh toán",
    "Tổng quan đơn hàng",
    "Thanh toán",
];

export default function Checkout() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const step = parseInt(queryParams.get('step'), 10) || 2;

    const navigate = useNavigate();

    const handleBack = () => {
        navigate(`/checkout?step=${step - 1}`)
    };

    const stepperActiveStep = step > 0 ? step - 1 : 0;

    return (
        <Box className="px-5 lg:px-32 " sx={{width: "100%"}}>
            <Stepper activeStep={stepperActiveStep}>
                {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};

                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>

            <React.Fragment>
                <Box sx={{display: "flex", flexDirection: "row", pt: 2}}>
                    <Button
                        color="inherit"
                        disabled={step == 2}
                        onClick={handleBack}
                        sx={{mr: 1}}
                    >
                        Back
                    </Button>
                    <Box sx={{flex: "1 1 auto"}}/>
                </Box>
                <div className="my-5">
                    {step == 2 ? <AddDeliveryAddressForm /> : <OrderSummary/>}
                </div>
            </React.Fragment>

        </Box>
    );
}