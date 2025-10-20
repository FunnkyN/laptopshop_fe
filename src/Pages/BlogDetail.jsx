import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Avatar, Button, CircularProgress, Chip } from '@mui/material';
import { CalendarIcon, ArrowLeftIcon, UserIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { getPostById } from '../Redux/Post/Action';
import { API_BASE_URL } from '../Config/api';
// 1. Import BlobImage
import BlobImage from '../until/BlobImage';

const BlogDetail = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { post } = useSelector(store => store);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (blogId) {
      dispatch(getPostById(blogId));
    }
    window.scrollTo(0, 0);
  }, [blogId, dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentPost = post.post;

  if (post.loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <CircularProgress />
        </div>
    );
  }

  if (!currentPost) {
    return (
        <div className="min-h-screen flex items-center justify-center flex-col gap-4">
            <Typography variant="h6">Không tìm thấy bài viết hoặc bài viết đã bị xóa.</Typography>
            <Button variant="outlined" onClick={() => navigate('/blogs')}>Quay lại danh sách</Button>
        </div>
    );
  }

  const thumbnailUrl = currentPost.thumbnail
    ? (currentPost.thumbnail.startsWith('http') ? currentPost.thumbnail : `${API_BASE_URL}${currentPost.thumbnail}`)
    : "";

  const formattedDate = currentPost.createdAt
    ? new Date(currentPost.createdAt).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  return (
    <>
      {/* Back Button */}
      <Box
        sx={{
          position: 'fixed',
          top: isScrolled ? '80px' : '100px',
          left: '24px',
          zIndex: 999,
          transition: 'all 0.3s ease'
        }}
      >
        <Button
          startIcon={<ArrowLeftIcon className="h-5 w-5"/>}
          onClick={() => navigate('/blogs')}
          sx={{
            bgcolor: isScrolled ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.15)',
            color: isScrolled ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.95)',
            fontWeight: 600,
            fontSize: '0.9rem',
            px: 3,
            py: 1.2,
            borderRadius: '12px',
            backdropFilter: 'blur(12px)',
            boxShadow: isScrolled ? '0 2px 8px rgba(0, 0, 0, 0.1)' : '0 2px 8px rgba(0, 0, 0, 0.3)',
            border: isScrolled ? '1px solid rgba(0, 0, 0, 0.05)' : '1px solid rgba(255, 255, 255, 0.15)',
            transition: 'all 0.3s ease',
            '&:hover': {
              bgcolor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.4)',
              color: isScrolled ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 1)',
              transform: 'translateX(-4px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
            }
          }}
        >
          Quay lại
        </Button>
      </Box>

      <Box
        sx={{
          bgcolor: 'grey.50',
          minHeight: '100vh',
          pb: 20,
          margin: 0,
          padding: 0,
          '& > *:first-of-type': {
            marginTop: 0
          }
        }}
      >

      {/* Hero Banner Section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '400px', md: '500px' },
          overflow: 'hidden',
          bgcolor: 'grey.900',
          mt: '-1px',
          mb: 0
        }}
      >
        {thumbnailUrl && (
          <>
            {/* 2. Thay thế <img> bằng BlobImage cho Banner */}
            <BlobImage
              src={thumbnailUrl}
              alt={currentPost.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                position: 'absolute', // Cần absolute để khớp với layout cũ
                top: 0,
                left: 0
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.5) 100%)'
              }}
            />
          </>
        )}

        {/* Content Overlay */}
        <Container
          maxWidth="lg"
          sx={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            pb: 8,
            px: { xs: 3, md: 4 }
          }}
        >
          <Box
            sx={{
              maxWidth: '1000px',
              margin: '0 auto',
              textAlign: 'center'
            }}
          >
            <Box display="flex" justifyContent="center" mb={2}>
              <Chip
                label="Tin tức & Blog"
                size="small"
                sx={{
                  bgcolor: 'rgba(16, 185, 129, 0.95)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  letterSpacing: '0.5px',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              />
            </Box>

            <Typography
              variant="h3"
              component="h1"
              fontWeight="bold"
              sx={{
                fontSize: { xs: '1.75rem', md: '2.75rem', lg: '3.25rem' },
                lineHeight: 1.3,
                mb: 4,
                color: '#ffffff',
                textShadow: '0 4px 12px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.4)',
                px: { xs: 2, md: 4 }
              }}
            >
              {currentPost.title}
            </Typography>

            <Box
              display="flex"
              flexWrap="wrap"
              gap={3}
              alignItems="center"
              justifyContent="center"
              sx={{
                '& > *': {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: '#ffffff',
                  fontSize: '1rem',
                  fontWeight: 600,
                  textShadow: '0 2px 8px rgba(0,0,0,0.6)',
                  px: 2,
                  py: 1,
                  bgcolor: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: 2,
                  backdropFilter: 'blur(8px)'
                }
              }}
            >
              <Box>
                <UserIcon className="h-5 w-5" />
                <Typography variant="body2" fontWeight={600}>
                  {currentPost.authorName || "Shop Admin"}
                </Typography>
              </Box>

              <Box>
                <CalendarIcon className="h-5 w-5" />
                <Typography variant="body2" fontWeight={600}>
                  {formattedDate}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content Body */}
      <Container maxWidth="lg" sx={{ mt: -8, position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            bgcolor: 'white',
            borderRadius: 3,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              p: 4,
              borderBottom: '1px solid',
              borderColor: 'grey.200',
              bgcolor: 'grey.50'
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 56,
                  height: 56,
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}
              >
                {currentPost.authorName ? currentPost.authorName[0].toUpperCase() : "A"}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {currentPost.authorName || "Shop Admin"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Laptop Shop News • Chuyên gia tư vấn công nghệ
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ p: { xs: 3, md: 6 } }}>
            {currentPost.shortDescription && (
              <Box
                sx={{
                  mb: 6,
                  pl: 3,
                  borderLeft: '4px solid',
                  borderColor: 'primary.main',
                  py: 2
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontStyle: 'italic',
                    color: 'text.secondary',
                    lineHeight: 1.8,
                    fontSize: { xs: '1.1rem', md: '1.25rem' }
                  }}
                >
                  {currentPost.shortDescription}
                </Typography>
              </Box>
            )}

            <Box
              className="prose prose-lg max-w-none post-content"
              sx={{
                '& p': { mb: 3, lineHeight: 1.8, fontSize: '1.05rem', color: 'text.primary' },
                '& h2': { mt: 6, mb: 3, fontSize: '1.75rem', fontWeight: 700, color: 'text.primary' },
                '& h3': { mt: 4, mb: 2, fontSize: '1.5rem', fontWeight: 600, color: 'text.primary' },
                '& img': { borderRadius: 2, my: 4, width: '100%', height: 'auto' },
                '& ul, & ol': { pl: 4, mb: 3 },
                '& li': { mb: 1.5 },
                '& blockquote': {
                  borderLeft: '4px solid',
                  borderColor: 'primary.light',
                  pl: 3,
                  py: 2,
                  my: 4,
                  fontStyle: 'italic',
                  bgcolor: 'grey.50',
                  borderRadius: 1
                }
              }}
            >
              <div dangerouslySetInnerHTML={{ __html: currentPost.content }} />
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            mt: 8,
            mb: 12,
            p: 6,
            bgcolor: 'white',
            borderRadius: 3,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            border: '2px solid',
            borderColor: 'grey.200'
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            fontWeight="bold"
            color="text.primary"
            mb={2}
          >
            Bạn quan tâm đến các sản phẩm Laptop?
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            mb={4}
          >
            Khám phá bộ sưu tập laptop chất lượng cao với giá tốt nhất
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/')}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              px: 5,
              py: 1.5,
              fontWeight: 'bold',
              fontSize: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                bgcolor: 'primary.dark',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
                transform: 'translateY(-2px)',
                transition: 'all 0.3s ease'
              }
            }}
          >
            Xem danh sách sản phẩm ngay
          </Button>
        </Box>
      </Container>
    </Box>
    </>
  );
};

export default BlogDetail;