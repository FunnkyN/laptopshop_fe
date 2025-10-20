import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
// 1. Bỏ import axios, thay bằng import api
import api, {API_BASE_URL} from "../Config/api"; 
import HomeCarousel from "../Customer/Carousel/HomeCarousel";
import HomeLaptopSection from "../Customer/Home/HomeLaptopSection";
import Laptop from "../Customer/Laptop/Laptop/Laptop";
import HomeBlogSection from "../Customer/Home/HomeBlogSection";

const Homepage = () => {
    const [hotDeals, setHotDeals] = useState([]);

    useEffect(() => {
        const fetchHotDeals = async () => {
            try {
                // 2. Sửa dòng này: Dùng api.get thay vì axios.get
                // api.get đã có sẵn Base URL và Header Ngrok
                const response = await api.get('/laptops/hotdeals');
                
                const deals = response.data
                .filter(item => item.status !== 0)
                .map(item => ({
                    id: item.id,
                    model: item.model,
                    originalPrice: item.price,
                    discountPercent: item.discountPercent > 0 ? item.discountPercent : null,
                    discountedPrice: item.price - (item.price * item.discountPercent) / 100,
                    // Lưu ý: Logic ghép chuỗi ảnh này vẫn giữ nguyên để truyền xuống Card
                    imageUrl: item.imageUrls && item.imageUrls.length > 0
                        ? `${API_BASE_URL}${item.imageUrls[0]}`
                        : "/images/default.jpg"
                }));
                setHotDeals(deals);
            } catch (error) {
                console.error("Failed to fetch hot deals:", error);
            }
        };
        fetchHotDeals();

        localStorage.removeItem('bannerClosed');
    }, []);

    return (
        <div className="">
            <HomeCarousel />

            <div className="space-y-10 py-20">
                {/* Dữ liệu hotDeals sẽ được truyền vào đây */}
                <HomeLaptopSection data={hotDeals} section={"Ưu đãi hấp dẫn"} />
            </div>

            <Laptop />

            <HomeBlogSection />

        </div>
    );
};

export default Homepage;