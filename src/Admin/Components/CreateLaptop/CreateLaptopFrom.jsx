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
  Box
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings";
// [EDIT] Thay axios bằng api instance
import api from "../../../Config/api"; 
import { useDispatch, useSelector } from "react-redux";
import { createLaptop, uploadFiles } from "../../../Redux/Admin/Laptop/Action";
import QuickAttributeManager from "../Attributes/QuickAttributeManager";

import QuickCpuManager from "../Attributes/QuickCpuManager";
import QuickGpuManager from "../Attributes/QuickGpuManager";

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
  return errors.length > 0 ? `Các trường: ${errors.join(", ")} không được để trống` : "done";
}
  const getURLs = async () => {
    try {
        const res = await api.get("api/banner/slideimage");
        if (res.data) {
          setUrls(res.data);
        }
    } catch (error) {
        console.error("Failed to fetch banner images for admin view:", error);
    }
  };
const CreateLaptopForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.laptop);

  const [laptopData, setLaptopData] = useState({
    brandId: null,
    model: "",
    cpu: "",
    gpus: [],
    ramMemory: 0,
    ramDetail: "",
    diskCapacity: 0,
    diskDetail: "",
    screenSize: 0,
    screenDetail: "",
    osVersionId: null,
    keyboardType: "",
    batteryCharger: "",
    design: "",
    laptopColors: [{ colorId: null, quantity: 0 }],
    categories: [],
    origin: "",
    warranty: 0,
    price: 0,
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

  const [managerConfig, setManagerConfig] = useState({
    open: false,
    title: "",
    endpoint: "",
    fieldName: "name"
  });

  const [openCpuManager, setOpenCpuManager] = useState(false);
  const [openGpuManager, setOpenGpuManager] = useState(false);

  // [EDIT] Hàm fetchAllData đã được sửa lại
  const fetchAllData = async () => {
    try {
      // Gọi qua api instance để tự động xử lý Ngrok và BaseURL
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
      } else if (name === "screenSize" || name === "discountPercent") {
        parsedValue = value === "" ? "" : parseFloat(value);
      }
      return {
        ...prevState,
        [name]: parsedValue || "",
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

    const selectedColorIds = updatedColors.map((color) => color.colorId);
    const remainingColors = colors.filter(
      (color) => !selectedColorIds.includes(color.id)
    );
    setAvailableColors(remainingColors);
  };

  const handleGpuChange = (event) => {
    const selectedGpuIds = event.target.value;
    const updatedGpus = selectedGpuIds.map((id) => ({ id }));
    if (selectedGpuIds.length > 2) return;
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
    const val = validateObject(laptopData)
    if(val!=='done'){
      alert(val);
      return
    }
    const res = await dispatch(createLaptop({ data: laptopData }));
    if (res) {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      await dispatch(uploadFiles(res.id, formData));
      alert("Tạo Laptop thành công!");
    } else {
      alert("Model đã tồn tại, vui lòng chọn tên khác hoặc kiểm tra lại dữ liệu.");
    }
  };

  return (
    <Fragment>
      <Box sx={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        <Typography variant="h4" sx={{ textAlign: "center", marginBottom: 4, fontWeight: 'bold', color: '#9155FD' }}>
          THÊM SẢN PHẨM MỚI
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>

            {/* 1. THÔNG TIN CHUNG */}
            <Grid item xs={12}>
              <Card elevation={3}>
                <CardHeader title="1. Thông tin chung" titleTypographyProps={{ variant: 'h6', color: 'primary' }} />
                <Divider />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FormControl fullWidth>
                          <InputLabel>Thương hiệu (Brand)</InputLabel>
                          <Select
                            name="brandId"
                            value={laptopData.brandId}
                            onChange={(e) => handleChange(e)}
                            renderValue={(selected) => brands.find((brand) => brand.id === selected)?.name || "Select Brand"}
                            MenuProps={{ PaperProps: { style: { maxHeight: "50vh" } } }}
                            label="Thương hiệu (Brand)"
                          >
                            {brands.map((brand) => (
                              <MenuItem key={brand.id} value={brand.id}>{brand.name}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <Tooltip title="Quản lý Brand">
                          <IconButton
                            onClick={() => openManager("Quản lý Thương hiệu", "brands", "name")}
                            sx={{ border: '1px solid rgba(255, 255, 255, 0.23)' }}
                          >
                            <SettingsIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Tên Model (Ví dụ: Nitro 5 AN515)" name="model" value={laptopData.model} onChange={handleChange} />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Giá gốc (VND)" name="price" value={laptopData.price} onChange={handleChange} type="number" />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Phần trăm giảm giá (%)" name="discountPercent" value={laptopData.discountPercent} onChange={handleChange} type="number"
                        inputProps={{ step: "0.1", min: 0, max: 100 }} />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Xuất xứ" name="origin" value={laptopData.origin} onChange={handleChange} />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Bảo hành (tháng)" name="warranty" value={laptopData.warranty} onChange={handleChange} type="number" />
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FormControl fullWidth>
                          <InputLabel>Danh mục (Categories)</InputLabel>
                          <Select
                            multiple
                            name="categories"
                            value={laptopData.categories.map((cat) => cat.id)}
                            label="Danh mục (Categories)"
                            onChange={handleCategoryChange}
                            MenuProps={{ PaperProps: { style: { maxHeight: "50vh" } } }}
                            renderValue={(selected) =>
                              selected.map((id) => categories.find((category) => category.id === id)?.name || "Unknown").join(", ")
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
                        <Tooltip title="Quản lý Danh mục">
                          <IconButton
                            onClick={() => openManager("Quản lý Danh mục", "categories", "name")}
                            sx={{ border: '1px solid rgba(255, 255, 255, 0.23)' }}
                          >
                            <SettingsIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* 2. CẤU HÌNH */}
            <Grid item xs={12}>
              <Card elevation={3}>
                <CardHeader title="2. Cấu hình phần cứng (Specs)" titleTypographyProps={{ variant: 'h6', color: 'primary' }} />
                <Divider />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        {/* CPU */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FormControl fullWidth>
                            <InputLabel>CPU</InputLabel>
                            <Select
                              name="cpu"
                              value={laptopData.cpu?.id || ""}
                              onChange={handleChange}
                              renderValue={(selected) => cpus.find((cpu) => cpu.id === selected)?.model || "Select CPU"}
                              label="CPU"
                              MenuProps={{ PaperProps: { style: { maxHeight: "50vh" } } }}
                            >
                              {cpus.map((cpu) => (
                                <MenuItem key={cpu.id} value={cpu.id}>{cpu.model}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <Tooltip title="Quản lý CPU">
                            <IconButton
                              onClick={() => setOpenCpuManager(true)}
                              sx={{ border: '1px solid rgba(255, 255, 255, 0.23)' }}
                            >
                              <SettingsIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        {/* GPU */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FormControl fullWidth>
                            <InputLabel>GPUs (Card đồ họa)</InputLabel>
                            <Select multiple value={laptopData.gpus.map((gpu) => gpu.id)} onChange={handleGpuChange}
                              renderValue={(selected) => selected.map((id) => gpus.find((gpu) => gpu.id === id)?.model || "Unknown GPU").join(", ")}
                              label="GPUs (Card đồ họa)" MenuProps={{ PaperProps: { style: { maxHeight: "50vh" } } }} >
                              {gpus.map((gpu) => (
                                <MenuItem key={gpu.id} value={gpu.id}
                                  disabled={!laptopData.gpus.some((selectedGpu) => selectedGpu.id === gpu.id) && isGpuTypeSelected(gpu.type, gpu.id)}>
                                  <Checkbox checked={laptopData.gpus.some((selectedGpu) => selectedGpu.id === gpu.id)} />
                                  <ListItemText primary={`${gpu.model} (${gpu.type})`} />
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <Tooltip title="Quản lý GPU">
                            <IconButton
                              onClick={() => setOpenGpuManager(true)}
                              sx={{ border: '1px solid rgba(255, 255, 255, 0.23)' }}
                            >
                              <SettingsIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                    </Grid>

                    {/* Memory */}
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Dung lượng RAM (GB)" name="ramMemory" value={laptopData.ramMemory} onChange={handleChange} type="number" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Chi tiết RAM (Loại, Bus...)" name="ramDetail" value={laptopData.ramDetail} onChange={handleChange} />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Dung lượng ổ cứng (GB)" name="diskCapacity" value={laptopData.diskCapacity} onChange={handleChange} type="number" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Chi tiết ổ cứng (SSD/HDD, NVMe...)" name="diskDetail" value={laptopData.diskDetail} onChange={handleChange} />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Kích thước màn hình (inch)" name="screenSize" value={laptopData.screenSize} onChange={handleChange} type="number" inputProps={{ step: "0.1", min: 0 }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Chi tiết màn hình (Độ phân giải, Tấm nền...)" name="screenDetail" value={laptopData.screenDetail} onChange={handleChange} />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* 3. THIẾT KẾ & OS */}
            <Grid item xs={12}>
              <Card elevation={3}>
                <CardHeader title="3. Thiết kế & Phần mềm" titleTypographyProps={{ variant: 'h6', color: 'primary' }} />
                <Divider />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FormControl fullWidth>
                          <InputLabel>Hệ điều hành (OS)</InputLabel>
                          <Select
                            name="osVersionId"
                            value={laptopData.osVersionId || ""}
                            onChange={(e) => handleChange(e)}
                            renderValue={(selected) => osVersions.find((os) => os.id === selected)?.version || "Select OS Version"}
                            MenuProps={{ PaperProps: { style: { maxHeight: "50vh" } } }}
                            label="Hệ điều hành (OS)"
                          >
                            {osVersions.map((os) => (
                              <MenuItem key={os.id} value={os.id}>{os.version}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <Tooltip title="Quản lý OS">
                          <IconButton
                            onClick={() => openManager("Quản lý Hệ điều hành", "osversions", "version")}
                            sx={{ border: '1px solid rgba(255, 255, 255, 0.23)' }}
                          >
                            <SettingsIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Kiểu bàn phím" name="keyboardType" value={laptopData.keyboardType} onChange={handleChange} />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Pin & Sạc" name="batteryCharger" value={laptopData.batteryCharger} onChange={handleChange} />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Thiết kế (Vỏ, trọng lượng...)" name="design" value={laptopData.design} onChange={handleChange} />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* 4. MÀU SẮC */}
            <Grid item xs={12}>
                <Card elevation={3} sx={{ border: '1px solid #9155FD' }}> 
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Typography variant="h6" color="primary">4. Phiên bản màu sắc & Kho hàng</Typography>
                    <Tooltip title="Quản lý danh sách Màu">
                      <IconButton
                        size="small"
                        onClick={() => openManager("Quản lý Màu sắc", "colors", "name")}
                        sx={{ bgcolor: 'rgba(145, 85, 253, 0.1)', color: '#9155FD' }}
                      >
                        <SettingsIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </div>
                  <Button variant="outlined" startIcon={<AddIcon/>} onClick={addLaptopColorRow}>
                    Thêm màu khác
                  </Button>
                </Box>
                <Divider />
                <CardContent>
                  {laptopData.laptopColors.map((laptopColor, index) => (
                    <Box key={index} sx={{
                      marginBottom: 2,
                      padding: 2,
                      borderRadius: 1,
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px dashed rgba(255,255,255,0.2)'
                    }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={5}>
                          <FormControl fullWidth>
                            <InputLabel>Màu sắc</InputLabel>
                            <Select value={laptopColor.colorId} label="Màu sắc"
                              onChange={(e) => handleLaptopColorChange(index, "colorId", e.target.value)}
                              renderValue={(selected) => colors.find((color) => color.id === selected)?.name || ""}
                            >
                              {availableColors.map((color) => (
                                <MenuItem key={color.id} value={color.id}> {color.name} </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} md={5}>
                          <TextField fullWidth label="Số lượng trong kho" type="number" value={laptopColor.quantity}
                            onChange={(e) => handleLaptopColorChange(index, "quantity", e.target.value)}
                          />
                        </Grid>

                        <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                          {index > 0 ? (
                            <Button
                              color="error"
                              variant="outlined"
                              onClick={() => removeLaptopColorRow(index)}
                              startIcon={<RemoveIcon />}
                            >
                              Xóa dòng
                            </Button>
                          ) : (
                            <Typography variant="caption" sx={{color: 'gray'}}>Màu mặc định</Typography>
                          )}
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>

            {/* 5. ẢNH */}
            <Grid item xs={12}>
              <Card elevation={3}>
                <CardHeader title="5. Hình ảnh sản phẩm" titleTypographyProps={{ variant: 'h6', color: 'primary' }} />
                <Divider />
                <CardContent>
                  <Box
                    sx={{
                      border: "2px dashed rgba(255, 255, 255, 0.23)",
                      borderRadius: "8px",
                      padding: "20px",
                      textAlign: "center",
                      cursor: "pointer",
                      "&:hover": { borderColor: "#9155FD", backgroundColor: "rgba(145, 85, 253, 0.05)" },
                      transition: "all 0.3s"
                    }}
                  >
                    <Button variant="contained" component="label" startIcon={<AddIcon />}>
                      Chọn ảnh từ máy tính
                      <input type="file" hidden multiple onChange={handleFileChange} />
                    </Button>
                    <Typography sx={{ mt: 2, fontStyle: 'italic', opacity: 0.7 }}>
                      {files.length > 0 ? `Đã chọn ${files.length} tệp` : "Chưa có tệp nào được chọn. (Nên chọn ảnh tỉ lệ 16:9 hoặc vuông)"}
                    </Typography>
                  </Box>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", marginTop: "20px" }}>
                    {files.map((file, index) => (
                      <div key={index} style={{ position: "relative", display: "inline-block", border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }}>
                        <img
                          src={URL.createObjectURL(file)}
                          alt="preview"
                          style={{ width: "120px", height: "120px", objectFit: "contain", display: "block" }}
                        />
                        <IconButton
                          size="small"
                          style={{ position: "absolute", top: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', color: 'white' }}
                          onClick={() => removeFile(index)}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Grid>

            {/* BUTTON SUBMIT */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                type="submit"
                disabled={loading}
                sx={{
                  padding: "15px",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  boxShadow: "0px 4px 20px rgba(145, 85, 253, 0.4)"
                }}
              >
                {loading ? "Đang xử lý..." : "LƯU SẢN PHẨM"}
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* DIALOG MANAGER */}
        <Dialog
          open={managerConfig.open}
          onClose={closeManager}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{managerConfig.title}</DialogTitle>
          {managerConfig.open && (
              <QuickAttributeManager
                  endpoint={managerConfig.endpoint}
                  fieldName={managerConfig.fieldName}
                  onClose={closeManager}
                  onDataChange={handleDataChange}
              />
          )}
        </Dialog>

        {/* CPU/GPU Manager */}
        <Dialog open={openCpuManager} onClose={() => setOpenCpuManager(false)} fullWidth maxWidth="lg">
            <QuickCpuManager onClose={() => setOpenCpuManager(false)} onDataChange={handleDataChange} />
        </Dialog>

        <Dialog open={openGpuManager} onClose={() => setOpenGpuManager(false)} fullWidth maxWidth="lg">
            <QuickGpuManager onClose={() => setOpenGpuManager(false)} onDataChange={handleDataChange} />
        </Dialog>

        {error && (
          <Typography variant="h6" style={{ color: "red", marginTop: "20px", textAlign: 'center' }}> {error} </Typography>
        )}
      </Box>
    </Fragment>
  );
};

export default CreateLaptopForm;