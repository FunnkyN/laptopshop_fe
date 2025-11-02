import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import api from "../../../Config/api";

const AttributeManagement = ({ title, endpoint, fieldName = "name" }) => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Lấy danh sách
  const fetchData = async () => {
    try {
      const res = await api.get(`/${endpoint}`);
      setData(res.data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  // 2. Xử lý mở modal (Thêm hoặc Sửa)
  const handleOpen = (item = null) => {
    if (item) {
      setCurrentId(item.id);
      setInputValue(item[fieldName] || item.version || ""); // Fallback cho OS version
    } else {
      setCurrentId(null);
      setInputValue("");
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentId(null);
    setInputValue("");
  };

  // 3. Xử lý Lưu (Tạo mới hoặc Cập nhật)
  const handleSave = async () => {
    if (!inputValue.trim()) return alert("Vui lòng nhập thông tin");
    setLoading(true);

    try {

      const payload = { [fieldName]: inputValue };

      if (currentId) {

        await api.put(`/${endpoint}/api/admin/${currentId}`, payload);
        alert("Cập nhật thành công!");
      } else {

        await api.post(`/${endpoint}/api/admin`, payload);
        alert("Thêm mới thành công!");
      }
      handleClose();
      fetchData();
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      alert(error.response?.data?.message || "Đã xảy ra lỗi!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa mục này?")) return;
    try {

      await api.delete(`/${endpoint}/api/admin/${id}`);
      alert("Xóa thành công!");
      fetchData();
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      alert("Xóa thất bại (Có thể dữ liệu đang được sử dụng trong sản phẩm).");
    }
  };

  return (
    <Box width={"100%"}>
      <Card className="mt-2">
        <CardHeader
          title={title}
          action={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
              sx={{ bgcolor: "#9155FD" }}
            >
              Thêm mới
            </Button>
          }
          sx={{ pt: 2, alignItems: "center" }}
        />
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tên / Giá trị</TableCell>
                <TableCell align="center">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length > 0 ? (
                data.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell>{row[fieldName] || row.version}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpen(row)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(row.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    Chưa có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>
          {currentId ? "Cập nhật thông tin" : "Thêm mới"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label={fieldName === "version" ? "Phiên bản" : "Tên hiển thị"}
            type="text"
            fullWidth
            variant="outlined"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Hủy
          </Button>
          <Button onClick={handleSave} variant="contained" disabled={loading}>
            {loading ? "Đang xử lý..." : "Lưu"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AttributeManagement;