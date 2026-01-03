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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import api from "../../../Config/api";

const CpuTechManagement = () => {
  const [data, setData] = useState([]);
  const [brands, setBrands] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    techName: "",
    brandId: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const handleClose = () => {
    setOpen(false);
    setFormData({ id: null, techName: "", brandId: "" });
  };

  const handleSave = async () => {
    if (!formData.techName || !formData.brandId) {
      alert("Vui lòng nhập tên công nghệ và chọn hãng!");
      return;
    }

    try {
      if (formData.id) {
        // Update
        await api.put(`/api/cputechs/api/admin/${formData.id}`, formData);
        alert("Cập nhật thành công!");
      } else {
        // Create
        await api.post("/api/cputechs/api/admin", formData);
        alert("Thêm mới thành công!");
      }
      handleClose();
      fetchData();
    } catch (error) {
      console.error("Lỗi lưu:", error);
      alert(error.response?.data?.message || "Đã xảy ra lỗi");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa công nghệ này?")) return;
    try {
      await api.delete(`/api/cputechs/api/admin/${id}`);
      alert("Xóa thành công!");
      fetchData();
    } catch (error) {
      alert("Xóa thất bại (Dữ liệu đang được sử dụng).");
    }
  };

  return (
    <Box width={"100%"}>
      <Card className="mt-2">
        <CardHeader
          title="Quản lý Công nghệ CPU (Core i, Ryzen...)"
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
                <TableCell>Tên Công nghệ</TableCell>
                <TableCell>Thương hiệu (Hãng)</TableCell>
                <TableCell align="center">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                 <TableRow>
                    <TableCell colSpan={4} align="center"><CircularProgress/></TableCell>
                 </TableRow>
              ) : data.length > 0 ? (
                data.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell sx={{fontWeight: 'bold'}}>{row.techName}</TableCell>
                    <TableCell>{row.brandName}</TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => handleOpen(row)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(row.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">Chưa có dữ liệu</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>{formData.id ? "Cập nhật" : "Thêm mới"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <FormControl fullWidth size="small">
                <InputLabel>Chọn Hãng</InputLabel>
                <Select
                    value={formData.brandId}
                    label="Chọn Hãng"
                    onChange={(e) => setFormData({...formData, brandId: e.target.value})}
                >
                    {brands.map(b => (
                        <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                label="Tên công nghệ (vd: Core i5, Ryzen 7)"
                variant="outlined"
                fullWidth
                size="small"
                value={formData.techName}
                onChange={(e) => setFormData({...formData, techName: e.target.value})}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">Hủy</Button>
          <Button onClick={handleSave} variant="contained">Lưu</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CpuTechManagement;