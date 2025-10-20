import React, { useState } from 'react';
import { Box, TextField, IconButton, useTheme } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const MessageInput = ({ onSendMessage, loading = false }) => {
  const [inputValue, setInputValue] = useState('');
  const theme = useTheme();

  const handleSend = () => {
    if (inputValue.trim() && !loading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      component="form"
      onSubmit={(e) => { e.preventDefault(); handleSend(); }}
      sx={{
        p: 2,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        placeholder="Nhập tin nhắn..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={loading}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '20px',
            bgcolor: theme.palette.mode === 'dark' ? 'action.hover' : 'common.white',
          },
        }}
      />
      <IconButton
        type="submit"
        color="primary"
        disabled={loading || !inputValue.trim()}
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default MessageInput;