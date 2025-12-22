import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import CustomerRoutes from "./Routers/CustomerRoutes";
import AdminPanel from "./Admin/AdminPanel";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./Redux/Auth/Action";
import ChatbotButton from './Customer/Chatbot/ChatbotButton';
import ChatbotWindow from './Customer/Chatbot/ChatbotWindow';
import 'katex/dist/katex.min.css';
import stompService from './Config/stompClient';
import { receiveMessage } from './Redux/Chat/Action';

// 1. IMPORT COMPONENT MỚI Ở ĐÂY
import ScrollToTop from './ScrollToTop'; 

function App() {
  const { auth } = useSelector(store => store);
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    if (jwt) {
      dispatch(getUser(jwt));
    }
  }, [jwt, dispatch]);

 () => {
        console.log("App: Đã kết nối, đang đăng ký nhận tin nhắn...");
        stompService.subscribe(
          '/user/queue/messages',
          onMessageReceived
        );
      };  const { auth } = useSelector(store => store);
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const [isChatbot


      stompService.connect(jwt, onConnected, onError);
    }

    if (!auth.user) {
      stompService.disconnect();
    }

  }, [auth.user, jwt, dispatch]);

  const handleToggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };
  const { auth } = useSelector(store => store);
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const [isChatbot
  const handleCloseChatbot = () => {
    setIsChatbotOpen(false);
  }

  return (
    <div className="relative">
      {/* 2. ĐẶT COMPONENT VÀO ĐÂY */}
      <ScrollToTop /> 
      
     

      {!isAdminRoute && (
        <>
          <ChatbotButton onClick={handleToggleChatbot} />
          <ChatbotWindow open={isChatbotOpen} handleClose={handleCloseChatbot} />
        </>
      )}
    </div>
  );
}

export default App;