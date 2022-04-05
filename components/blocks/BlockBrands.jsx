// react
import React from "react";

// third-party
import Link from "next/link";
// application
import StroykaSlick from "../shared/StroykaSlick";

// data stubs
import brands from "../../data/shopBrands";
import Image from "components/hoc/Image";

const slickSettings = {
  dots: false,
  arrows: false,
  infinite: true,
  speed: 400,
  slidesToShow: 6,
  slidesToScroll: 6,
  responsive: [
    {
      breakpoint: 1199,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 5
      }
    },
    {
      breakpoint: 991,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4
      }
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3
      }
    },
    {
      breakpoint: 575,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      }
    }
  ]
};

export default function BlockBrands() {
  const brandsList = brands.map((brand, index) => (
    <div key={index} className="block-brands__item">
      <Link href="/">
        <Image src={brand.image} alt={`${brand.name}`} layout="fill" />
      </Link>
    </div>
  ));

  return (
    <div className="block block-brands">
      <div className="container">
        <div className="block-brands__slider">
          <StroykaSlick {...slickSettings}>{brandsList}</StroykaSlick>
        </div>
      </div>
    </div>
  );
}
