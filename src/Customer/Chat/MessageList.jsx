import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, useTheme } from '@mui/material';
import './Chat.css';

const MessageList = () => {
  const { auth, chat } = useSelector((store) => store);
  const messagesEndRef = useRef(null);
  const theme = useTheme();

  const isDarkMode = theme.palette.mode === 'dark';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.messages]);

  if (!auth.user) {
    return null;
  }

  return (
    <Box
      className="chat-message-list"
      sx={{
        bgcolor: isDarkMode ? 'background.paper' : '#f7fafc',
        color: 'text.primary'
      }}
    >
      {chat.messages.map((msg) => {
        const isSentByMe = msg.sender.id === auth.user.id;
        const senderName = isSentByMe ? "Bạn" : msg.sender.name;

        return (
          <Box
            key={msg.id}
            className={`message-bubble ${isSentByMe ? 'message-sent' : 'message-received'}`}
            sx={{
              bgcolor: isSentByMe
                ? 'primary.main'
                : isDarkMode ? 'grey.800' : 'grey.200',

              color: isSentByMe
                ? 'primary.contrastText'
                : isDarkMode ? 'common.white' : 'text.primary',
            }}
          >
            {!isSentByMe && (
              <Typography variant="caption" className="message-sender" sx={{ color: isDarkMode ? 'grey.400' : 'text.secondary' }}>
                {senderName}
              </Typography>
            )}

            <Typography variant="body1">
              {msg.content}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                display: 'block',
                textAlign: 'right',
                opacity: 0.7,
                mt: 0.5,
                color: 'inherit'
              }}
            >
              {new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </Box>
        );
      })}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default MessageList;