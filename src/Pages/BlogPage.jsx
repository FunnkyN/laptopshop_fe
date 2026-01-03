import React, { useEffect } from 'react';
import { Container, Grid, Box, Typography, Breadcrumbs, Link, CircularProgress } from '@mui/material';
import HomeBlogCard from '../Customer/Home/HomeBlogCard';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '../Redux/Post/Action';

const BlogPage = () => {
  confirm

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Container maxWidth="lg">
        {}
        <Box mb={4}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" onClick={() => navigate('/')} className="cursor-pointer">
              Trang chủ
            </Link>
            <Typography color="text.primary">Tin tức công nghệ</Typography>
          </Breadcrumbs>
        </Box>

        {}
        <Box mb={6} textAlign="center">
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
            Blog & Tin Tức
          </Typography>
          <Typography variant="body1" color="text.secondary" maxWidth="600px" mx="auto">
            Cập nhật những xu hướng công nghệ mới nhất, đánh giá sản phẩm và các thủ thuật hữu ích dành cho tín đồ Laptop & PC.
          </Typography>
        </Box>

        {}
        {post.loading ? (
             <Box display="flex" justifyContent="center" mt={8}>
                <CircularProgress />
             </Box>
        ) : (
            <Grid 
             <Box mb={6} textAlign="center">
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
            Blog & Tin Tức
          </Typography>container spacing={4}>
            {post.posts && post.posts.length > 0 ? (
                post.posts.map((blog) => (
                    <Grid item key={blog.id} xs={12} sm={6} md={4} lg={3}>
                    <div className="h-full">
                        <HomeBlogCard blog={blog} />
                    </div>
                    </Grid>
                ))
            ) : (
                <Box width="100%" textAlign="center" py={5}>
                    <Typography>Hiện chưa có bài viết nào.</Typography>
                </Box>
            )}
            </Grid>
        )}
         <Box mb={6} textAlign="center">
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
            Blog & Tin Tức
          </Typography>
      </Container>
    </div>
  );
};

export default BlogPage;