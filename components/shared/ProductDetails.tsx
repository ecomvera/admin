"use client";

import Image from "next/image";
import Carousel from "./Carousel";
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
    <div className="gap-2 tablet:gap-5 flex justify-center py-8 h-fit">
      <div className="w-[80px]">
        <Carousel isVertical infinite nodots>
          {images.map((image, index) => (
            <Image
              key={index}
              src={image.url}
              alt="product"
              width={20}
              height={0}
              sizes="100vw"
              onClick={() => handleSlideChange(image.url)}
              className="cursor-pointer"
            />
          ))}
        </Carousel>
      </div>

      <div className="">
        <Image
          src={currentSlide}
          alt="product"
          width={400}
          height={0}
          sizes="100vw"
          onError={() => setCurrentSlide("/assets/not-found.jpg")}
        />
      </div>
    </div>
  );
};

const ProductDetail = ({ data }: { data: IProduct }) => {
  const sizes = data.sizes;

  return (
    <div className="flex-1 px-2 tablet:px-5 laptop:px-10">
      <h2 className="text-3xl text-dark-3 font-bold mt-8">
        <Link href={`/e/${data._id}?path=/p/${data._id}`}>
          <Button variant="outline" size="lg" className="mr-2 text-lg border-blue-700">
            Edit
          </Button>
        </Link>{" "}
        {data.name}
      </h2>
      <p className="mt-2 text-lg">{data.description}</p>

      <p className="text-3xl font-semibold mt-5">Rs. {data.price}</p>
      <p className="text-sm font-normal text-light-3">MRP {data.mrp}</p>

      <div className="border w-fit border-light-3 px-3 my-5">
        <p className="text-lg font-semibold text-light-3">{data.material}</p>
      </div>

      <p className="text-lg font-semibold text-dark-3 uppercase mt-10">Product Sizes</p>
      <div className="flex gap-2 mt-3">
        {sizes.map((size) => (
          <div key={size} className="border border-light-3 px-3 py-1 cursor-pointer">
            <p className="text-lg font-semibold text-dark-3">{size}</p>
          </div>
        ))}
      </div>

      <p className="text-2xl font-semibold text-dark-3 mt-10">Key Highlights</p>
      <div className="pt-5">
        {data.attributes.map(({ key, value }) => (
          <div className="flex flex-col" key={key}>
            <p className="text-lg font-semibold text-dark-3">{key}</p>
            <p className="text-lg font-normal text-light-3">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetails;
