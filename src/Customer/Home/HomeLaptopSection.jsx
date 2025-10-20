import AliceCarousel from "react-alice-carousel";
import HomeLaptopCard from "./HomeLaptopCard";
import { Button } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useState } from "react";
import './index.css'

const HomeLaptopSection = ({ section, data }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const slidePrev = () => setActiveIndex(activeIndex - 1);
  const slideNext = () => setActiveIndex(activeIndex + 1);
  const syncActiveIndex = ({ item }) => setActiveIndex(item);

  const responsive = {
    0: { items: 2, itemsFit: "contain" },
    568: { items: 3, itemsFit: "contain" },
    1024: { items: 5, itemsFit: "contain" },
  };

  const items = data?.slice(0, 10).map((item) => (
    <div key={item.id} className="p-4">
      <HomeLaptopCard laptop={item} />
    </div>
  ));

  const hasData = data && data.length > 0;
  const canSlideNext = hasData && activeIndex < items.length - responsive[1024].items;
  const canSlidePrev = hasData && activeIndex > 0;

  return (
    <div className="relative px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-900 py-5">{section}</h2>
      {!hasData ? (
        <p className="text-center text-gray-500 py-10">Chưa có dữ liệu</p>
      ) : (
        <div className="relative border p-5">
          <AliceCarousel
            disableButtonsControls
            disableDotsControls
            mouseTracking
            items={items}
            activeIndex={activeIndex}
            responsive={responsive}
            onSlideChanged={syncActiveIndex}
            animationType="fadeout"
            animationDuration={2000}
          />
          {canSlideNext && (
            <Button
              onClick={slideNext}
              variant="contained"
              className="z-50"
              sx={{
                position: "absolute",
                top: "8rem",
                right: "0rem",
                transform: "translateX(50%) rotate(90deg)",
              }}
              aria-label="next"
            >
              <ArrowForwardIosIcon sx={{ transform: "rotate(-90deg)" }} />
            </Button>
          )}
          {canSlidePrev && (
            <Button
              onClick={slidePrev}
              variant="contained"
              className="z-50"
              sx={{
                position: "absolute",
                top: "8rem",
                left: "0rem",
                transform: "translateX(-50%) rotate(90deg)",
              }}
              aria-label="previous"
            >
              <ArrowForwardIosIcon sx={{ transform: "rotate(90deg)" }} />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default HomeLaptopSection;