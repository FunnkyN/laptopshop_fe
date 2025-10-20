import React from 'react';
import Fab from '@mui/material/Fab';

const ChatbotButton = ({ onClick }) => {
  const iconPath = '/images/icon/chat-bot-icon.png';

  return (
    <Fab
      aria-label="chat"
      onClick={onClick}
      sx={{
        position: 'fixed',
        bottom: (theme) => theme.spacing(4),
        right: (theme) => theme.spacing(4),
        zIndex: 1000,

        backgroundImage: `url(${iconPath})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: 0,
        border: 'none',

        width: 56,
        height: 56,
      }}
    >
    </Fab>
  );
};

export default ChatbotButton;