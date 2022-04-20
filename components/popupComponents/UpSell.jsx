// react
import React from "react";
import {FormattedMessage} from "react-intl";
import {useSelector, useDispatch} from 'react-redux';
import ProductCard from "components/shared/ProductCard";
import UpSellCard from "components/shared/UpSellCard";

// import CrosselCard from "components/shared/CrosselCard";
function UpSell({product}) {


  // const oldPrice = useSelector(state => state.general.temporaryData[0].price);
  // console.log(product, "-upsell")
  // const newPrice = Number(product?.min_price).toFixed(2);
  // const curretPrice = (newPrice - oldPrice) < oldPrice ? "" : newPrice - oldPrice
  return (
    <div className="upsell-content">
      <h3 className="uPsell-title">
        <FormattedMessage
          id="upSell-title"
          // defaultMessage={`You are ${curretPrice}$ away from this item`}
          defaultMessage={`You are 19$ away from this item`}
        />
      </h3>

      <UpSellCard product={product} upCros={true}/>
      {/*<ProductCard product={props.product} upCros={true}/>*/}

      <div className="no-thanks">
        <FormattedMessage id="noThanks" defaultMessage="No, Thanks"/>
      </div>
    </div>
  )
}

export default UpSell



