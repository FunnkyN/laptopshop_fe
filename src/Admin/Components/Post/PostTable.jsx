import React, { useEffect } from "react";
import {
  Box,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deletePost, getAllPosts } from "../../../Redux/Post/Action";
// [UPDATE] Import BlobImage & API_BASE_URL
import { API_BASE_URL } from "../../../Config/api";
import BlobImage from "../../../until/BlobImage";

const PostTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { post } = useSelector((store) => store);

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  const handleUpdatePost = (postId) => {
    navigate(`/admin/posts/update/${postId}`);
  };

  return (
    <Box width={"100%"}>
      <Card className="mt-2">
        <CardHeader
          title="Quản lý bài viết"
          action={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreatePost}
              sx={{ bgcolor: "#9155FD" }}
            >
              Thêm bài viết
            </Button>
          }
          sx={{
            pt: 2,
            alignItems: "center",
            "& .MuiCardHeader-action": { mt: 0.6 },
          }}
        />
        <TableContainer>
          <Table sx={{ minWidth: 800 }} aria-label="table in dashboard">
            <TableHead>
              <TableRow>
                <TableCell>Hình ảnh</TableCell>
                <TableCell>Tiêu đề</TableCell>
                <TableCell>Tác giả</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {post.posts && post.posts.length > 0 ? (
                post.posts.map((item) => (
                  <TableRow
                    hover
                    key={item.id}
                    sx={{ "&:last-of-type td, &:last-of-type th": { border: 0 } }}
                  >
                    <TableCell>
                      {/* [UPDATE] Thay thế Avatar bằng BlobImage */}
                      <div style={{ width: 80, height: 50, borderRadius: 4, overflow: 'hidden' }}>
                          <BlobImage
                            src={item.thumbnail ? `${API_BASE_URL}${item.thumbnail}` : ""}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                      </div>
                    </TableCell>

                    <TableCell sx={{ py: (theme) => `${theme.spacing(0.5)} !important` }}>
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: "0.875rem !important",
                            display: '-webkit-box',
                            overflow: 'hidden',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                            maxWidth: '300px'
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
                           {item.shortDescription ? item.shortDescription.substring(0, 50) + "..." : ""}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>{item.authorName || "Admin"}</TableCell>

                    <TableCell>
                        {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                    </TableCell>

                    <TableCell sx={{ textAlign: "center" }}>
                      <IconButton onClick={() => handleUpdatePost(item.id)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeletePost(item.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: "center", py: 5 }}>
                    <Typography variant="body1" color="text.secondary">
                        Chưa có bài viết nào. Hãy thêm bài viết mới!
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};
export default PostTable;