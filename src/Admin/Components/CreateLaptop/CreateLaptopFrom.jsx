import React, { useState, useEffect, Fragment } from "react";
import {
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  Tooltip,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Box,
  InputAdornment,
  Paper,
  FormHelperText,
  Chip
} from "@mui/material";

// Icons
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import SaveIcon from "@mui/icons-material/Save";
import MemoryIcon from '@mui/icons-material/Memory';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

import api from "../../../Config/api";
import { useDispatch, useSelector } from "react-redux";
import { createLaptop, uploadFiles } from "../../../Redux/Admin/Laptop/Action";
import QuickAttributeManager from "../Attributes/QuickAttributeManager";
import QuickCpuManager from "../Attributes/QuickCpuManager";
import QuickGpuManager from "../Attributes/QuickGpuManager";

// Hàm validate (giữ nguyên logic)
function validateObject(obj) {
  const errors = [];
  const isInvalid = (value) => value === null || value === "";

  for (const key in obj) {
      if (Array.isArray(obj[key])) {
          if (obj[key].length === 0) {
              errors.push(key);
          } else {
              obj[key].forEach((item, index) => {
                  if (typeof item === "object") {
                      for (const subKey in item) {
                          if (isInvalid(item[subKey])) {
                              errors.push(`${key}[${index}].${subKey}`);
                          }
                      }
                  }
              });
          }
      } else if (typeof obj[key] === "object") {
          for (const subKey in obj[key]) {
              if (isInvalid(obj[key][subKey])) {
                  errors.push(`${key}.${subKey}`);
              }
          }
      } else if (isInvalid(obj[key])) {
          errors.push(key);
      }
  }
  return errors.length > 0 ? `Vui lòng nhập đầy đủ: ${errors.join(", ")}` : "done";
}

const CreateLaptopForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.laptop);

  // --- STATE ---
  const [laptopData, setLaptopData] = useState({
    brandId: "",
    model: "",
    cpu: "",
    gpus: [],
    ramMemory: "",
    ramDetail: "",
    diskCapacity: "",
    diskDetail: "",
    screenSize: "",
    screenDetail: "",
    osVersionId: "",
    keyboardType: "",
    batteryCharger: "",
    design: "",
    laptopColors: [{ colorId: "", quantity: "" }],
    categories: [],
    origin: "",
    warranty: "",
    price: "",
    discountPercent: 0
  });

  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [gpus, setGpus] = useState([]);
  const [cpus, setCpus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [osVersions, setOsVersions] = useState([]);
  const [files, setFiles] = useState([]);

  // State quản lý Dialog Quick Manager
  const [managerConfig, setManagerConfig] = useState({
    open: false,
    title: "",
    endpoint: "",
    fieldName: "name"
  });
  const [openCpuManager, setOpenCpuManager] = useState(false);
  const [openGpuManager, setOpenGpuManager] = useState(false);

  // --- FETCH DATA ---
  const fetchAllData = async () => {
    try {
      const [brandsRes, colorsRes, gpusRes, cpusRes, categoriesRes, osVersionsRes] = await Promise.all([
        api.get(`/brands`),
        api.get(`/colors`),
        api.get(`/gpus`),
        api.get(`/cpus`),
        api.get(`/categories`),
        api.get(`/osversions`),
      ]);
      setBrands(brandsRes.data);
      setColors(colorsRes.data);
      // Logic màu khả dụng ban đầu
      if(laptopData.laptopColors.length === 1 && !laptopData.laptopColors[0].colorId) {
          setAvailableColors(colorsRes.data);
      }
      setOsVersions(osVersionsRes.data);
      setGpus(gpusRes.data);
      setCpus(cpusRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // --- HANDLERS ---
  const openManager = (title, endpoint, fieldName = "name") => {
    setManagerConfig({ open: true, title, endpoint, fieldName });
  };

  const closeManager = () => {
    setManagerConfig({ ...managerConfig, open: false });
  };

  const handleDataChange = () => {
    fetchAllData();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLaptopData((prevState) => {
      let parsedValue = value;
      if (name === "cpu") {
        parsedValue = { id: value };
      } else if (name === "screenSize" || name === "discountPercent" || name === "price" || name === "ramMemory" || name === "diskCapacity" || name === "warranty") {
         // Chuyển về số nếu input không rỗng
        parsedValue = value === "" ? "" : parseFloat(value);
      }
      return {
        ...prevState,
        [name]: parsedValue,
      };
    });
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    const updatedCategories = value.map((id) => ({ id }));
    setLaptopData((prevState) => ({
      ...prevState,
      categories: updatedCategories,
    }));
  };

  // Logic xử lý Laptop Colors
  const handleLaptopColorChange = (index, field, value) => {
    const updatedColors = [...laptopData.laptopColors];
    updatedColors[index][field] = value;
    setLaptopData((prevState) => ({
      ...prevState,
      laptopColors: updatedColors,
    }));

    if (field === "colorId") {
      const selectedColorIds = updatedColors.map((color) => color.colorId);
      const remainingColors = colors.filter(
        (color) => !selectedColorIds.includes(color.id)
      );
      setAvailableColors(remainingColors);
    }
  };

  const addLaptopColorRow = () => {
    if (laptopData.laptopColors.length < colors.length) {
      setLaptopData((prevState) => ({
        ...prevState,
        laptopColors: [...prevState.laptopColors, { colorId: "", quantity: "" }],
      }));
    }
  };

  const removeLaptopColorRow = (index) => {
    const updatedColors = [...laptopData.laptopColors];
    updatedColors.splice(index, 1);
    setLaptopData((prevState) => ({
      ...prevState,
      laptopColors: updatedColors,
    }));
    // Recalculate available colors
    const selectedColorIds = updatedColors.map((color) => color.colorId);
    const remainingColors = colors.filter(
      (color) => !selectedColorIds.includes(color.id)
    );
    setAvailableColors(remainingColors);
  };

  const handleGpuChange = (event) => {
    const selectedGpuIds = event.target.value;
    const updatedGpus = selectedGpuIds.map((id) => ({ id }));
    if (selectedGpuIds.length > 2) return; // Limit 2 GPU
    setLaptopData((prevState) => ({
      ...prevState,
      gpus: updatedGpus,
    }));
  };

  const isGpuTypeSelected = (type, currentGpuId) =>
    laptopData.gpus.some((gpu) => {
      const selectedGpu = gpus.find((g) => g.id === gpu.id);
      return selectedGpu?.type === type && gpu.id !== currentGpuId;
    });

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => {
      const uniqueFiles = [...prevFiles];
      selectedFiles.forEach((file) => {
        if (!uniqueFiles.some((f) => f.name === file.name)) {
          uniqueFiles.push(file);
        }
      });
      return uniqueFiles;
    });
    e.target.value = "";
  };

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const val = validateObject(laptopData);
    if(val !== 'done'){
      alert(val);
      return;
    }
    const res = await dispatch(createLaptop({ data: laptopData }));
    if (res) {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      await dispatch(uploadFiles(res.id, formData));
      alert("Tạo Laptop thành công!");
      // Reset form hoặc redirect tùy ý
    } else {
      alert("Có lỗi xảy ra hoặc Model đã tồn tại.");
    }
  };

  // --- STYLES HELPER ---
  const cardStyle = { mb: 3, borderRadius: 2, overflow: 'visible', boxShadow: '0px 4px 10px rgba(0,0,0,0.05)' };
  const headerStyle = { borderBottom: '1px solid #eee', px: 3, py: 2 };

  return (
    <Fragment>
      <Box sx={{ p: { xs: 1, md: 3 }, maxWidth: 1200, mx: "auto" }}>
        {/* HEADER PAGE */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
             THÊM SẢN PHẨM MỚI
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Điền đầy đủ thông tin để tạo mới một Laptop trong hệ thống
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          
          {/* 1. THÔNG TIN CHUNG */}
          <Card sx={cardStyle}>
            <CardHeader 
              avatar={<Box sx={{ bgcolor: 'primary.light', p: 1, borderRadius: 1, color: 'primary.main' }}><InfoOutlinedIcon/></Box>}
              title={<Typography variant="h6" fontWeight="bold">Thông tin cơ bản</Typography>}
              subheader="Tên, thương hiệu, giá bán và phân loại"
              sx={headerStyle}
            />
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Thương hiệu</InputLabel>
                    <Select
                      name="brandId"
                      value={laptopData.brandId}
                      onChange={handleChange}
                      label="Thương hiệu"
                      endAdornment={
                        <InputAdornment position="end" sx={{ mr: 2 }}>
                          <Tooltip title="Quản lý Thương hiệu">
                            <IconButton size="small" onClick={() => openManager("Quản lý Thương hiệu", "brands", "name")}>
                              <SettingsSuggestIcon fontSize="small" color="primary" />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      }
                    >
                      {brands.map((brand) => <MenuItem key={brand.id} value={brand.id}>{brand.name}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                   <TextField fullWidth label="Tên Model (VD: Dell XPS 13 9310)" name="model" value={laptopData.model} onChange={handleChange} required />
                </Grid>

                <Grid item xs={12} md={4}>
                   <TextField 
                      fullWidth label="Giá niêm yết (VNĐ)" 
                      name="price" value={laptopData.price} onChange={handleChange} 
                      type="number" 
                      InputProps={{ endAdornment: <InputAdornment position="end">₫</InputAdornment> }} 
                   />
                </Grid>
                <Grid item xs={12} md={4}>
                   <TextField 
                      fullWidth label="Giảm giá" 
                      name="discountPercent" value={laptopData.discountPercent} onChange={handleChange} 
                      type="number"
                      InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }} 
                   />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField 
                        fullWidth label="Bảo hành" 
                        name="warranty" value={laptopData.warranty} onChange={handleChange} 
                        type="number"
                        InputProps={{ endAdornment: <InputAdornment position="end">Tháng</InputAdornment> }} 
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Xuất xứ" name="origin" value={laptopData.origin} onChange={handleChange} placeholder="VD: Trung Quốc, Việt Nam" />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Danh mục</InputLabel>
                    <Select
                      multiple
                      name="categories"
                      value={laptopData.categories.map((cat) => cat.id)}
                      onChange={handleCategoryChange}
                      label="Danh mục"
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => {
                             const cat = categories.find(c => c.id === value);
                             return <Chip key={value} label={cat ? cat.name : value} size="small" />
                          })}
                        </Box>
                      )}
                      endAdornment={
                        <InputAdornment position="end" sx={{ mr: 2 }}>
                          <Tooltip title="Quản lý Danh mục">
                             <IconButton size="small" onClick={() => openManager("Quản lý Danh mục", "categories", "name")}>
                               <SettingsSuggestIcon fontSize="small" color="primary" />
                             </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      }
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          <Checkbox checked={laptopData.categories.some((cat) => cat.id === category.id)} />
                          <ListItemText primary={category.name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* 2. CẤU HÌNH PHẦN CỨNG */}
          <Card sx={cardStyle}>
            <CardHeader 
              avatar={<Box sx={{ bgcolor: 'info.light', p: 1, borderRadius: 1, color: 'info.main' }}><MemoryIcon/></Box>}
              title={<Typography variant="h6" fontWeight="bold">Thông số kỹ thuật</Typography>}
              subheader="CPU, GPU, RAM, Ổ cứng và Màn hình"
              sx={headerStyle}
            />
            <Divider />
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {/* CPU & GPU */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Bộ vi xử lý (CPU)</InputLabel>
                    <Select
                      name="cpu"
                      value={laptopData.cpu?.id || ""}
                      onChange={handleChange}
                      label="Bộ vi xử lý (CPU)"
                      endAdornment={
                        <InputAdornment position="end" sx={{ mr: 2 }}>
                           <Tooltip title="Thêm CPU Mới">
                              <IconButton size="small" onClick={() => setOpenCpuManager(true)}>
                                 <SettingsSuggestIcon fontSize="small" color="info" />
                              </IconButton>
                           </Tooltip>
                        </InputAdornment>
                      }
                    >
                      {cpus.map((cpu) => <MenuItem key={cpu.id} value={cpu.id}>{cpu.model}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Card đồ họa (GPU)</InputLabel>
                    <Select
                      multiple
                      value={laptopData.gpus.map((gpu) => gpu.id)}
                      onChange={handleGpuChange}
                      label="Card đồ họa (GPU)"
                      renderValue={(selected) => selected.map(id => gpus.find(g => g.id === id)?.model).join(", ")}
                      endAdornment={
                        <InputAdornment position="end" sx={{ mr: 2 }}>
                           <Tooltip title="Thêm GPU Mới">
                              <IconButton size="small" onClick={() => setOpenGpuManager(true)}>
                                 <SettingsSuggestIcon fontSize="small" color="info" />
                              </IconButton>
                           </Tooltip>
                        </InputAdornment>
                      }
                    >
                      {gpus.map((gpu) => (
                        <MenuItem key={gpu.id} value={gpu.id} disabled={!laptopData.gpus.some(g => g.id === gpu.id) && isGpuTypeSelected(gpu.type, gpu.id)}>
                          <Checkbox checked={laptopData.gpus.some((selectedGpu) => selectedGpu.id === gpu.id)} />
                          <ListItemText primary={`${gpu.model} (${gpu.type})`} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* RAM */}
                <Grid item xs={12} md={4}>
                   <TextField fullWidth label="RAM (GB)" name="ramMemory" value={laptopData.ramMemory} onChange={handleChange} type="number" />
                </Grid>
                <Grid item xs={12} md={8}>
                   <TextField fullWidth label="Chi tiết RAM (Loại, Bus...)" name="ramDetail" value={laptopData.ramDetail} onChange={handleChange} placeholder="VD: DDR4 3200MHz" />
                </Grid>

                {/* DISK */}
                <Grid item xs={12} md={4}>
                   <TextField fullWidth label="Ổ cứng (GB)" name="diskCapacity" value={laptopData.diskCapacity} onChange={handleChange} type="number" />
                </Grid>
                <Grid item xs={12} md={8}>
                   <TextField fullWidth label="Chi tiết ổ cứng" name="diskDetail" value={laptopData.diskDetail} onChange={handleChange} placeholder="VD: SSD NVMe PCIe" />
                </Grid>

                {/* SCREEN */}
                <Grid item xs={12} md={4}>
                   <TextField fullWidth label="Màn hình (Inch)" name="screenSize" value={laptopData.screenSize} onChange={handleChange} type="number" inputProps={{ step: "0.1" }} />
                </Grid>
                <Grid item xs={12} md={8}>
                   <TextField fullWidth label="Chi tiết màn hình" name="screenDetail" value={laptopData.screenDetail} onChange={handleChange} placeholder="VD: Full HD, IPS, 144Hz" />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* 3. THIẾT KẾ & PHẦN MỀM */}
          <Card sx={cardStyle}>
            <CardHeader 
              avatar={<Box sx={{ bgcolor: 'warning.light', p: 1, borderRadius: 1, color: 'warning.main' }}><LaptopMacIcon/></Box>}
              title={<Typography variant="h6" fontWeight="bold">Thiết kế & Phần mềm</Typography>}
              sx={headerStyle}
            />
            <Divider />
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3}>
                 <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Hệ điều hành (OS)</InputLabel>
                    <Select
                      name="osVersionId"
                      value={laptopData.osVersionId || ""}
                      onChange={handleChange}
                      label="Hệ điều hành (OS)"
                      endAdornment={
                        <InputAdornment position="end" sx={{ mr: 2 }}>
                           <IconButton size="small" onClick={() => openManager("Quản lý OS", "osversions", "version")}>
                              <SettingsSuggestIcon fontSize="small" color="warning" />
                           </IconButton>
                        </InputAdornment>
                      }
                    >
                      {osVersions.map((os) => <MenuItem key={os.id} value={os.id}>{os.version}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                   <TextField fullWidth label="Kiểu bàn phím" name="keyboardType" value={laptopData.keyboardType} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} md={6}>
                   <TextField fullWidth label="Pin & Sạc" name="batteryCharger" value={laptopData.batteryCharger} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} md={6}>
                   <TextField fullWidth label="Thiết kế" name="design" value={laptopData.design} onChange={handleChange} placeholder="VD: Vỏ kim loại, 1.3kg" />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* 4. MÀU SẮC & KHO HÀNG */}
          <Card sx={cardStyle}>
             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid #eee' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                   <Box sx={{ bgcolor: 'success.light', p: 1, borderRadius: 1, color: 'success.main' }}><PaletteOutlinedIcon/></Box>
                   <Box>
                      <Typography variant="h6" fontWeight="bold">Phiên bản màu sắc & Kho</Typography>
                      <Typography variant="caption" color="text.secondary">Quản lý số lượng tồn kho theo từng màu</Typography>
                   </Box>
                </Box>
                <Button variant="contained" size="small" startIcon={<AddCircleOutlineIcon />} onClick={addLaptopColorRow}>
                  Thêm màu
                </Button>
             </Box>
             
             <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                   <Tooltip title="Quản lý danh sách màu hệ thống">
                      <Button size="small" variant="text" startIcon={<SettingsSuggestIcon />} onClick={() => openManager("Quản lý Màu sắc", "colors", "name")}>
                         Cài đặt màu
                      </Button>
                   </Tooltip>
                </Box>

                {laptopData.laptopColors.map((laptopColor, index) => (
                   <Paper key={index} elevation={0} variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
                      <Grid container spacing={2} alignItems="center">
                         <Grid item xs={12} sm={5}>
                            <FormControl fullWidth size="small">
                               <InputLabel>Màu sắc</InputLabel>
                               <Select 
                                  value={laptopColor.colorId} 
                                  label="Màu sắc"
                                  onChange={(e) => handleLaptopColorChange(index, "colorId", e.target.value)}
                               >
                                  {availableColors.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                               </Select>
                            </FormControl>
                         </Grid>
                         <Grid item xs={12} sm={5}>
                             <TextField 
                                fullWidth size="small" 
                                label="Số lượng tồn kho" 
                                type="number" 
                                value={laptopColor.quantity}
                                onChange={(e) => handleLaptopColorChange(index, "quantity", e.target.value)}
                             />
                         </Grid>
                         <Grid item xs={12} sm={2} sx={{ textAlign: 'center' }}>
                            <Tooltip title="Xóa dòng này">
                               <IconButton color="error" onClick={() => removeLaptopColorRow(index)} disabled={index === 0}>
                                  <DeleteOutlineIcon />
                               </IconButton>
                            </Tooltip>
                         </Grid>
                      </Grid>
                   </Paper>
                ))}
             </CardContent>
          </Card>

          {/* 5. HÌNH ẢNH */}
          <Card sx={cardStyle}>
             <CardHeader 
                avatar={<Box sx={{ bgcolor: 'error.light', p: 1, borderRadius: 1, color: 'error.main' }}><PhotoLibraryIcon/></Box>}
                title={<Typography variant="h6" fontWeight="bold">Hình ảnh sản phẩm</Typography>}
                sx={headerStyle}
             />
             <CardContent sx={{ p: 3 }}>
                <Box 
                   component="label"
                   sx={{ 
                      border: '2px dashed', 
                      borderColor: 'primary.main', 
                      borderRadius: 2, 
                      bgcolor: 'primary.50',
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'center', 
                      justifyContent: 'center',
                      p: 4, 
                      cursor: 'pointer',
                      transition: '0.3s',
                      '&:hover': { bgcolor: 'primary.100' }
                   }}
                >
                   <AddPhotoAlternateIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                   <Typography variant="h6" color="primary">Nhấn để tải ảnh lên</Typography>
                   <Typography variant="body2" color="text.secondary">Hỗ trợ JPG, PNG. Khuyên dùng tỉ lệ 16:9</Typography>
                   <input type="file" hidden multiple onChange={handleFileChange} accept="image/*" />
                </Box>

                {/* Preview Images */}
                {files.length > 0 && (
                   <Grid container spacing={2} sx={{ mt: 2 }}>
                      {files.map((file, index) => (
                         <Grid item key={index}>
                            <Box sx={{ position: 'relative', width: 120, height: 120, borderRadius: 2, overflow: 'hidden', border: '1px solid #ddd' }}>
                               <img src={URL.createObjectURL(file)} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                               <IconButton 
                                  size="small" 
                                  sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'rgba(0,0,0,0.6)', color: 'white', '&:hover':{ bgcolor: 'error.main' } }}
                                  onClick={() => removeFile(index)}
                               >
                                  <CloseIcon fontSize="small"/>
                               </IconButton>
                            </Box>
                         </Grid>
                      ))}
                   </Grid>
                )}
             </CardContent>
          </Card>

          {/* ACTION BUTTONS */}
          <Box sx={{ position: 'sticky', bottom: 20, zIndex: 10, display: 'flex', justifyContent: 'flex-end' }}>
             <Button 
                variant="contained" 
                size="large" 
                type="submit" 
                startIcon={loading ? null : <SaveIcon />}
                disabled={loading}
                sx={{ 
                   py: 1.5, px: 4, 
                   borderRadius: 8, 
                   fontWeight: 'bold', 
                   boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                   textTransform: 'none',
                   fontSize: '1.1rem'
                }}
             >
                {loading ? "Đang xử lý..." : "Lưu Sản Phẩm"}
             </Button>
          </Box>

        </form>

        {/* --- DIALOGS --- */}
        <Dialog open={managerConfig.open} onClose={closeManager} fullWidth maxWidth="sm">
          <DialogTitle sx={{ borderBottom: '1px solid #eee' }}>{managerConfig.title}</DialogTitle>
          {managerConfig.open && (
              <QuickAttributeManager
                  endpoint={managerConfig.endpoint}
                  fieldName={managerConfig.fieldName}
                  onClose={closeManager}
                  onDataChange={handleDataChange}
              />
          )}
        </Dialog>

        <Dialog open={openCpuManager} onClose={() => setOpenCpuManager(false)} fullWidth maxWidth="lg">
            <QuickCpuManager onClose={() => setOpenCpuManager(false)} onDataChange={handleDataChange} />
        </Dialog>

        <Dialog open={openGpuManager} onClose={() => setOpenGpuManager(false)} fullWidth maxWidth="lg">
            <QuickGpuManager onClose={() => setOpenGpuManager(false)} onDataChange={handleDataChange} />
        </Dialog>

      </Box>
    </Fragment>
  );
};

export default CreateLaptopForm;