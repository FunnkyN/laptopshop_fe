import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import { getConversations, getMessages, setActiveConversation } from '../../Redux/Chat/Action';

const ConversationList = () => {
  const dispatch = useDispatch();
  const { auth, chat } = useSelector((store) => store);

  useEffect(() => {
    dispatch(getConversations());
  }, [dispatch]);

  const handleConversationClick = (conversation) => {
    dispatch(setActiveConversation(conversation));
    dispatch(getMessages(conversation.id));
  };

  const getOtherParticipantName = (conversation) => {
    if (!auth.user) return '...';

    if (auth.user.role === 'ADMIN') {
      return conversation.user.name;
    }
    return conversation.admin.name;
  };

  const getAvatarLetter = (conversation) => {
    const name = getOtherParticipantName(conversation);
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  if (chat.loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  if (!chat.conversations || chat.conversations.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%" p={3}>
        <Typography textAlign="center">
          Bạn chưa có cuộc hội thoại nào.
          {auth.user?.role !== 'ADMIN' && " Hãy liên hệ với Admin để bắt đầu."}
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper', overflowY: 'auto', flex: 1 }}>
      {chat.conversations.map((convo) => (
        <ListItemButton
          key={convo.id}
          alignItems="flex-start"
          onClick={() => handleConversationClick(convo)}
        >
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: deepPurple[500] }}>
              {getAvatarLetter(convo)}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={getOtherParticipantName(convo)}
            secondary={
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                Cập nhật: {new Date(convo.lastMessageAt).toLocaleString('vi-VN')}
              </Typography>
            }
          />
        </ListItemButton>
      ))}
    </List>
  );
};

export default ConversationList;