"use client";

import Image from "next/image";
import { useState } from "react";
import { IProduct } from "@/types";
import { Button } from "../ui/button";
import Link from "next/link";

const ProductDetails = ({ data }: { data: IProduct }) => {
  return (
    <div className="py-5">
      <div className="flex flex-col tablet:flex-row">
        <LeftGallaryView images={data.images} />
        <ProductDetail data={data} />
      </div>
    </div>
  );
};

const LeftGallaryView = ({ images }: { images: IProduct["images"] }) => {
  const [currentSlide, setCurrentSlide] = useState(images[0].url);

  const handleSlideChange = (url: string) => {
    setCurrentSlide(url);
  };

  return (
    <>
      <div className="flex justify-center h-[330px] mobile:h-[420px]">
        <div className="relative flex flex-col w-[80px] h-full">
          {images.map((image, index) => (
            <div key={index} className="relative cursor-pointer border m-[2px] h-[80px] bg-gray-100">
              <Image
                layout="fill"
                key={index}
                src={image.url}
                alt="product"
                objectFit="contain"
                objectPosition="center"
                onClick={() => handleSlideChange(image.url)}
              />
            </div>
          ))}
        </div>

        <div className="relative w-[350px] border ">
          <Image layout="fill" src={currentSlide} quality={100} objectFit="contain" objectPosition="center" alt="product" />
        </div>
      </div>
    </>
  );
};

const ProductDetail = ({ data }: { data: IProduct }) => {
  const sizes = data.sizes;

  return (
    <div className="w-full px-2 tablet:px-5 laptop:px-10 mt-5 tablet:mt-0">
      <Link href={`/e/${data._id}?path=/p/${data._id}`}>
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
      <p className="text-base mobile:text-lg font-semibold text-dark-3 uppercase mt-5">Select Size</p>
      <div className="flex gap-1">
        {sizes.map((size) => (
          <div key={size} className="border border-light-3 px-3 py-1 cursor-pointer">
            <p className="text-base mobile:text-lg font-semibold text-dark-3">{size}</p>
          </div>
        ))}
      </div>
      <p className="text-xl font-semibold text-dark-3 mt-10">Key Highlights</p>
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
