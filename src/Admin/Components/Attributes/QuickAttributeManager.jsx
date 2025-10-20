import React, { useState, useEffect } from "react";
import {
  Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, TextField, DialogContent, DialogActions, CircularProgress
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import api from "../../../Config/api";

const QuickAttributeManager = ({ endpoint, fieldName = "name", onClose, onDataChange }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newItemValue, setNewItemValue] = useState("");
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/${endpoint}`);
      setData(res.data);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  const handleAdd = async () => {
    if (!newItemValue.trim()) return;
    try {
      await api.post(`/${endpoint}/api/admin`, { [fieldName]: newItemValue });
      setNewItemValue("");
      await fetchData();
      if(onDataChange) onDataChange();
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi thêm mới");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa mục này?")) return;
    try {
      await api.delete(`/${endpoint}/api/admin/${id}`);
      await fetchData();
      if(onDataChange) onDataChange();
    } catch (error) {
      alert("Không thể xóa (có thể đang được sử dụng).");
    }
  };

  const startEdit = (item) => {
    setEditId(item.id);
    setEditValue(item[fieldName] || item.version || "");
  };

  const saveEdit = async (id) => {
    try {
      await api.put(`/${endpoint}/api/admin/${id}`, { [fieldName]: editValue });
      setEditId(null);
      await fetchData();
      if(onDataChange) onDataChange();
    } catch (error) {
      alert("Lỗi cập nhật");
    }
  };

  return (
    <>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            label={`Thêm mới`}
            variant="outlined" size="small" fullWidth
            value={newItemValue}
            onChange={(e) => setNewItemValue(e.target.value)}
          />
          <Button variant="contained" onClick={handleAdd} disabled={!newItemValue.trim()}>Thêm</Button>
        </Box>
        {loading ? <Box display="flex" justifyContent="center"><CircularProgress/></Box> : (
          <TableContainer sx={{ maxHeight: 300 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Giá trị</TableCell>
                  <TableCell align="right">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>
                      {editId === row.id ? (
                        <TextField size="small" value={editValue} onChange={(e)=>setEditValue(e.target.value)} />
                      ) : (row[fieldName] || row.version)}
                    </TableCell>
                    <TableCell align="right">
                      {editId === row.id ? (
                        <>
                          <IconButton size="small" color="success" onClick={() => saveEdit(row.id)}><SaveIcon /></IconButton>
                          <IconButton size="small" onClick={() => setEditId(null)}><CancelIcon /></IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton size="small" onClick={() => startEdit(row)}><EditIcon /></IconButton>
                          <IconButton size="small" color="error" onClick={() => handleDelete(row.id)}><DeleteIcon /></IconButton>
                        </>
                      )}
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
    </>
  );
};

export default QuickAttributeManager;