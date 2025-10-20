import {
  Button,
  Grid,
  Rating,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { useDispatch, useSelector } from "react-redux";
import { createReview } from "../../Redux/Customers/Review/Action";
import { useNavigate, useParams } from "react-router-dom";
import { findLaptopById } from "../../Redux/Admin/Laptop/Action";
// [UPDATE] Import API_BASE_URL và BlobImage
import { API_BASE_URL } from "../../Config/api";
import BlobImage from "../../until/BlobImage";

const RateLaptop = () => {
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [rating, setRating] = useState();
  const isLargeScreen = useMediaQuery("(min-width:1200px)");
  const dispatch = useDispatch();
  const { customersLaptop } = useSelector((store) => store);
  const { laptopId } = useParams();
  const navigate=useNavigate();

  const handleRateLaptop = (e, value) => {
    console.log("rating ----- ", value);
    setRating(value);
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log(formData);
    dispatch(createReview({review:formData.title,laptopId}))
    setFormData({title:"",description:""})
    navigate(`/laptop/${laptopId}`)

  };
  
  useEffect(() => {
    dispatch(findLaptopById({ laptopId }));
  }, []);

  return (
    <div className="px-5 lg:px-20">
      <h1 className="text-xl p-5 shadow-lg mb-8 font-bold">
        Rate & Review Laptop
      </h1>
      <Grid sx={{ justifyContent: "space-between" }} container>
        <Grid
          className="flex lg:items-center shadow-lg border rounded-md p-5"
          item
          xs={12}
          lg={5.8}
        >
          <div>
            {/* [UPDATE] Thay thế img bằng BlobImage */}
            <div className="w-[5rem] lg:w-[15rem]">
                <BlobImage
                  className="w-full h-full object-contain"
                  src={customersLaptop.laptop?.imageUrl?.startsWith("http")
                        ? customersLaptop.laptop.imageUrl
                        : `${API_BASE_URL}${customersLaptop.laptop?.imageUrl}`}
                  alt=""
                />
            </div>
          </div>
          <div className="ml-3 lg:ml-5 space-y-2 lg:space-y-4">
            <p className="lg:text-lg">{customersLaptop.laptop?.title}</p>
            <p className="opacity-50 font-semibold">
              {customersLaptop.laptop?.brand}
            </p>
            <p>{customersLaptop.laptop?.price?.toLocaleString('vi-VN')} VND</p>
            <p>Size: Free</p>
           {customersLaptop.laptop?.color && <p>Color: {customersLaptop.laptop?.color}</p>}
            
            <div>
              <p className="space-y-2 font-semibold">
                <FiberManualRecordIcon
                  sx={{ width: "15px", height: "15px" }}
                  className="text-green-600  mr-2"
                />
                <span>Delivered On Mar 03</span>{" "}
              </p>
              <p className="text-xs">Your Item Has Been Delivered</p>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} lg={6}>
          <div className={`${!isLargeScreen ? "py-10" : ""} space-y-5`}>
            <div className="shadow-md border rounded-md p-5">
              <Typography className="font-semibold" component="legend">
                Rate This Laptop
              </Typography>
              <Rating
                name="simple-controlled"
                value={rating}
                onChange={(event, newValue) => {
                  handleRateLaptop(event, newValue);
                }}
              />
            </div>
            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5 shadow-md border rounded-md"
            >
              <TextField
                label="Title"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.title}
                onChange={handleChange}
                name="title"
              />
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                margin="normal"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
                name="description"
              />
              <Button type="submit" variant="contained" color="primary">
                Submit Review
              </Button>
            </form>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default RateLaptop;