// react
import React from "react";
import {FormattedMessage} from "react-intl";
import {connect, useSelector, useDispatch} from 'react-redux';
import ProductCard from "components/shared/ProductCard";
import UpSellCard from "components/shared/UpSellCard";
import AsyncAction from '../shared/AsyncAction'
import {cartAddItem} from '../../store/cart'
import shopApi from '../../api/shop'
import {setPopup, setPopupName, setUpCrossProd, setTempData} from '../../store/general'

// import CrosselCard from "components/shared/CrosselCard";
function UpSell(props) {
  const {
    selectedData,
    cartToken,
    customer,
    oldProduct,
    product,
    setPopupName,
    cartAddItem,
    setPopup,
    setUpCrossProd,
    setTempData,
  } = props


  const getUpCrosselProd = (prodID, type) => {
    switch (type) {
      case 'upsel':
        shopApi.getUpSellProducts(prodID).then(res => {
          setUpCrossProd(res)
        })
        break
      case 'crossel':
        shopApi.getCrossSellProducts(prodID).then(res => {
          if (res.length === 0) {
            setPopup(false)
          }
          // console.log(res, 'PXOPXOXOOXOXOXOXOXOXOXOXOXOXXO')
          setUpCrossProd(res)
        })
        break
    }
  }

  // const dispatch = useDispatch();
  // const selectedData = useSelector((state) => state.locale.code)
  // const cartToken = useSelector((state) => state.cartToken)
  // const customer = useSelector((state) => state.customer)
  // const oldProduct = useSelector(state => state.general.temporaryData[0]);
  // console.log(product, "-upsell")
  // console.log(oldProduct, "-oldProduct")
  // const oldPrice = oldProduct?.min_price
  // const newPrice = Number(product?.min_price).toFixed(2);
  // const curretPrice = (newPrice - oldPrice) < oldPrice ? "" : newPrice - oldPrice
  // const curretPrice = (newPrice - oldPrice)
  let newPrice, oldPrice, currentPrice;
  if (oldProduct?.special_price) {
    oldPrice = oldProduct?.special_price
  } else if (oldProduct?.min_price) {
    oldPrice = oldProduct?.min_price
  }

  if (product?.special_price) {
    newPrice = product?.special_price
  } else if (product?.min_price) {
    newPrice = product?.min_price
  }

  // console.log(oldPrice, "old price")
  // console.log(newPrice, "new Price")
  currentPrice = Number(newPrice) < Number(oldPrice) ? "ups!!!" :((newPrice - oldPrice) + "$")
  // console.log(currentPrice, "current price in upsell")


  return (
    <div className="upsell-content">
      <h3 className="uPsell-title">
        <FormattedMessage
          id="upSell-title"
          defaultMessage={`You are ${currentPrice} away from this item`}
          // defaultMessage={`You are 19$ away from this item`}
        />
      </h3>

      <UpSellCard product={product} upCros={true}/>
      {/*<UpSellCard product={oldProduct} upCros={true}/>*/}
      {/*<ProductCard product={product} upCros={true}/>*/}

      <div className="no-thanks upsell">
        <AsyncAction
          action={() =>
            cartAddItem(
              oldProduct,
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
                setTempData(product)
                getUpCrosselProd(oldProduct.product_id || oldProduct.product.id, 'crossel')
                setPopupName('crossel')
                // setPopup(false)
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

const mapStateToProps = state => ({
  selectedData: state.locale.code,
  cartToken: state.cartToken,
  customer: state.customer,
  oldProduct: state.general.temporaryData[0]
})

const mapDispatchToProps = {
  setPopupName,
  cartAddItem,
  setPopup,
  setUpCrossProd,
  setTempData,
}

export default connect(mapStateToProps, mapDispatchToProps)(UpSell)



