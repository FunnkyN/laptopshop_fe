import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
    Bars3Icon,
    ShoppingBagIcon,
    XMarkIcon,
    PhotoIcon
} from "@heroicons/react/24/outline";
import image_centered_icon from '../../image_centered_icon.png';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import { navigation } from "../../Config/navigationMenu.js";
import AuthModal from "../Auth/AuthModal.jsx";
import { useDispatch, useSelector } from "react-redux";
import { deepPurple } from "@mui/material/colors";
import { getUser, logout } from "../../Redux/Auth/Action.js";
import { getCart } from "../../Redux/Customers/Cart/Action.js";
import './index.css'

import ChatIcon from "../Chat/ChatIcon.jsx";
import ChatWindow from "../Chat/ChatWindow.jsx";
import api from "../../Config/api.js";
import { setActiveConversation, getMessages, resetUnreadCount } from "../../Redux/Chat/Action.js";

export default function Navigation() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { auth, cart, chat } = useSelector((store) => store);
    const [openAuthModal, setOpenAuthModal] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const openUserMenu = Boolean(anchorEl);
    const jwt = localStorage.getItem("jwt");
    const location = useLocation();

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [adminInfo, setAdminInfo] = useState(null);

    // --- 1. Load User & Cart ---
    useEffect(() => {
        if (jwt) {
            dispatch(getUser(jwt));
            dispatch(getCart(jwt));
        }
    }, [jwt, dispatch]);

    // --- 2. Load Admin Info cho Chat ---
    useEffect(() => {
        if (jwt && auth.user && !adminInfo) {
            const fetchAdminInfo = async () => {
                try {
                    const { data } = await api.get('/api/users/admin');
                    setAdminInfo(data);
                } catch (error) {
                    console.error(error);
                }
            };
            fetchAdminInfo();
        }
    }, [jwt, auth.user, adminInfo]);

    // --- Logic Chat ---
    const handleOpenChat = async () => {
        if (!auth.user) {
            alert("Bạn cần đăng nhập để sử dụng tính năng chat.");
            setOpenAuthModal(true);
            return;
        }
        if (!adminInfo) {
            alert("Hệ thống đang kết nối, vui lòng thử lại sau giây lát.");
            return;
        }
        setIsChatOpen(true);
        dispatch(resetUnreadCount());
        try {
            const { data: conversation } = await api.get(`/api/conversations/with/${adminInfo.id}`);
            dispatch(setActiveConversation(conversation));
            dispatch(getMessages(conversation.id));
        } catch (error) {
            console.error(error);
        }
    };

    const handleCloseChat = () => {
        setIsChatOpen(false);
        dispatch(setActiveConversation(null));
    };

    // --- Logic Menu User ---
    const handleUserClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorEl(null);
    };

    const handleOpen = () => {
        setOpenAuthModal(true);
    };
    const handleClose = () => {
        setOpenAuthModal(false);
    };

    // --- Logic Search ---
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            setOpen(false);
            navigate(`/laptops/search?search=${inputValue}`);
        }
    };

    // --- Logic Auth Modal ---
    useEffect(() => {
        if (auth.user) {
            handleClose();
            if (location.pathname === "/login" || location.pathname === "/signup") {
                navigate("/");
            }
        } else if (location.pathname === "/login" || location.pathname === "/signup") {
            setOpenAuthModal(true);
        }
    }, [auth.user, location.pathname, navigate]);

    // --- Logic Scroll Header ---
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        handleCloseUserMenu();
        dispatch(logout());
        navigate("/");
        setOpen(false);
    };

    const handleMyOrderClick = () => {
        handleCloseUserMenu();
        navigate("/account/order");
        setOpen(false);
    };

    const handleAdminClick = () => {
        handleCloseUserMenu();
        navigate("/admin");
    };

    const handleMobileNavigate = (path) => {
        navigate(path);
        setOpen(false);
    };

    return (
        <div className="bg-white pb-6">
            {/* Mobile menu */}
            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-40 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                                {/* Close Button */}
                                <div className="flex px-4 pb-2 pt-5">
                                    <button
                                        type="button"
                                        className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                                        onClick={() => setOpen(false)}
                                    >
                                        <span className="sr-only">Close menu</span>
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>

                                {/* ========================================================= */}
                                {/* CUSTOM MOBILE MENU CONTENT */}
                                {/* ========================================================= */}

                                {/* 1. User Profile Section */}
                                {auth.user ? (
                                    <div className="px-6 py-4 flex items-center gap-4 mb-2">
                                        <Avatar
                                            sx={{
                                                bgcolor: deepPurple[500],
                                                color: "white",
                                                width: 48,
                                                height: 48,
                                                fontSize: '1.25rem'
                                            }}
                                        >
                                            {auth.user.name ? auth.user.name[0].toUpperCase() : "U"}
                                        </Avatar>
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="font-bold text-gray-900 text-sm truncate">
                                                {auth.user.name}
                                            </span>
                                            <span className="text-gray-500 text-xs truncate">
                                                {auth.user.email}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="px-6 py-4 mb-2">
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            fullWidth 
                                            onClick={() => {
                                                handleOpen();
                                                setOpen(false);
                                            }}
                                        >
                                            Đăng nhập / Đăng ký
                                        </Button>
                                    </div>
                                )}

                                {/* 2. Main Navigation Links (Đã xóa Giới thiệu & Liên hệ) */}
                                <div className="space-y-1 px-4">
                                    <div
                                        onClick={() => handleMobileNavigate("/")}
                                        className="block rounded-lg px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 cursor-pointer"
                                    >
                                        Trang chủ
                                    </div>
                                    
                                    <div
                                        onClick={() => handleMobileNavigate("/blogs")}
                                        className="block rounded-lg px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 cursor-pointer"
                                    >
                                        Tin tức
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-200 my-4 mx-4" />

                                {/* 3. User Actions (Order, Logout) */}
                                {auth.user && (
                                    <div className="space-y-1 px-4">
                                        <div
                                            onClick={handleMyOrderClick}
                                            className="block rounded-lg px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 cursor-pointer"
                                        >
                                            Đơn hàng của tôi
                                        </div>
                                        <div
                                            onClick={handleLogout}
                                            className="block rounded-lg px-4 py-3 text-base font-bold text-red-600 hover:bg-red-50 cursor-pointer"
                                        >
                                            Đăng xuất
                                        </div>
                                    </div>
                                )}

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* Desktop Header */}
            <header className={`${isScrolled ? "fixed animation-slide-down w-full shadow-md" : "relative"} z-50 bg-white`}>
                <nav aria-label="Top" className="mx-auto">
                    <div className="border-b border-gray-200">
                        <div className="flex h-16 items-center justify-between px-4 lg:px-11">
                            {/* Mobile menu button */}
                            <button
                                type="button"
                                className="rounded-md bg-white p-2 text-gray-400 lg:hidden"
                                onClick={() => setOpen(true)}
                            >
                                <span className="sr-only">Open menu</span>
                                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                            </button>

                            {/* Logo */}
                            <div className="ml-4 flex lg:ml-0">
                                <Link to="/">
                                    <span className="sr-only">ADAYROILAPTOP</span>
                                    <img
                                        src={image_centered_icon}
                                        alt="Laptop Shop icon"
                                        className="h-8 lg:h-12 w-auto"
                                    />
                                </Link>
                            </div>

                            {/* Search Bar */}
                            <div className="hidden md:flex relative flex-1 max-w-lg ml-6">
                                <div className="flex items-center w-full">
                                    <input
                                        type="text"
                                        className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 focus:ring-[#9155FD] focus:border-[#9155FD] outline-none"
                                        placeholder="Tìm kiếm sản phẩm..."
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                    />
                                    <button
                                        onClick={() => navigate(`/laptops/search?search=${inputValue}`)}
                                        className="absolute right-2 p-1 text-gray-400 hover:text-[#9155FD]"
                                    >
                                        <PhotoIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Right Icons */}
                            <div className="flex items-center ml-auto">
                                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                                    {auth?.user ? (
                                        <div>
                                            <Avatar
                                                className="text-white"
                                                onClick={handleUserClick}
                                                aria-controls={openUserMenu ? "basic-menu" : undefined}
                                                aria-haspopup="true"
                                                aria-expanded={openUserMenu ? "true" : undefined}
                                                sx={{
                                                    bgcolor: deepPurple[500],
                                                    color: "white",
                                                    cursor: "pointer",
                                                    width: 36,
                                                    height: 36
                                                }}
                                            >
                                                {auth.user?.name ? auth.user.name[0].toUpperCase() : "U"}
                                            </Avatar>
                                            <Menu
                                                id="basic-menu"
                                                anchorEl={anchorEl}
                                                open={openUserMenu}
                                                onClose={handleCloseUserMenu}
                                                MenuListProps={{
                                                    "aria-labelledby": "basic-button",
                                                }}
                                            >
                                                {auth.user?.role === "ADMIN" &&
                                                    <MenuItem onClick={handleAdminClick}>
                                                        Trang quản trị
                                                    </MenuItem>
                                                }
                                                <MenuItem onClick={handleMyOrderClick}>
                                                    Quản lý đơn hàng
                                                </MenuItem>
                                                <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
                                            </Menu>
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={handleOpen}
                                            className="text-sm font-medium text-gray-700 hover:text-gray-800"
                                            sx={{ color: '#000', fontWeight: '600' }}
                                        >
                                            Đăng nhập
                                        </Button>
                                    )}
                                </div>

                                <div className="ml-4 flow-root lg:ml-6">
                                    <Button
                                        onClick={() => navigate("/cart")}
                                        className="group -m-2 flex items-center p-2"
                                        sx={{ color: 'inherit' }}
                                    >
                                        <ShoppingBagIcon
                                            className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-[#9155FD] transition-colors"
                                            aria-hidden="true"
                                        />
                                        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                                            {cart.cart?.length || 0}
                                        </span>
                                        <span className="sr-only">items in cart, view bag</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

            <AuthModal handleClose={handleClose} open={openAuthModal} />

            {auth.user && <ChatIcon onClick={handleOpenChat} unreadCount={chat?.unreadCount || 0} />}

            <ChatWindow open={isChatOpen} handleClose={handleCloseChat} />
        </div>
    );
}