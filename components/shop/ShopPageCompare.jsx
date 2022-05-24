// react
import React from "react";

// third-party
import classNames from "classnames";
import { connect } from "react-redux";
import { Helmet } from "react-helmet-async";
import Link from 'next/link';

// application
import AsyncAction from "../shared/AsyncAction";
import Currency from "../shared/Currency";
import PageHeader from "../shared/PageHeader";
import Rating from "../shared/Rating";
import { cartAddItem } from "../../store/cart";
import { compareRemoveItem } from "../../store/compare";
import { url } from "../../services/utils";
import Image from 'components/hoc/Image';
// data stubs
import theme from "../../data/theme";

function ShopPageCompare(props) {
    const { products, compareRemoveItem, cartAddItem } = props;
    const breadcrumb = [
        { title: "Home", url: "" },
        { title: "Comparison", url: "" },
    ];

    let content;

    if (products.length) {
        const attributes = [];

        products.forEach((product) =>
            product.attributes.forEach((productAttribute) => {
                let attribute = attributes.find((x) => x.name === productAttribute.name);

                if (!attribute) {
                    attribute = {
                        name: productAttribute.name,
                        values: {},
                    };
                    attributes.push(attribute);
                }

                attribute.values[product.id] = productAttribute.values.map((x) => x.name).join(", ");
            })
        );

        const productInfoRow = products.map((product) => {
            let image;

            if (product.images.length > 0) {
                image = (
                    <div className="compare-table__product-image product-image">
                        <div className="product-image__body">
                            <Image className="product-image__img" src={product.images[0]} alt="" layout='fill' />
                        </div>
                    </div>
                );
            }

            return (
                <td key={product.id}>
                    <Link href={url.product(product)} className="compare-table__product-link">
                        <a>
                            {image}
                            <div className="compare-table__product-name">{product.name}</div>
                        </a>
                    </Link>
                </td>
            );
        });

        const ratingRow = products.map((product) => (
            <td key={product.id}>
                <div className="compare-table__product-rating">
                    <Rating value={product.rating} />
                </div>
                <div className=" compare-table__product-rating-legend">{`${product.reviews} Reviews`}</div>
            </td>
        ));

        const availabilityRow = products.map((product) => {
            let badge;

            if (product.availability === "in-stock") {
                badge = <span className="compare-table__product-badge badge badge-success">In Stock</span>;
            }

            return <td key={product.id}>{badge}</td>;
        });

        const priceRow = products.map((product) => (
            <td key={product.id}>
                <Currency value={product.price} />
            </td>
        ));

        const addToCartRow = products.map((product) => {
            const renderButton = ({ run, loading }) => {
                const classes = classNames("btn btn-primary", {
                    "btn-loading": loading,
                });

                return (
                    <button type="button" onClick={run} className={classes}>
                        Add To Cart
                    </button>
                );
            };

            return (
                <td key={product.id}>
                    <AsyncAction action={() => cartAddItem(product)} render={renderButton} />
                </td>
            );
        });

        const attributeRows = attributes.map((feature, index) => {
            const rows = products.map((product) => <td key={product.id}>{feature.values[product.id]}</td>);

            return (
                <tr key={index}>
                    <th>{feature.name}</th>
                    {rows}
                </tr>
            );
        });

        const removeRow = products.map((product) => {
            const renderButton = ({ run, loading }) => {
                const classes = classNames("btn btn-secondary btn-sm", {
                    "btn-loading": loading,
                });

                return (
                    <button type="button" onClick={run} className={classes}>
                        Remove
                    </button>
                );
            };

            return (
                <td key={product.id}>
                    <AsyncAction action={() => compareRemoveItem(product.id)} render={renderButton} />
                </td>
            );
        });

        content = (
            <div className="block">
                <div className="container">
                    <div className="table-responsive">
                        <table className="compare-table">
                            <tbody>
                                <tr>
                                    <th>Product</th>
                                    {productInfoRow}
                                </tr>
                                <tr>
                                    <th>Rating</th>
                                    {ratingRow}
                                </tr>
                                <tr>
                                    <th>Availability</th>
                                    {availabilityRow}
                                </tr>
                                <tr>
                                    <th>Price</th>
                                    {priceRow}
                                </tr>
                                <tr>
                                    <th>Add To Cart</th>
                                    {addToCartRow}
                                </tr>
                                {attributeRows}
                                <tr>
                                    <th aria-label="Remove" />
                                    {removeRow}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    } else {
        content = (
            <div className="block block-empty">
                <div className="container">
                    <div className="block-empty__body">
                        <div className="block-empty__message">You have not chosen any products to compare!</div>
                        <div className="block-empty__actions">
                            <Link href="/" className="btn btn-orange btn-primary f16" >
                                Continue
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>{`Compare Products Page — ${theme.name}`}</title>
            </Helmet>

            <PageHeader header="Comparison" breadcrumb={breadcrumb} />

            {content}
        </React.Fragment>
    );
}

const mapStateToProps = (state) => ({
    products: state.compare,
});

const mapDispatchToProps = {
    cartAddItem,
    compareRemoveItem,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopPageCompare);
