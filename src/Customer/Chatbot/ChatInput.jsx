import React, { useState, useEffect } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { Box, LinearProgress, Typography } from '@mui/material';

const ChatInput = ({ onSendMessage, loading }) => {
  const [inputValue, setInputValue] = useState('');
  const [progress, setProgress] = useState(0);

  // Hiệu ứng giả lập thanh tiến trình: Tăng dần ngẫu nhiên đến 90% trong khoảng 15s
  useEffect(() => {
    let timer;
    if (loading) {
      setProgress(0);
      timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress >= 90) {
            return 90; // Dừng ở 90% đợi phản hồi thật
          }

          // Tính toán để đạt 90% trong ~15s (với interval 500ms -> cần 30 bước)
          // Trung bình mỗi bước cần tăng: 90 / 30 = 3%

          // Để tạo cảm giác "nhanh chậm" tự nhiên:
          // Random từ 0.5% (chậm) đến 5.5% (nhanh) -> Trung bình là 3%
          const diff = Math.random() * 5 + 0.5;

          return Math.min(oldProgress + diff, 90);
        });
      }, 500); // Cập nhật mỗi 0.5s
    } else {
      setProgress(0); // Reset khi xong
    }

    return () => {
      clearInterval(timer);
    };
  }, [loading]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

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
    <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">

      {loading && (
        <Box sx={{ width: '100%', mb: 2, animation: 'fadeIn 0.3s' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
             <Typography variant="caption" sx={{ color: '#1976d2', fontWeight: 600, fontStyle: 'italic' }}>
                <i className="fa-solid fa-circle-notch fa-spin mr-2"></i>
                Đang truy vấn dữ liệu, vui lòng chờ trong giây lát...
             </Typography>
             <Typography variant="caption" color="text.secondary">
                {Math.round(progress)}%
             </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              borderRadius: 5,
              height: 6,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#1976d2',
                borderRadius: 5,
                transition: 'transform 0.5s linear'
              }
            }}
          />
        </Box>
      )}

      <div className="flex items-center space-x-3">
        <input
          type="text"
          id="userInput"
          placeholder={loading ? "Vui lòng đợi giây lát..." : "Nhập tin nhắn của bạn..."}
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={loading}
          className={`flex-1 border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${loading ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
        />
        <button
          id="sendButton"
          onClick={handleSend}
          disabled={loading || !inputValue.trim()}
          className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-5 rounded-xl transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow active:bg-blue-800 ${loading || !inputValue.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;