import React, { useState, useEffect } from "react";
import {
  Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, TextField, DialogContent, DialogActions, CircularProgress,
  Grid, FormControl, InputLabel, Select, MenuItem, Typography, Dialog, DialogTitle
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import api from "../../../Config/api";

const QuickCpuManager = ({ onClose, onDataChange }) => {
  const [data, setData] = useState([]);
  const [techs, setTechs] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openTechPopup, setOpenTechPopup] = useState(false);

  const [newTechData, setNewTechData] = useState({ brandId: "", techName: "" });

  // State cho form CPU
  
  const [formData, setFormData] = useState(initialFormState);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const refreshTechs = async () => {
      try {
          const res = await api.get("/api/cputechs");
          setTechs(res.data);
      } catch (e) { console.error(e); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if(!formData.model || !formData.technologyId) {
        alert("Vui lòng nhập Tên Model và chọn Công nghệ CPU");
        return false;
    }
    return true;
  }

  const handleAdd = async () => {
    if (!validate()) return;
    try {
      await api.post("/cpus/api/admin", formData);
      setFormData(initialFormState);
      await fetchData();
      if(onDataChange) onDataChange();
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi thêm mới CPU");
    }
  };

  const handleUpdate = async () => {
    if (!validate()) return;
    try {
      await api.put(`/cpus/api/admin/${editId}`, formData);
      setEditId(null);
      setFormData(initialFormState);
      await fetchData();
      if(onDataChange) onDataChange();
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi cập nhật CPU");
    }
  };

  const startEdit = (item) => {
    setEditId(item.id);
    setFormData({
        model: item.model,
        technologyId: item.technologyId,
        speed: item.speed || 0,
        maxSpeed: item.maxSpeed || 0,
        core: item.core || 0,
        thread: item.thread || 0,
        cache: item.cache || 0,
        tops: item.tops || 0
    });
  };

  const cancelEdit = () => {
      setEditId(null);
      setFormData(initialFormState);
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa CPU này?")) return;
    try {
      await api.delete(`/cpus/api/admin/${id}`);
      await fetchData();
      if(onDataChange) onDataChange();
    } catch (error) {
      alert("Không thể xóa (có thể đang được sử dụng).");
    }
  };

  const handleAddQuickTech = async () => {
      if(!newTechData.brandId || !newTechData.techName){
          alert("Vui lòng chọn Hãng và nhập tên Công nghệ");
          return;
      }
      try {

          await api.post("/api/cputechs/api/admin", newTechData);
          alert("Thêm công nghệ thành công!");
          setOpenTechPopup(false);
          setNewTechData({ brandId: "", techName: "" });
          refreshTechs(); // Cập nhật lại dropdown bên ngoài
      } catch (error) {
          console.error(error);
          alert(error.response?.data?.message || "Lỗi khi thêm công nghệ");
      }
  };

  return (
    <>
      <DialogContent dividers>
        <Typography variant="subtitle1" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
            {editId ? "Cập nhật CPU" : "Thêm mới CPU"}
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3, border: '1px solid #444', padding: 2, borderRadius: 1 }}>
            <Grid item xs={12} sm={6}>
                <TextField label="Tên Model (vd: i5-13400H)" name="model" fullWidth size="small" value={formData.model} onChange={handleChange} />
            </Grid>

            {}
            <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Công nghệ (Tech)</InputLabel>
                        <Select name="technologyId" value={formData.technologyId} label="Công nghệ (Tech)" onChange={handleChange}>
                            {techs.map(t => <MenuItem key={t.id} value={t.id}>{t.techName} ({t.brandName})</MenuItem>)}
                        </Select>
                    </FormControl>
                    <IconButton
                        color="primary"
                        sx={{ border: '1px solid', borderRadius: 1 }}
                        onClick={() => setOpenTechPopup(true)}
                    >
                        <AddIcon />
                    </IconButton>
                </Box>
            </Grid>
            {}

            <Grid item xs={6} sm={3}><TextField type="number" label="Speed (GHz)" name="speed" fullWidth size="small" value={formData.speed} onChange={handleChange} /></Grid>
            <Grid item xs={6} sm={3}><TextField type="number" label="Max Speed" name="maxSpeed" fullWidth size="small" value={formData.maxSpeed} onChange={handleChange} /></Grid>
            <Grid item xs={6} sm={3}><TextField type="number" label="Cache (MB)" name="cache" fullWidth size="small" value={formData.cache} onChange={handleChange} /></Grid>
            <Grid item xs={6} sm={3}><TextField type="number" label="TOPS (AI)" name="tops" fullWidth size="small" value={formData.tops} onChange={handleChange} /></Grid>
            <Grid item xs={6} sm={6}><TextField type="number" label="Số nhân (Cores)" name="core" fullWidth size="small" value={formData.core} onChange={handleChange} /></Grid>
            <Grid item xs={6} sm={6}><TextField type="number" label="Số luồng (Threads)" name="thread" fullWidth size="small" value={formData.thread} onChange={handleChange} /></Grid>

            <Grid item xs={12}>
                <Button
                    variant="contained"
                    fullWidth
                    color={editId ? "success" : "primary"}
                    onClick={editId ? handleUpdate : handleAdd}
                    startIcon={editId ? <SaveIcon/> : null}
                    sx={{ bgcolor: editId ? '' : '#9155FD' }}
                >
                    {editId ? "CẬP NHẬT" : "THÊM CPU"}
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
                  <TableCell>Tech</TableCell>
                  <TableCell>Core/Thread</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.id} selected={editId === row.id} hover>
                    <TableCell>{row.model}</TableCell>
                    <TableCell>{row.technologyName}</TableCell>
                    <TableCell>{row.core}C / {row.thread}T</TableCell>
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
        open={openTechPopup}
        onClose={() => setOpenTechPopup(false)}
        maxWidth="xs"
        fullWidth
      >
          <DialogTitle>Thêm mới Công nghệ CPU</DialogTitle>
          <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                <FormControl fullWidth size="small">
                    <InputLabel>Chọn Hãng (Intel/AMD/Apple)</InputLabel>
                    <Select
                        value={newTechData.brandId}
                        label="Chọn Hãng (Intel/AMD/Apple)"
                        onChange={(e) => setNewTechData({...newTechData, brandId: e.target.value})}
                    >
                        {brands.map(b => (
                            <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Tên công nghệ (vd: Core i5, M2 Pro)"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={newTechData.techName}
                    onChange={(e) => setNewTechData({...newTechData, techName: e.target.value})}
                />
              </Box>
          </DialogContent>
          <DialogActions>
              <Button onClick={() => setOpenTechPopup(false)} color="inherit">Hủy</Button>
              <Button onClick={handleAddQuickTech} variant="contained" sx={{bgcolor: '#9155FD'}}>Lưu Tech</Button>
          </DialogActions>
      </Dialog>
    </>
  );
};

export default QuickCpuManager;