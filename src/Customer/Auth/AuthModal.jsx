import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import SignupForm from "./Signup";
import LoginForm from "./Login";

const style = {
    position: "relative",
    margin: "auto",
    width: "100%",
    maxWidth: 500,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
};

export default function AuthModal({ handleClose, open }) {
    const location = useLocation();
    const { auth } = useSelector((store) => store);

    useEffect(() => {
        if (auth.user) handleClose();
    }, [auth.user, handleClose]);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                padding: 2,
            }}
        >
            <Box className="rounded-md" sx={style}>
                <Box
                    sx={{
                        maxHeight: "90vh",
                        overflowY: "auto",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        padding: 2,
                        boxSizing: "border-box",
                        "&::-webkit-scrollbar": {
                            display: "none",
                        },
                    }}
                >
                    {location.pathname === "/signup" ? (
                        <SignupForm />
                    ) : (
                        <LoginForm />
                    )}
                </Box>
            </Box>
        </Modal>
    );
}

