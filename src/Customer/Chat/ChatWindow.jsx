import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import ConversationList from './ConversationList';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { setActiveConversation, sendMessage } from '../../Redux/Chat/Action';

const modalStyle = {
  position: 'absolute',
  bottom: { xs: 0, sm: '90px' },
  right: { xs: 0, sm: '30px' },
  width: { xs: '100%', sm: '400px' },
  height: { xs: '100%', sm: '600px' },
  bgcolor: 'background.paper',
  borderRadius: { xs: 0, sm: '1rem' },
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  transform: 'translateY(0)',
  opacity: 1,
};

const ChatWindow = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const { auth, chat } = useSelector((store) => store);

  const activeConversation = chat.activeConversation;

  const handleBackToConversations = () => {
    dispatch(setActiveConversation(null));
  };

  const handleSendMessage = (content) => {
    if (!activeConversation) return;

    const messageDTO = {
      conversationId: activeConversation.id,
      content: content,
    };
    dispatch(sendMessage(messageDTO));
  };

  const getHeaderName = () => {
    if (!activeConversation || !auth.user) return 'Danh sách Chat';

    return auth.user.role === 'ADMIN'
      ? activeConversation.user.name
      : activeConversation.admin.name;
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="chat-window-modal"
    >
      <Box sx={modalStyle}>
        <Box
          sx={{
            p: 1.5,
            bgcolor: 'primary.main',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {activeConversation && (
            <IconButton onClick={handleBackToConversations} size="small" sx={{ color: 'white' }}>
              <ArrowBackIcon />
            </IconButton>
          )}

          <Typography variant="h6" component="h2" sx={{ flex: 1, ml: activeConversation ? 1 : 0, textAlign: activeConversation ? 'left' : 'center' }}>
            {getHeaderName()}
          </Typography>

          <IconButton onClick={handleClose} size="small" sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        {chat.loading && !activeConversation ? (
          <Box display="flex" justifyContent="center" alignItems="center" flex={1}>
            <CircularProgress />
          </Box>
        ) : !activeConversation ? (
          <ConversationList />
        ) : (
          <>
            <MessageList />
            <MessageInput onSendMessage={handleSendMessage} loading={chat.loading} />
          </>
        )}
      </Box>
    </Modal>
  );
};

export default ChatWindow;