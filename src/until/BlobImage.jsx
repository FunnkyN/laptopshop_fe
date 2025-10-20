import React, { useState, useEffect } from "react";
import api, { API_BASE_URL } from "../Config/api";

const BlobImage = ({ src, alt, className, ...props }) => {
  const [imageSrc, setImageSrc] = useState("/images/default-placeholder.png"); // Ảnh mặc định nếu lỗi (bạn có thể để trống)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let objectUrl = null;

    const fetchImage = async () => {
      if (!src) {
        setLoading(false);
        return;
      }

      // 1. Nếu là ảnh base64 hoặc ảnh từ nguồn ngoài (không phải server mình), hiển thị luôn
      if (src.startsWith("data:") || (src.startsWith("http") && !src.includes("ngrok"))) {
        if (isMounted) {
            setImageSrc(src);
            setLoading(false);
        }
        return;
      }

      try {
        // 2. Xử lý đường dẫn để gọi qua API (có kèm header ngrok)
        let endpoint = src;
        
        // Nếu src có chứa domain (API_BASE_URL), ta cắt bỏ để lấy phần path
        // Ví dụ: https://ngrok.../images/1.jpg -> /images/1.jpg
        if (src.startsWith(API_BASE_URL)) {
            endpoint = src.replace(API_BASE_URL, "");
        } else if (src.startsWith("http")) {
             // Trường hợp URL tuyệt đối khác
             const url = new URL(src);
             endpoint = url.pathname;
        }

        // 3. Gọi API lấy Blob ảnh
        const response = await api.get(endpoint, {
          responseType: "blob", 
        });

        if (isMounted) {
          objectUrl = URL.createObjectURL(response.data);
          setImageSrc(objectUrl);
          setLoading(false);
        }
      } catch (error) {
        console.error("Lỗi tải ảnh qua Ngrok:", src);
        if (isMounted) setLoading(false);
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  // Trong lúc chờ tải có thể hiện loading hoặc skeleton nếu muốn
  if (loading) return <div className={`bg-gray-200 animate-pulse ${className}`} style={{ minHeight: '100px' }}></div>;

  return <img src={imageSrc} alt={alt} className={className} {...props} />;
};

export default BlobImage;