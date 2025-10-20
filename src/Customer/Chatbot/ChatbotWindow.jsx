import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import api from '../../Config/api';

const style = {
  position: 'absolute',
  bottom: '90px',
  right: '30px',
  width: '90vw',
  maxWidth: '450px',
  height: '70vh',
  maxHeight: '600px',
  bgcolor: 'background.paper',
  borderRadius: '1rem',
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
  transform: 'translateY(20px)',
  opacity: 0,
};

const openStyle = {
  ...style,
  transform: 'translateY(0)',
  opacity: 1,
};

const ChatbotWindow = ({ open, handleClose }) => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Chhào mừng bạn đến với LAPTOP Shop! 💻\nTôi là trợ lý AI chuyên về các dòng Laptop và Linh kiện máy tính. Bạn đang cần tìm dòng máy Gaming, Văn phòng hay Đồ họa? Hãy hỏi tôi nhé!' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addMessage = (sender, text) => {
    setMessages(prevMessages => [...prevMessages, { sender, text }]);
  };

  const sendMessageToAI = async (userMessage) => {
    setLoading(true);
    setError('');

    addMessage('user', userMessage);

    let queryPayload = userMessage;

    if (messages.length > 1) {
        const historyText = messages.map(msg => {
            const role = msg.sender === 'user' ? 'User' : 'Bot';
            return `${role}: ${msg.text}`;
        }).join('\n');

        queryPayload = `--- Bắt đầu lịch sử trò chuyện ---\n${historyText}\n--- Kết thúc lịch sử ---\n\nUser hỏi câu mới: ${userMessage}`;
    }

    const payload = {
        userQuery: queryPayload
    };

    try {
      const response = await api.post('/api/chatbot/ask', payload);

      if (!response.data || !response.data.response) {
         throw new Error('Phản hồi từ server không hợp lệ.');
      }

      const botResponseText = response.data.response;
      addMessage('bot', botResponseText);

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setError(`Đã xảy ra lỗi: ${errorMessage}. Vui lòng kiểm tra kết nối.`);
      addMessage('bot', `Rất tiếc, tôi đang gặp chút sự cố khi kết nối với máy chủ LAPTOP Shop. Bạn vui lòng thử lại sau nhé.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="chatbot-modal-title"
      aria-describedby="chatbot-modal-description"
      closeAfterTransition
    >
      <Box sx={open ? openStyle : style}>
        <div className="bg-blue-600 text-white p-3 rounded-t-xl shadow-md flex justify-between items-center">
          <h1 id="chatbot-modal-title" className="text-lg font-semibold text-center flex-1">
            Trợ lý ảo LAPTOP Shop
          </h1>
          <IconButton onClick={handleClose} size="small" sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </div>

        <ChatMessages messages={messages} />

        {error && (
          <div className="p-2 text-red-600 text-center text-sm bg-red-50 border-t border-red-200">
              {error}
          </div>
        )}

        <ChatInput onSendMessage={sendMessageToAI} loading={loading} />
      </Box>
    </Modal>
  );
};

export default ChatbotWindow;