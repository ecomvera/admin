"use client";

import Image from "next/legacy/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IKeyValue, IProduct } from "@/types";
import { Button } from "../ui/button";
import Link from "next/link";
import { AspectRatio } from "../ui/aspect-ratio";

const ProductDetails = ({ data }: { data: IProduct }) => {
  const [currentColor, setCurrentColor] = useState(data.colors[0]);

  return (
    <div className="py-5">
      <div className="flex flex-col tablet:flex-row">
        <LeftGallaryView images={data.images} currentColor={currentColor} />
        <ProductDetail data={data} currentColor={currentColor} setCurrentColor={setCurrentColor} />
      </div>
    </div>
  );
};

const LeftGallaryView = ({ images, currentColor }: { images: IProduct["images"]; currentColor: string }) => {
  const [currentSlide, setCurrentSlide] = useState("");

  const handleSlideChange = (url: string) => {
    setCurrentSlide(url);
  };

  useEffect(() => {
    setCurrentSlide(images.filter((image) => image.color === currentColor)[0].url);
  }, [currentColor]);

  return (
    <>
      <div className="flex gap-2 justify-center">
        <div className="relative flex flex-col gap-1 w-[80px] h-full">
          {images
            .filter((image) => image.color === currentColor)
            .map((image, index) => (
              <div key={index} className="relative cursor-pointer">
                <AspectRatio ratio={0.8 / 1} className="border rounded-md relative">
                  <Image
                    layout="fill"
                    key={index}
                    src={image.url.split("/upload")[0] + "/upload/w_80/" + image.url.split("/upload")[1]}
                    alt="product"
                    objectFit="contain"
                    objectPosition="center"
                    onMouseEnter={() => {
                      if (currentSlide === image.url) return;
                      handleSlideChange(image.url);
                    }}
                    // onMouseLeave={() => {}}
                  />
                </AspectRatio>
              </div>
            ))}
        </div>

        <div className="relative w-[300px] laptop:w-[400px]">
          <AspectRatio ratio={0.8 / 1} className="border rounded-md relative">
            <Image
              layout="fill"
              src={currentSlide.split("/upload")[0] + "/upload/w_350/" + currentSlide.split("/upload")[1]}
              quality={100}
              objectFit="contain"
              objectPosition="center"
              alt="product"
            />
          </AspectRatio>
        </div>
      </div>
    </>
  );
};

// make text bold with brackets <>
const formatText = (text: string) => {
  const regex = /<([^>]+)>/g;
  const parts = text.split(regex);
  return parts.map((part, index) => (index % 2 === 1 ? <strong key={index}>{part}</strong> : part));
};

const ProductDetail = ({
  data,
  currentColor,
  setCurrentColor,
}: {
  data: IProduct;
  currentColor: string;
  setCurrentColor: Dispatch<SetStateAction<string>>;
}) => {
  const [selectedSize, setSelectedSize] = useState<IKeyValue>();

  return (
    <div className="w-full px-2 tablet:px-5 laptop:px-10 mt-5 tablet:mt-0">
      <div className="text-sm font-semibold text-light-3 mb-5">
        {data.category?.parent?.name} / {data.category?.name}
      </div>

      <Link href={`/e/${data.slug}?path=/p/${data.slug}`}>
        <Button variant="outline" size="sm" className="mr-2 text-lg border-blue-700">
          Edit
        </Button>
      </Link>

      <h2 className="head-text text-dark-3 font-bold mt-5">{data.name}</h2>
      <p className="text-sm mobile:text-lg">{data.description}</p>
      <p className="head-text font-semibold mt-5">
        Rs. {data.price} <span className="text-sm font-normal text-light-3">incl. of all taxes</span>
      </p>
      <p className="text-sm font-normal text-light-3 line-through">MRP {data.mrp}</p>
      <div className="border w-fit border-light-3 px-3 my-5">
        <p className="text-base font-semibold text-light-3">{data.material}</p>
      </div>
      <p className="text-base mobile:text-lg font-semibold text-dark-3 uppercase mt-5">Colors</p>
      <div className="flex gap-1 items-center">
        {data.colors.map((color) => (
          <div
            key={color}
            className="rounded-full cursor-pointer"
            style={{
              border: currentColor === color ? `2px solid ${color}` : "none",
              padding: "2px",
            }}
            onClick={() => setCurrentColor(color)}
          >
            <div className="h-[30px] w-[30px] rounded-full" style={{ backgroundColor: color }}></div>
          </div>
        ))}
      </div>
      <p className="text-base mobile:text-lg font-semibold text-dark-3 uppercase mt-5">Select Size</p>
      <div className="flex gap-2">
        {data.sizes.map((size) => (
          <div key={size.key} className={`cursor-pointer`} onClick={() => setSelectedSize(size)}>
            <div
              key={size.key}
              className={`border-2 ${
                size.key === selectedSize?.key ? "border-2 border-yellow-400 bg-yellow-400" : ""
              } px-3 py-1`}
            >
              <p className="text-base mobile:text-lg font-semibold text-dark-3">{size.key}</p>
            </div>
            {size.quantity && size.quantity < 10 && (
              <p className="text-sm font-semibold text-red-500">{size.quantity} Left</p>
            )}
          </div>
        ))}
      </div>
      {selectedSize && (
        <p className="text-sm font-normal text-dark-3">
          Size: <b>{selectedSize?.key}</b> <span className="ml-2">{formatText(selectedSize?.value)}</span>
        </p>
      )}

      <p className="text-xl font-semibold text-dark-3 mt-5">Key Highlights</p>
      <div className="grid grid-cols-2 gap-5 mt-3">
        {data.attributes.map((item, index) => (
          <div key={index} className="text-lg text-dark-3">
            <p className="font-semibold">{item.key}</p>
            <p>{item.value}</p>
            <div className="w-full mobile:w-1/2 h-[1px] bg-light-3"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetails;
