import * as React from "react";
import { Grid, TextField, Button, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUser, login } from "../../Redux/Auth/Action";
import { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha"; // Import ReCAPTCHA

export default function LoginForm({ handleNext }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt");
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const { auth } = useSelector((store) => store);
    
    // State lưu token captcha
    const [recaptchaToken, setRecaptchaToken] = useState(""); 

    const handleCloseSnakbar = () => setOpenSnackBar(false);

    // Hàm callback khi user tick vào captcha
    const handleRecaptchaChange = (token) => {
        setRecaptchaToken(token);
    };

    useEffect(() => {
        if (jwt) {
            dispatch(getUser(jwt))
        }
    }, [dispatch, jwt])

    useEffect(() => {
        if (auth.user || auth.error) {
            setOpenSnackBar(true);
        }
    }, [auth.user, auth.error]);

   

        const data = new FormData(event.currentTarget);

        const userData = {
            email: data.get("email"),
            password: data.get("password"),
            recaptchaToken: recaptchaToken // Gửi token kèm theo
        }
        
        dispatch(login(userData));
        
        // Reset captcha sau khi submit để tránh dùng lại token cũ nếu lỗi
        setRecaptchaToken(""); 
        // Lưu ý: Nếu dùng useRef cho ReCAPTCHA, bạn có thể gọi ref.current.reset()
    };

    return (
        <div className=" shadow-lg "> 
            <form className="w-full" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            required
                            id="email"
                            name="email"
                            label="Email"
                            fullWidth
                            autoComplete="given-name"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                           assword"
                        />
                    </Grid>

                    {/* Phần hiển thị Captcha */}
                    <Grid item xs={12} className="flex justify-center">
                        <ReCAPTCHA
                            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY} 
                            onChange={handleRecaptchaChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            className="bg-[#9155FD] w-full"
                            type="submit"
                            variant="contained"
                            size="large"
                            sx={{ padding: ".8rem 0" }}
                        >
                            Login
                        </Button>
                    </Grid>
                </Grid>
            </form>
            {/* ... Phần footer và Snackbar giữ nguyên ... */}
             <div className="flex justify-center flex-col items-center">
                <div className="py-3 flex items-center">
                    <p className="m-0 p-0">Bạn không có tài khoản?</p>
                    <Button
                        onClick={() => navigate("/signup")}
                        className="ml-5"
                        size="small"
                        type="button"
                    >
                        Đăng ký
                    </Button>
                </div>
            </div>
            <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleCloseSnakbar}>
                <Alert onClose={handleCloseSnakbar} severity={auth.error ? "error" : "success"} sx={{ width: '100%' }}>
                    {auth.error
                        ? auth.error // Hiển thị lỗi từ backend (vd: Captcha không hợp lệ)
                        : (auth.user ? "Đăng nhập thành công !" : "")}
                </Alert>
            </Snackbar>
        </div>
    );
}