// react
import React from "react";

// third-party
import PropTypes from "prop-types";

// application
import BlockHeaderCustom from "../shared/BlockHeaderCustom";
import ProductCard from "../shared/ProductCard";
import { Helmet } from "react-helmet-async";
import UpSellCrossel from "components/popupComponents/UpSellCrossel";
import Head from "next/head";

function BlockProducts(props) {
  const { customer, title, layout, featuredProduct, products, addInClass } =
    props;

  let large = null;
  let smalls = null;
  const backOrderAllow = null;
  const outStockAllow = null;
  const arrayMeta = [];



  const schemaProducts = {
    "@context": "/products",
    "@type": "ItemList",
    "name": "Products",
    "itemListElement": []
  }

  if (featuredProduct) {
    large = (
      <div className="block-products__featured">
        <div className="block-products__featured-item">
          <ProductCard product={featuredProduct} customer={customer} />
        </div>
      </div>
    );
  }
  if (products.length > 0) {


    const productsList = products.map((product, index) => {
      // arrayMeta.push(<meta name="name" content={product.name} />)
      // arrayMeta.push(<meta name="description" content={product.desc} />)

      schemaProducts.itemListElement.push({
        "@type": "ListItem",
        "position": products.indexOf(product),
        "item": {
          "name": product.name,
          "description": product.meta_description || product.description,
          "price": product.formatted_price
        }
      })

      return (
        <div key={index} className="product-card-parent">
          <div className="block-products__list-item">
            <ProductCard product={product} customer={customer} />
          </div>
        </div>
      );
    });

    smalls = <div className="block-products__list">{productsList}</div>;
  }

  function renderSmall() {
    if (products.length > 0)
      return (
        <div className="block-products__list">
          {products.map((product, index) => {

            schemaProducts.itemListElement.push({
              "@type": "ListItem",
              "position": products.indexOf(product),
              "item": {
                "name": product.name,
                "description": product.meta_description || product.description,
                "price": product.formatted_price
              }
            })
            // arrayMeta.push(<meta name="name" content={product.name} />)
            // arrayMeta.push(<meta name="description" content={product.desc} />)
            return (
              <div key={index} className="product-card-parent">
                <div className="block-products__list-item">
                  <ProductCard product={product} customer={customer} />
                </div>
              </div>
            );
          })}
        </div>
      );
  }

  return (
    <React.Fragment>
      <Head>
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaProducts) }}
        />
      </Head>

      <div className={`block-products block-products--layout--${layout}`}>
        <div className="container p-0 home-product-container">
          {/*<div className="container_fm">*/}

          {smalls ? <BlockHeaderCustom title={title} /> : ""}

          <div className={`block-products__body block-${addInClass}-products`}>
            {layout === "large-first" && large}
            {renderSmall()}
            {layout === "large-last" && large}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default React.memo(BlockProducts);

BlockProducts.propTypes = {
  title: PropTypes.string.isRequired,
  featuredProduct: PropTypes.object,
  products: PropTypes.array,
  layout: PropTypes.oneOf(["large-first", "large-last"]),
};

BlockProducts.defaultProps = {
  products: [],
  layout: "large-first",
};
