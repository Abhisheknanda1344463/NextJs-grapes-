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
          setUpCrossProd(res)
        })
        break
    }
  }

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

  currentPrice = Number(newPrice) < Number(oldPrice) ? "ups!!!" : ((newPrice - oldPrice) + " ֏")


  return (
    <div className="upsell-content">
      <h3 className="uPsell-title">
        <FormattedMessage
          id="upSell-title"
          defaultMessage={`You are ${currentPrice} away from this item`}
        />
      </h3>
      <hr/>

      <UpSellCard product={product} oldProduct={oldProduct} upCros={true}/>

      {/* this is old version of "No thanks logic",  keep this for some time*/}

      {/*<div className="no-thanks upsell">
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

      </div>*/}
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



