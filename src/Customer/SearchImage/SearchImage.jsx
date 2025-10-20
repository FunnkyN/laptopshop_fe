import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
// SỬA DÒNG NÀY: Dùng ../../ thay vì ../../../
import { AI_API_BASE_URL } from "../../Config/api"; 

export default function SearchImage({ setValue }) {
  const [image, setImage] = useState(null);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("image", file);

      try {
        // Sử dụng biến đã import
        const res = await axios.post(
          `${AI_API_BASE_URL}/data/search`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "ngrok-skip-browser-warning": "true",
            },
          }
        );

        if (res.data) {
          setValue(res.data);
        }

        console.log("image", res.data);
      } catch (error) {
        console.error("image", error);
      }
    }
  };

  return (
    <Box
      className="w-80 max-w-full aspect-video"
      sx={{
        border: "2px dashed #ccc",
        borderRadius: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#f9f9f9",
      }}
      onClick={() => document.getElementById("image-upload-input").click()}
    >
      {!image ? (
        <Box
          sx={{
            textAlign: "center",
            color: "#888",
          }}
        >
          <SearchIcon sx={{ fontSize: 40, mb: 1 }} />
          <Typography>Nhấn để tìm kiếm</Typography>
        </Box>
      ) : (
        <Box
          component="img"
          src={image}
          alt="Uploaded"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}
      <input
        id="image-upload-input"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: "none" }}
      />
    </Box>
  );
}