import React from 'react';
import "./LaptopCard.css";
import {useNavigate} from "react-router-dom";
import {API_BASE_URL} from "../../../Config/api";
import BlobImage from "../../../until/BlobImage";

const LaptopCard = ({laptop}) => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(`/PC/${laptop?.id || laptop?._id || 2}`)
    }

    const rawUrl = laptop.imageUrls && laptop.imageUrls.length > 0 ? laptop.imageUrls[0] : "";
    const imageUrl = rawUrl.startsWith("http") ? rawUrl : `${API_BASE_URL}${rawUrl}`;

    return (
        <div 
            onClick={handleNavigate} 
            className='laptopCard w-full border rounded-lg overflow-hidden bg-white cursor-pointer hover:shadow-lg transition-all duration-300 group'
        >
            {/* Ảnh sản phẩm */}
            <div className="h-36 sm:h-[13rem] w-full flex justify-center items-center bg-gray-50 p-2">
                <BlobImage
                    className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-300"
                    src={imageUrl}
                    alt={laptop?.model}
                />
            </div>
            
            {/* Phần thông tin */}
            <div className="p-2 sm:p-4 flex flex-col gap-1">
                {/* Giá và Giảm giá */}
                <div className="flex flex-wrap items-center gap-1 sm:space-x-2 h-5 overflow-hidden">
                    <p className="text-xs text-gray-500 line-through truncate">
                        {laptop?.price?.toLocaleString('vi-VN')}đ
                    </p>
                    {laptop?.discountPercent > 0 && (
                        <span className="text-[10px] sm:text-xs text-red-600 font-bold bg-red-100 px-1 rounded whitespace-nowrap">
                            -{laptop?.discountPercent}%
                        </span>
                    )}
                </div>
                
                <p className="text-red-600 font-bold text-sm sm:text-base">
                    {((100-laptop?.discountPercent)*laptop?.price/100)?.toLocaleString('vi-VN')}đ
                </p>
                
                {/* --- CHỈNH SỬA TÊN SẢN PHẨM TẠI ĐÂY --- */}
                {/* line-clamp-2: Tối đa 2 dòng */}
                {/* h-[2.5rem]: Chiều cao cố định (khoảng 40px), giúp các thẻ bằng nhau */}
                <h4 
                    className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2 text-ellipsis overflow-hidden h-[2.5rem] leading-tight"
                    title={laptop?.model} 
                >
                    {laptop?.model}
                </h4>
            </div>
        </div>
    );
};

export default LaptopCard;