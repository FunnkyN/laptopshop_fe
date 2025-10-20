import React, { useEffect } from 'react';
import { Grid, Paper, Box, Typography, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import ConversationList from '../../../Customer/Chat/ConversationList';
import MessageList from '../../../Customer/Chat/MessageList';
import MessageInput from '../../../Customer/Chat/MessageInput';
import { sendMessage, getConversations } from '../../../Redux/Chat/Action';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const AdminChat = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { chat } = useSelector(store => store);

  useEffect(() => {
      dispatch(getConversations());
  }, [dispatch]);

  const handleSendMessage = (content) => {
    if (chat.activeConversation) {
      dispatch(sendMessage({
        conversationId: chat.activeConversation.id,
        content: content
      }));
    }
  };

  return (
    <Box sx={{ p: 2, height: '85vh' }}>
      <Paper
        elevation={3}
        sx={{
          height: '100%',
          display: 'flex',
          overflow: 'hidden',
          bgcolor: theme.palette.background.paper,
          borderRadius: '12px',
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <Grid container sx={{ height: '100%' }}>
          <Grid item xs={12} md={4} lg={3} sx={{ borderRight: 1, borderColor: 'divider', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'primary.main', color: theme.palette.mode === 'dark' ? 'text.primary' : 'white' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                <ChatBubbleOutlineIcon /> Danh sách hội thoại
              </Typography>
            </Box>
            <Box sx={{ flex: 1, overflow: 'hidden' }}>
                <ConversationList />
            </Box>
          </Grid>

          <Grid item xs={12} md={8} lg={9} sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: theme.palette.mode === 'dark' ? 'background.default' : '#f5f7fa' }}>
             {chat.activeConversation ? (
                <>
                   <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: theme.palette.background.paper, boxShadow: 1, zIndex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {chat.activeConversation.user.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Khách hàng
                      </Typography>
                   </Box>
                   <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <MessageList />
                   </Box>
                   <Box sx={{ bgcolor: theme.palette.background.paper }}>
                        <MessageInput onSendMessage={handleSendMessage} />
                   </Box>
                </>
             ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column', opacity: 0.7 }}>
                   <ChatBubbleOutlineIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                   <Typography variant="h6" color="text.secondary">
                     Chọn một khách hàng để bắt đầu hỗ trợ
                   </Typography>
                </Box>
             )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AdminChat;