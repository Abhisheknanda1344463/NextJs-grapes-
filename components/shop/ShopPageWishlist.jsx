// react
import React from "react";
//moment convertor
import moment from 'moment'
// third-party
import classNames from "classnames";
import { connect } from "react-redux";
import { Helmet } from "react-helmet-async";
import Link from "next/link";

// application
import AsyncAction from "../shared/AsyncAction";
import Currency from "../shared/Currency";
import PageHeader from "../shared/PageHeader";
import Rating from "../shared/Rating";
import { cartAddItem } from "../../store/cart";
import { Cross12Svg } from "../../svg";
import { url } from "../../services/utils";
import { wishlistRemoveItem } from "../../store/wishlist";
import { FormattedMessage } from "react-intl";
import Image from "components/hoc/Image";
// data stubs
import theme from "../../data/theme";

import { TrashSvg } from "../../svg";
import WishlistSideAccount from "./WishlistSideAccount";
import { apiImageUrl } from "../../helper";

function ShopPageWishlist(props) {
  const { wishlist, cartAddItem, wishlistRemoveItem, cartToken, customer } =
    props;
  const breadcrumb = [
    { title: <FormattedMessage id="home" defaultMessage="Home" />, url: "/" },
    {
      title: <FormattedMessage id="wishlist" defaultMessage="Wishlist" />,
      url: "",
    },
  ];

  let content;
  const CONFIG = 'simple'

  if (wishlist.length) {
    const itemsList = wishlist.map((item, index) => {
      let image;

      if (item.images && item.images.length > 0) {
        image = (
          <div className="product-image">
            <Link href={url.product(item)} className="product-image__body">
              <Image
                className="product-image__img"
                src={
                  item.images[0].path
                    ? `${apiImageUrl}/cache/medium/` + item.images[0].path
                    : `${apiImageUrl}/cache/medium/` + item.images[0]
                }
                alt=""
                layout="fill"
              />
            </Link>
          </div>
        );
      }

      const renderAddToCarButton = ({ run, loading }) => {
        const classes = classNames(
          "wishlist-card-add-button btn-orange rounded-pill",
          {
            "btn-loading": loading,
          }
        );

        return (
          <button type="button" onClick={run} className={classes}>
            <FormattedMessage id="add.tocart" defaultMessage="Add to cart" />
          </button>
        );
      };

      const renderRemoveButton = ({ run, loading }) => {
        const classes = classNames("wishlist-card-remove", {
          "btn-loading": loading,
        });

        return (
          <button
            type="button"
            onClick={run}
            className={classes}
            aria-label="Remove"
          >
            {" "}
            <TrashSvg className="wishlist-card-remove-icon" />{" "}
            {/*<Cross12Svg />*/}
          </button>
        );
      };
      // console.log(item, 'itemitemitemitemitem')
      let price;

      let newDate = new Date()
      const date_from = moment.unix(item.special_price_from).format('YYYY-MM-DD')
      const date_now = moment(newDate).format('YYYY-MM-DD')
      const date_to = moment.unix(item.special_price_to).format('YYYY-MM-DD')

      if (!item?.special_price && CONFIG === 'configurable') {
        price = (
          <div className="product-card__prices">
            <Currency value={item.formatted_price} />
          </div>
        );
      }else if(item?.special_price && date_now >= date_from && date_now <= date_to) {
        price = (
            <div className="product-card__prices">
            <span className="product-card__new-price">
               <span className="product-card__symbol">֏</span>
              <Currency value={Number(item.special_price).toFixed(0)} />
            </span>
              {
                <span className="product-card__old-price">
                  <span className="product-card__symbol">֏</span>
                 <Currency value={Number(item.price).toFixed(0)} />
              </span>
              }
            </div>
        )
      }

      // else if (
      //   (date_now > date_from &&
      //     date_now < date_to &&
      //     item.formatted_special_price < item.formatted_price &&
      //     item.formatted_special_price) ||
      //   (item.special_price_to == null &&
      //     date_from < date_now &&
      //     item.formatted_special_price < item.formatted_price &&
      //     item.formatted_special_price) ||
      //   (item.special_price_from == null &&
      //     date_to > date_now &&
      //     item.formatted_special_price < item.formatted_price &&
      //     item.formatted_special_price) ||
      //   (item.special_price_to == null &&
      //     item.special_price_from == null &&
      //     item.formatted_special_price < item.formatted_price &&
      //     item.formatted_special_price)
      // ) {
      //   price = (
      //     <div className="product-card__prices">
      //       <span className="product-card__new-price">
      //         <span className="product-card__symbol">֏</span>
      //          <Currency value={Number(item.special_price).toFixed(0)}/>
      //         {/*<Currency value={item.formatted_special_price} />*/}
      //       </span>
      //       {
      //         <span className="product-card__old-price">
      //             <span className="product-card__symbol">֏</span>
      //             <Currency value={Number(item.price).toFixed(0)} />
      //           {/*<Currency value={item.formatted_price} />*/}
      //         </span>
      //       }
      //     </div>
      //   );
      // }

      else if (item?.product?.type === "configurable") {
        price = (
          <div className="product-card__prices">
            <span className="product-card__symbol">֏</span>
            <Currency value={Number(item.min_price).toFixed(0)} />
          </div>
        );
      } else {
        price = (
            <div className="product-card__prices">
              <span className="product-card__symbol">֏</span>
              <Currency value={Number(item.price).toFixed(0)} />
            </div>
        );
      }

      return (
        <div key={index} className="wishlist-card-parent">
          <div className="wishlist-card">
            <div>
              <AsyncAction
                action={() => wishlistRemoveItem(item.id)}
                render={renderRemoveButton}
              />
            </div>

            <div className="wishlist-card-image">{image}</div>
            <Link href={url.product(item)}>
              <p className="wishlist__product-name">{item.name}</p>
            </Link>
            <p className="wishlist-card-price">{price}</p>
            {/*<div>*/}
            {/*  <AsyncAction*/}
            {/*    action={() => cartAddItem(item, [], 1, cartToken, customer)}*/}
            {/*  // render={renderAddToCarButton}*/}
            {/*  />*/}
            {/*</div>*/}

            <button className="btn-orange no-border rounded-pills w90">
              <AsyncAction
                action={() => cartAddItem(item, [], 1, cartToken, customer)}
                render={renderAddToCarButton}
              />
            </button>
          </div>
        </div>
      );

      // return (
      //      <tr key={index} className="wishlist__row">
      //         <td className="wishlist__column wishlist__column--image">
      //             {image}
      //         </td>
      //         <td className="wishlist__column wishlist__column--product">
      //             <Link href={url.product(item)} className="wishlist__product-name">{item.name}</Link>
      //             {/* <div className="wishlist__product-rating">
      //                 <Rating value={item.rating} />
      //                 <div className="wishlist__product-rating-legend">{`${item.reviews} Reviews`}</div>
      //             </div> */}
      //         </td>
      //         {/*<td className="wishlist__column wishlist__column--stock">*/}
      //         {/*    <div className="badge badge-success"><FormattedMessage id="inStock" defaultMessage="Առկա է" /></div>*/}
      //         {/*</td>*/}
      //         <td className="wishlist__column wishlist__column--price"><Currency value={item.price} /></td>
      //         <td className="wishlist__column wishlist__column--tocart">
      //             <AsyncAction
      //                 action={() => cartAddItem(item,  [], 1,cartToken,customer)}
      //                 render={renderAddToCarButton}
      //             />
      //         </td>
      //         <td className="wishlist__column wishlist__column--remove">
      //             <AsyncAction
      //                 action={() => wishlistRemoveItem(item.id)}
      //                 render={renderRemoveButton}
      //             />
      //         </td>
      //     </tr>
      // );
    });

    content = (
      <div className="block">
        <div className="container p-0 wishlist-container">
          <div className="wishlist">
            {/* <WishlistSideAccount /> */}

            {/*<thead className="wishlist__head">*/}
            {/*    <tr className="wishlist__row">*/}
            {/*        <th className="wishlist__column wishlist__column--image"><FormattedMessage id="image" defaultMessage="Նկար" /></th>*/}
            {/*        <th className="wishlist__column wishlist__column--product"><FormattedMessage id="product" defaultMessage="Ապրանք" /></th>*/}
            {/*        <th className="wishlist__column wishlist__column--stock"> <FormattedMessage id="status" defaultMessage="Կարգավիճակ" /></th>*/}
            {/*        <th className="wishlist__column wishlist__column--price"><FormattedMessage id="Price" defaultMessage="Գին" /></th>*/}
            {/*        <th className="wishlist__column wishlist__column--tocart" aria-label="Add to cart" />*/}
            {/*        <th className="wishlist__column wishlist__column--remove" aria-label="Remove" />*/}
            {/*    </tr>*/}
            {/*</thead>*/}
            <div className="wishlist__body">{itemsList}</div>
          </div>
        </div>
      </div>
    );
  } else {
    content = (
      <div className="block block-empty">
        {/* <WishlistSideAccount /> */}
        {/*<div className="container">*/}
        <div className="container block-empty__body">
          <h3 className="text-center font-weight-light mt-5">
            {" "}
            <FormattedMessage
              id="wishlistEmpty"
              defaultMessage="Your wishlist is empty"
            />{" "}
          </h3>
          <div className="block-empty__actions">
            <Link href="/">
              <a className="btn btn-orange rounded-pill f16">
                <FormattedMessage id="continue" defaultMessage="Continue" />
              </a>
            </Link>
          </div>
        </div>
        {/*</div>*/}
      </div>
    );
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>{`Wish List — ${theme.name}`}</title>
      </Helmet>
      <PageHeader header="" breadcrumb={breadcrumb} />
      <h1 className="text-center">
        <FormattedMessage id="account.wishlist" defaultMessage="Wish List" />
      </h1>
      {content}
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  wishlist: state.wishlist,
  cartToken: state.cartToken,
  customer: state.customer,
});

const mapDispatchToProps = {
  cartAddItem,
  wishlistRemoveItem,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopPageWishlist);
