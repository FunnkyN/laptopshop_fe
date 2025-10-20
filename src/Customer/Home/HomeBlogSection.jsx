import React, { useEffect } from 'react';
import HomeBlogCard from './HomeBlogCard';
import { Button, CircularProgress } from '@mui/material';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getLatestPosts } from '../../Redux/Post/Action';

const HomeBlogSection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { post } = useSelector(store => store);

  useEffect(() => {
    dispatch(getLatestPosts(4));
  }, [dispatch]);

  return (
    <div className="relative px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-br from-gray-50 to-white rounded-2xl my-10 mx-4 lg:mx-14 border border-gray-200 shadow-sm">

      {}
      <div className="flex justify-between items-start mb-10">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Góc Công Nghệ
          </h2>
          <p className="text-base text-gray-600">
            Cập nhật tin tức, đánh giá và thủ thuật mới nhất về Laptop & PC
          </p>
        </div>

        {}
        <Button
          variant="outlined"
          endIcon={<ArrowRightAltIcon />}
          onClick={() => navigate('/blogs')}
          className="group"
          sx={{
            display: { xs: 'none', sm: 'flex' },
            color: '#4f46e5',
            borderColor: '#e0e7ff',
            backgroundColor: 'white',
            padding: '10px 24px',
            borderRadius: '10px',
            textTransform: 'none',
            fontSize: '15px',
            fontWeight: 600,
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: '#6366f1',
              backgroundColor: '#fafaff',
              color: '#4338ca',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)',
              '& .MuiSvgIcon-root': {
                transform: 'translateX(4px)',
              }
            },
            '& .MuiSvgIcon-root': {
              transition: 'transform 0.3s ease',
            }
          }}
        >
          Xem tất cả
        </Button>
      </div>

      {}
      {post.loading ? (
        <div className="flex justify-center py-10">
            <CircularProgress sx={{ color: '#6366f1' }} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {post.posts && post.posts.length > 0 ? (
                post.posts.slice(0, 4).map((blog) => (
                <div key={blog.id} className="h-full">
                    <HomeBlogCard blog={blog} />
                </div>
                ))
            ) : (
                <p className="col-span-full text-center text-gray-500">Chưa có bài viết nào.</p>
            )}
        </div>
      )}

      {}
      <div className="mt-8 text-center sm:hidden">
        <Button
          variant="outlined"
          fullWidth
          endIcon={<ArrowRightAltIcon />}
          onClick={() => navigate('/blogs')}
          sx={{
            color: '#4f46e5',
            borderColor: '#e0e7ff',
            backgroundColor: 'white',
            padding: '12px 24px',
            borderRadius: '10px',
            textTransform: 'none',
            fontSize: '15px',
            fontWeight: 600,
            '&:hover': {
              borderColor: '#6366f1',
              backgroundColor: '#fafaff',
            }
          }}
        >
          Xem tất cả bài viết
        </Button>
      </div>
    </div>
  );
};

export default HomeBlogSection;