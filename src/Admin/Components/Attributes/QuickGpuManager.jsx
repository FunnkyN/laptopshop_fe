import React, { useState, useEffect } from "react";
import {
  Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, TextField, DialogContent, DialogActions, CircularProgress,
  Grid, FormControl, InputLabel, Select, MenuItem, Typography, Dialog, DialogTitle
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import api from "../../../Config/api";
import QuickAttributeManager from "./QuickAttributeManager";

const QuickGpuManager = ({ onClose, onDataChange }) => {
  const [data, setData] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openBrandPopup, setOpenBrandPopup] = useState(false);

  const initialFormState = {
    model: "",
    brandId: "",
    memory: "",
    tops: 0,
    type: "DISCRETE"
  };
  const [formData, setFormData] = useState(initialFormState);
  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [gpusRes, brandsRes] = await Promise.all([
        api.get("/gpus"),
        api.get("/brands")
      ]);
      setData(gpusRes.data);
      setBrands(brandsRes.data);
    } catch (error) {
      console.error("Lỗi tải dữ liệu GPU:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshBrands = async () => {
      try {
          const res = await api.get("/brands");
          setBrands(res.data);
      } catch (e) { console.error(e); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if(!formData.model || !formData.brandId) {
        alert("Vui lòng nhập Tên Model và chọn Hãng");
        return false;
    }
    return true;
  }

  const handleAdd = async () => {
    if (!validate()) return;
    try {
      await api.post("/gpus/api/admin", formData);
      setFormData(initialFormState);
      await fetchData();
      if(onDataChange) onDataChange();
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi thêm mới GPU");
    }
  };

  const handleUpdate = async () => {
    if (!validate()) return;
    try {
      await api.put(`/gpus/api/admin/${editId}`, formData);
      setEditId(null);
      setFormData(initialFormState);
      await fetchData();
      if(onDataChange) onDataChange();
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi cập nhật GPU");
    }
  };

  const startEdit = (item) => {
    setEditId(item.id);
    setFormData({
        model: item.model,
        brandId: item.brandId,
        memory: item.memory || "",
        tops: item.tops || 0,
        type: item.type
    });
  };

  const cancelEdit = () => {
      setEditId(null);
      setFormData(initialFormState);
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa GPU này?")) return;
    try {
      await api.delete(`/gpus/api/admin/${id}`);
      await fetchData();
      if(onDataChange) onDataChange();
    } catch (error) {
      alert("Không thể xóa (có thể đang được sử dụng).");
    }
  };

  return (
    <>
      <DialogContent dividers>
        <Typography variant="subtitle1" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
            {editId ? "Cập nhật GPU" : "Thêm mới GPU"}
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3, border: '1px solid #444', padding: 2, borderRadius: 1 }}>
            <Grid item xs={12} sm={6}>
                <TextField label="Tên Model (vd: RTX 4060)" name="model" fullWidth size="small" value={formData.model} onChange={handleChange} />
            </Grid>

            {}
            <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Hãng</InputLabel>
                        <Select name="brandId" value={formData.brandId} label="Hãng" onChange={handleChange}>
                            {brands.map(b => <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <IconButton
                        color="primary"
                        sx={{ border: '1px solid', borderRadius: 1 }}
                        onClick={() => setOpenBrandPopup(true)}
                    >
                        <AddIcon />
                    </IconButton>
                </Box>
            </Grid>
            {}

            <Grid item xs={6} sm={4}><TextField label="VRAM (vd: 8GB)" name="memory" fullWidth size="small" value={formData.memory} onChange={handleChange} /></Grid>
            <Grid item xs={6} sm={4}><TextField type="number" label="TOPS (AI)" name="tops" fullWidth size="small" value={formData.tops} onChange={handleChange} /></Grid>
            <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                    <InputLabel>Loại Card</InputLabel>
                    <Select name="type" value={formData.type} label="Loại Card" onChange={handleChange}>
                        <MenuItem value="DISCRETE">Card Rời (Discrete)</MenuItem>
                        <MenuItem value="INTEGRATED">Card Onboard (Integrated)</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            <Grid item xs={12}>
                <Button
                    variant="contained"
                    fullWidth
                    color={editId ? "success" : "primary"}
                    onClick={editId ? handleUpdate : handleAdd}
                    startIcon={editId ? <SaveIcon/> : null}
                    sx={{ bgcolor: editId ? '' : '#9155FD' }}
                >
                    {editId ? "CẬP NHẬT GPU" : "THÊM GPU"}
                </Button>
                {editId && <Button fullWidth size="small" color="secondary" onClick={cancelEdit} sx={{mt:1}}>Hủy bỏ</Button>}
            </Grid>
        </Grid>

        {loading ? <Box display="flex" justifyContent="center"><CircularProgress/></Box> : (
          <TableContainer sx={{ maxHeight: 400 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Model</TableCell>
                  <TableCell>Hãng</TableCell> {}
                  <TableCell>VRAM</TableCell>
                  <TableCell>Loại</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.id} selected={editId === row.id} hover>
                    <TableCell>{row.model}</TableCell>
                    <TableCell>{row.brandName}</TableCell>
                    <TableCell>{row.memory}</TableCell>
                    <TableCell>{row.type === 'DISCRETE' ? 'Rời' : 'Onboard'}</TableCell>
                    <TableCell align="right">
                        <IconButton size="small" onClick={() => startEdit(row)} disabled={editId !== null}><EditIcon /></IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDelete(row.id)} disabled={editId !== null}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>

      {}
      <Dialog
        open={openBrandPopup}
        onClose={() => setOpenBrandPopup(false)}
        maxWidth="sm"
        fullWidth
      >
          <DialogTitle>Quản lý Thương hiệu / Hãng</DialogTitle>
          <QuickAttributeManager
            endpoint="brands"
            fieldName="name"
            onClose={() => setOpenBrandPopup(false)}
            onDataChange={() => {
                refreshBrands();

            }}
          />
      </Dialog>
    </>
  );
};

export default QuickGpuManager;