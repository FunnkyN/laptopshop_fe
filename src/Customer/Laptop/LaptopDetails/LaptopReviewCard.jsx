import React from "react";
import { Avatar } from "@mui/material";
import { Rating, Box, Typography, Grid } from "@mui/material";

const LaptopReviewCard = ({ item }) => {
  const [value, setValue] = React.useState(4.5);
  return (
    <div className="">
      <Grid container spacing={2} gap={3}>
        <Grid item xs={1}>
          <Box>
            <Avatar
              className="text-white"
              sx={{ width: 56, height: 56, bgcolor: "#9155FD" }}
              alt={item.user.name}
              src=""
            >
              {item.user.name.charAt(0).toUpperCase()}
            </Avatar>
          </Box>
        </Grid>
        <Grid item xs={9}>
          <div className="space-y-2">
            <div className="">
              <p className="font-semibold text-lg">
                {item.user.name} ({new Date(item.createdAt).toLocaleDateString('vi-VN')})
              </p>
            </div>
            <div>
              <Rating
                value={item.rating}
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
                name="half-rating"
              />
            </div>
            <p>
              {item.review}
            </p>
          </div>
        </Grid>
      </Grid>
      <div className="col-span-1 flex"></div>
    </div>
  );
};
export default LaptopReviewCard;

