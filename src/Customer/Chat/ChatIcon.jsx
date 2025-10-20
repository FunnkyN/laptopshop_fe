import React from 'react';
import { Fab, Badge } from '@mui/material';

const ChatIcon = ({ onClick, unreadCount }) => {
  const iconPath = '/images/icon/message.png';

  return (
    <Badge
      badgeContent={unreadCount}
      color="error"
      overlap="circular"
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      sx={{
        position: 'fixed',
        bottom: 32,
        left: 32,
        zIndex: 1000,
        '& .MuiBadge-badge': {
          backgroundColor: '#f44336',
          color: 'white',
          border: '2px solid white',
          fontWeight: 'bold',
          zIndex: 1200,
          transform: 'translate(25%, -25%)',
        }
      }}
    >
      <Fab
        aria-label="chat"
        onClick={onClick}
        sx={{
          backgroundImage: `url(${iconPath})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: 56,
          height: 56,
          boxShadow: 3
        }}
      >
      </Fab>
    </Badge>
  );
};

export default ChatIcon;