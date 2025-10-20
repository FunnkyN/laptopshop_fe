import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Grid,
    TextField,
    Typography,
    Card,
    CardContent,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import { createPost, getPostById, updatePost } from "../../../Redux/Post/Action";
import { useNavigate, useParams } from "react-router-dom";
// [UPDATE] Import BlobImage & API_BASE_URL
import { API_BASE_URL } from "../../../Config/api";
import BlobImage from "../../../until/BlobImage";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
        ],
        ["link", "image"],
        ["clean"],
    ],
};

const formats = [
    "header",
    "bold", "italic", "underline", "strike", "blockquote",
    "list", "bullet", "indent",
    "link", "image",
];

const inputStyles = {
    "& .MuiInputBase-input": { color: "white" },
    "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#9155FD" },
    "& .MuiOutlinedInput-root": {
        "& fieldset": { borderColor: "rgba(255, 255, 255, 0.23)" },
        "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" },
        "&.Mui-focused fieldset": { borderColor: "#9155FD" },
    },
    "& .MuiFormHelperText-root": { color: "rgba(255, 255, 255, 0.5)" }
};

const CreatePostForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { postId } = useParams();

    const { post } = useSelector((store) => store);

    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState("");

    const formik = useFormik({
        initialValues: {
            title: "",
            shortDescription: "",
            content: "",
        },
        validationSchema: Yup.object({
            title: Yup.string().required("Tiêu đề không được để trống"),
            shortDescription: Yup.string().required("Mô tả ngắn không được để trống"),
            content: Yup.string().required("Nội dung bài viết không được để trống"),
        }),
        onSubmit: async (values) => {
            const postData = {
                data: {
                    title: values.title,
                    shortDescription: values.shortDescription,
                    content: values.content,
                },
                file: selectedImage,
            };

            if (postId) {
                postData.id = postId;
                await dispatch(updatePost(postData));
                alert("Cập nhật bài viết thành công!");
            } else {
                if (!selectedImage) {
                    alert("Vui lòng chọn ảnh đại diện cho bài viết!");
                    return;
                }
                await dispatch(createPost(postData));
                alert("Tạo bài viết thành công!");
            }
            navigate("/admin/posts");
        },
    });

    useEffect(() => {
        if (postId) {
            dispatch(getPostById(postId));
        }
    }, [postId, dispatch]);

    useEffect(() => {
        if (postId && post.post) {
            formik.setValues({
                title: post.post.title,
                shortDescription: post.post.shortDescription,
                content: post.post.content,
            });
            if (post.post.thumbnail) {
                const imageUrl = post.post.thumbnail.startsWith("http")
                    ? post.post.thumbnail
                    : `${API_BASE_URL}${post.post.thumbnail}`;
                setPreviewImage(imageUrl);
            }
        }
    }, [post.post, postId]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            // Khi chọn file local, ta vẫn dùng URL.createObjectURL
            // BlobImage sẽ tự phát hiện đây là blob local và hiển thị ngay
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    return (
        <div className="p-5">
            <div className="flex justify-between items-center mb-5">
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "white" }}>
                    {postId ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/admin/posts")}
                    sx={{
                        color: "white !important",
                        borderColor: "rgba(255, 255, 255, 0.5) !important",
                        "&:hover": {
                            borderColor: "white !important",
                            backgroundColor: "rgba(255, 255, 255, 0.1) !important"
                        }
                    }}
                >
                    Quay lại
                </Button>
            </div>

            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} lg={8}>
                        <Card className="mb-4" sx={{ bgcolor: "#1e1e2d" }}>
                            <CardContent className="space-y-4">
                                <TextField
                                    fullWidth
                                    id="title"
                                    name="title"
                                    label="Tiêu đề bài viết"
                                    variant="outlined"
                                    value={formik.values.title}
                                    onChange={formik.handleChange}
                                    error={formik.touched.title && Boolean(formik.errors.title)}
                                    helperText={formik.touched.title && formik.errors.title}
                                    sx={inputStyles}
                                />

                                <TextField
                                    fullWidth
                                    id="shortDescription"
                                    name="shortDescription"
                                    label="Mô tả ngắn (Hiển thị trên thẻ bài viết)"
                                    variant="outlined"
                                    multiline
                                    rows={3}
                                    value={formik.values.shortDescription}
                                    onChange={formik.handleChange}
                                    error={formik.touched.shortDescription && Boolean(formik.errors.shortDescription)}
                                    helperText={formik.touched.shortDescription && formik.errors.shortDescription}
                                    sx={inputStyles}
                                />
                            </CardContent>
                        </Card>

                        <Card sx={{ bgcolor: "#1e1e2d" }}>
                            <CardContent>
                                <Typography variant="h6" className="mb-2" sx={{ color: "white" }}>
                                    Nội dung chi tiết
                                </Typography>

                                <div style={{ height: "400px", marginBottom: "50px" }}>
                                    <ReactQuill
                                        theme="snow"
                                        value={formik.values.content}
                                        onChange={(value) => formik.setFieldValue("content", value)}
                                        modules={modules}
                                        formats={formats}
                                        style={{ height: "350px", color: "white" }}
                                    />
                                </div>
                                {formik.touched.content && formik.errors.content && (
                                    <Typography color="error" variant="caption">
                                        {formik.errors.content}
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} lg={4}>
                        <Card className="mb-4" sx={{ bgcolor: "#1e1e2d" }}>
                            <CardContent>
                                <Typography variant="h6" className="mb-3" sx={{ color: "white" }}>
                                    Ảnh đại diện (Thumbnail)
                                </Typography>

                                <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-800 transition relative h-64 flex items-center justify-center bg-transparent">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={handleImageChange}
                                        style={{ zIndex: 10 }}
                                    />
                                    {previewImage ? (
                                        // [UPDATE] Thay thế img bằng BlobImage
                                        <BlobImage
                                            src={previewImage}
                                            alt="Thumbnail"
                                            className="w-full h-full object-cover rounded-md"
                                        />
                                    ) : (
                                        <div className="text-gray-400">
                                            <UploadFileIcon sx={{ fontSize: 40 }} />
                                            <p>Nhấn để tải ảnh lên</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            size="large"
                            startIcon={<SaveIcon />}
                            sx={{
                                bgcolor: "#9155FD",
                                py: 1.5,
                                "&:hover": { bgcolor: "#7e4be0" }
                            }}
                        >
                            {postId ? "Cập nhật bài viết" : "Đăng bài viết"}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
};

export default CreatePostForm;