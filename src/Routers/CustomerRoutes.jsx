import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import { customerTheme } from "../Admin/Theme/CustomTheme";
import Navigation from "../Customer/Navbar/Navigation";
import Footer from "../Customer/Footer/Footer";
import LaptopDetails from "../Customer/Laptop/LaptopDetails/LaptopDetails";
import Contact from "../Pages/Contact";
import TermsCondition from "../Pages/TermsCondition";
import PrivacyPolicy from "../Pages/PrivacyPolicy";
import About from "../Pages/About";
import Homepage from "../Pages/Homepage";
import Cart from "../Customer/Cart/Cart";
import Order from "../Customer/Orders/Order";
import OrderDetails from "../Customer/Orders/OrderDetails";
import Checkout from "../Customer/Checkout/Checkout";
import PaymentSuccess from "../Customer/PaymentSuccess/PaymentSuccess";
import RateLaptop from "../Customer/ReviewLaptop/RateLaptop";
import SearchLaptop from "../Customer/Laptop/Laptop/SearchLaptop";
import NotFound from "../Pages/NotFound";

import BlogPage from "../Pages/BlogPage";
import BlogDetail from "../Pages/BlogDetail";

const CustomerRoutes = () => {

    const showNavigation = true;
    const showFooter = true;
    );

    const routes = [
       s/search", element: <SearchLaptop /> },
        { path: "/home", element: <Homepage /> },
        { path: "/about", element: <About /> },
        { path: "/privacy-policy", element: <PrivacyPolicy /> },
        { path: "/terms-condition", element: <TermsCondition /> },
        { path: "/contact", element: <Contact /> },

        { path: "/PC/:laptopId", element: <LaptopDetails /> },
        { path: "/cart", element: <Cart /> },
        { path: "/account/order", element: <Order /> },
        { path: "/account/order/:orderId", element: <OrderDetails /> },
        { path: "/account/rate/:laptopId", element: <RateLaptop /> },
        { path: "/checkout", element: <Checkout /> },

        { path: "/payment/success", element: <PaymentSuccess /> },

        { path: "/*", element: <NotFound /> }
    ];
};

export default CustomerRoutes;