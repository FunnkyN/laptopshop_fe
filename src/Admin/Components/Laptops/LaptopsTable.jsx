import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardHeader,
  Modal,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  useTheme,
  useMediaQuery,
  Fade,
  Backdrop
} from "@mui/material";

// Icons
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AppsIcon from '@mui/icons-material/Apps';

// Router & Redux
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteLaptop, findLaptops } from "../../../Redux/Admin/Laptop/Action";

// Components
import UpdateLaptopForm from "../UpdateLaptop/UpdateLaptop";
import BlobImage from "../../../until/BlobImage";
import { API_BASE_URL } from "../../../Config/api";

// --- 1. MODAL UPDATE NÂNG CẤP ---
const ModelUpdate = ({ open, handleClose, id }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: { backdropFilter: "blur(4px)" } // Hiệu ứng làm mờ nền
        },
      }}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "relative",
            bgcolor: "background.paper", // Tự động theo theme sáng/tối
            boxShadow: 24,
            borderRadius: isMobile ? 0 : 2,
            width: isMobile ? "100%" : "90%",
            maxWidth: "1200px",
            height: isMobile ? "100%" : "auto",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            outline: "none",
          }}
        >
          {/* Header của Modal */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
              bgcolor: "primary.main",
              color: "white"
            }}
          >
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
              Cập nhật sản phẩm
            </Typography>
            <IconButton onClick={handleClose} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Body của Modal (Scrollable) */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 0,
              "&::-webkit-scrollbar": { width: "6px" },
              "&::-webkit-scrollbar-thumb": { backgroundColor: "#ccc", borderRadius: "4px" },
            }}
          >
            <UpdateLaptopForm id={id} />
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

// --- 2. MAIN TABLE COMPONENT ---
const LaptopsTable = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { laptop } = useSelector((store) => store);

  // Lấy params từ URL
  const searchParams = new URLSearchParams(location.search);
  const availability = searchParams.get("availability");
  const category = searchParams.get("category");
  const sortPrice = searchParams.get("sortPrice");
  const pageNumber = parseInt(searchParams.get("page") || "1", 10);

  // State
  const [open, setOpen] = useState(false);
  const [updateId, setUpdateId] = useState(null);

  // Xử lý Pagination
  const handlePaginationChange = (event, value) => {
    searchParams.set("page", value);
    navigate({ search: `?${searchParams.toString()}` });
  };

  const handleClose = () => {
    setOpen(false);
    setUpdateId(null);
  };

  // Gọi API khi filter thay đổi
  useEffect(() => {
    const data = {
      category: category || "",
      colors: [],
      sizes: [],
      minPrice: 0,
      minDiscount: 0,
      sortPrice: sortPrice || "increase",
      page: pageNumber,
      pageSize: 10,
      stock: availability,
    };
    dispatch(findLaptops(data));
  }, [availability, category, sortPrice, pageNumber, laptop?.deleteLaptop, dispatch]);

  // Xử lý Xóa
  const handleDeleteLaptop = (laptopId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này không thể hoàn tác.")) {
      dispatch(deleteLaptop(laptopId));
    }
  };

  // Xử lý Cập nhật
  const handleUpdate = (id) => {
    if (id) {
      setUpdateId(id);
      setOpen(true);
    }
  };

  // Data helpers
  const laptopList = laptop?.laptops?.content || [];
  const totalPages = laptop?.laptops?.totalPages || 1;

  // Format tiền tệ
  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

  return (
    <Box sx={{ width: "100%", p: { xs: 1, md: 3 } }}>
      <ModelUpdate open={open} handleClose={handleClose} id={updateId} />

      <Card elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <CardHeader
          avatar={
            <Box sx={{ bgcolor: 'primary.light', p: 1, borderRadius: 1, color: 'primary.main' }}>
               <AppsIcon />
            </Box>
          }
          title={
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary" }}>
              Danh sách Laptop
            </Typography>
          }
          subheader={`Tổng số: ${laptop?.laptops?.totalElements || 0} sản phẩm`}
          sx={{
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            py: 2
          }}
        />
        
        <TableContainer sx={{ maxHeight: "70vh" }}>
          <Table stickyHeader aria-label="sticky table" sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>Hình ảnh</TableCell>
                <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>Thông tin sản phẩm</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>Danh mục</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>Giá bán</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>Kho</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {laptopList.length > 0 ? (
                laptopList.map((item) => {
                  const quantity = item?.laptopColors?.[0]?.quantity || 0;
                  const imageUrl = item.imageUrls?.[0] ? `${API_BASE_URL}${item.imageUrls[0]}` : "";
                  
                  return (
                    <TableRow 
                      hover 
                      key={item.id}
                      sx={{ 
                        "&:hover": { backgroundColor: "action.hover" },
                        transition: "background-color 0.2s"
                      }}
                    >
                      {/* Cột 1: Hình ảnh */}
                      <TableCell>
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: 2,
                            overflow: "hidden",
                            border: "1px solid #e0e0e0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "#fff"
                          }}
                        >
                          <BlobImage
                            className="w-full h-full object-contain"
                            src={imageUrl}
                            alt={item.model}
                          />
                        </Box>
                      </TableCell>

                      {/* Cột 2: Tên & Hãng */}
                      <TableCell>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "primary.main" }}>
                            {item.model}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Hãng: {item.brandName}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Cột 3: Danh mục */}
                      <TableCell align="center">
                        <Chip 
                          label={item?.categories?.[0]?.name || "N/A"} 
                          size="small" 
                          variant="outlined" 
                        />
                      </TableCell>

                      {/* Cột 4: Giá */}
                      <TableCell align="center">
                        <Typography variant="body2" sx={{ fontWeight: "bold", color: "error.main" }}>
                          {formatCurrency(item.price)}
                        </Typography>
                      </TableCell>

                      {/* Cột 5: Số lượng */}
                      <TableCell align="center">
                         <Chip 
                            label={quantity > 0 ? `Còn ${quantity}` : "Hết hàng"}
                            color={quantity > 0 ? "success" : "default"}
                            size="small"
                            sx={{ minWidth: 80 }}
                         />
                      </TableCell>

                      {/* Cột 6: Thao tác (Icons) */}
                      <TableCell align="center">
                        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                          <Tooltip title="Chỉnh sửa">
                            <IconButton 
                              color="primary" 
                              onClick={() => handleUpdate(item.id)}
                              size="small"
                              sx={{ bgcolor: 'primary.50', '&:hover': { bgcolor: 'primary.100'} }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          {item.status !== 0 && (
                            <Tooltip title="Xóa sản phẩm">
                              <IconButton
                                color="error"
                                onClick={() => handleDeleteLaptop(item.id)}
                                size="small"
                                sx={{ bgcolor: 'error.50', '&:hover': { bgcolor: 'error.100'} }}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.6 }}>
                        <AppsIcon sx={{ fontSize: 48, mb: 1 }} />
                        <Typography variant="body1">Không tìm thấy sản phẩm nào.</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Pagination Section */}
        <Box sx={{ py: 3, display: "flex", justifyContent: "center", borderTop: "1px solid", borderColor: "divider" }}>
          <Pagination
            count={totalPages}
            page={pageNumber}
            onChange={handlePaginationChange}
            color="primary"
            shape="rounded"
            showFirstButton 
            showLastButton
          />
        </Box>
      </Card>
    </Box>
  );
};

export default LaptopsTable;