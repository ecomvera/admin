// @ts-ignore
import Slider from "react-slick";
import { FiChevronLeft, FiChevronRight, FiChevronUp, FiChevronDown } from "react-icons/fi";

function Carousel({
  children,
  isVertical = false,
  infinite = false,
  nodots = false,
}: {
  children: any;
  isVertical?: boolean;
  infinite?: boolean;
  nodots?: boolean;
}) {
  const settings = {
    dots: !nodots,
    infinite: !infinite,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    initialSlide: 0,
    vertical: isVertical,
    verticalSwiping: isVertical,
    nextArrow: <NextArrow isVertical={isVertical} />,
    prevArrow: <PrevArrow isVertical={isVertical} />,
    responsive: isVertical
      ? []
      : [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 4,
              slidesToScroll: 1,
              infinite: true,
              dots: !nodots,
            },
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
              infinite: true,
              dots: !nodots,
            },
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
              infinite: true,
              dots: !nodots,
            },
          },
        ],
  };
  return (
    <div className="slider-container mx-auto h-full">
      <Slider {...settings} className="h-full">
        {children}
      </Slider>
    </div>
  );
}

function PrevArrow(props: any) {
  const { onClick, isVertical } = props;
  return (
    <div
      className={`absolute ${isVertical ? "top-[-30px] w-full" : "left-0 bottom-[45%]"} z-10 cursor-pointer`}
      onClick={onClick}
    >
      {isVertical ? (
        <FiChevronUp className="text-2xl laptop:text-4xl text-dark-4 mx-auto" />
      ) : (
        <FiChevronLeft className="text-2xl laptop:text-4xl text-dark-4" />
      )}
    </div>
  );
}

function NextArrow(props: any) {
  const { onClick, isVertical } = props;
  return (
    <div
      className={`absolute ${isVertical ? "bottom-[-30px] w-full" : "right-0 top-[45%]"} z-10 cursor-pointer`}
      onClick={onClick}
    >
      {isVertical ? (
        <FiChevronDown className="text-2xl laptop:text-4xl text-dark-4 mx-auto" />
      ) : (
        <FiChevronRight className="text-2xl laptop:text-4xl text-dark-4" />
      )}
    </div>
  );
}

export default Carousel;
