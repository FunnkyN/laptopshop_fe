import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, UserCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { API_BASE_URL } from '../../Config/api';
// 1. Import BlobImage
import BlobImage from '../../until/BlobImage';

const HomeBlogCard = ({ blog }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/blogs/${blog.id}`);
  };

  // Xử lý URL ảnh
  const imageUrl = blog.thumbnail
    ? (blog.thumbnail.startsWith('http') ? blog.thumbnail : `${API_BASE_URL}${blog.thumbnail}`)
    : ""; // Nếu không có ảnh thì để rỗng để BlobImage xử lý hoặc hiện placeholder

  const formattedDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString('vi-VN')
    : 'Mới cập nhật';

  return (
    <div
      onClick={handleNavigate}
      className="cursor-pointer group flex flex-col bg-white rounded-xl overflow-hidden h-full transition-all duration-300 hover:shadow-lg border border-gray-200 hover:border-gray-300"
    >
      {/* 2. Thay thế thẻ <img> bằng BlobImage */}
      <div className="h-48 w-full overflow-hidden relative bg-gray-100">
        <BlobImage
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={imageUrl}
          alt={blog.title}
        />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1.5">
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>{formattedDate}</span>
          </div>
          <span className="text-gray-300">•</span>
          <div className="flex items-center gap-1.5">
            <UserCircleIcon className="h-3.5 w-3.5" />
            <span>{blog.authorName || "Shop Admin"}</span>
          </div>
        </div>

        <h3
          className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-snug"
          title={blog.title}
        >
          {blog.title}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1 leading-relaxed">
          {blog.shortDescription}
        </p>

        <div className="flex items-center gap-2 text-indigo-600 text-sm font-semibold group/link">
          <span className="group-hover/link:underline">Đọc tiếp</span>
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
        </div>
      </div>
    </div>
  );
};

export default HomeBlogCard;