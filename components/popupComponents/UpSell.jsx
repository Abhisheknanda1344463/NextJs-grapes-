// react
import React from "react";
import {FormattedMessage} from "react-intl";
import {useSelector, useDispatch} from 'react-redux';
import ProductCard from "components/shared/ProductCard";
import UpSellCard from "components/shared/UpSellCard";
import AsyncAction from '../shared/AsyncAction'
import {cartAddItem} from '../../store/cart'
import {setPopup, setPopupName, setUpCrossProd, setTempData} from '../../store/general'

// import CrosselCard from "components/shared/CrosselCard";
function UpSell({product}) {

  const dispatch = useDispatch();
  const selectedData = useSelector((state) => state.locale.code)
  const cartToken = useSelector((state) => state.cartToken)
  const customer = useSelector((state) => state.customer)
  const oldProduct = useSelector(state => state.general.temporaryData[0]);
  // console.log(product, "-upsell")
  // const oldPrice = oldProduct?.min_price
  // const newPrice = Number(product?.min_price).toFixed(2);
  // const curretPrice = (newPrice - oldPrice) < oldPrice ? "" : newPrice - oldPrice
  // const curretPrice = (newPrice - oldPrice)
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
        <AsyncAction
          action={() =>
            cartAddItem(
              product,
              [],
              1,
              cartToken,
              customer,
              selectedData,
              null,
              '',
            )
          }
          render={({run, loading}) => (
            <span
              onClick={(e) => {
                e.preventDefault()
                run()
                // setTempData([product])
                // getUpCrosselProd(product.product_id || product.product.id, 'upsel')
                // dispatch(setPopupName(''))
                dispatch(setPopup(false))
              }}
            >
              <FormattedMessage
                id="noThanks"
                defaultMessage="No, Thanks"
              />
            </span>
          )}
        />

      </div>
    </div>
  )
}

export default UpSell



