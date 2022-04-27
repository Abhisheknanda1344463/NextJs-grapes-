// react
import React, {useEffect} from 'react'
import {connect, useSelector, useDispatch} from 'react-redux'
import {FormattedMessage} from 'react-intl'
import {CrosselSvg} from 'svg'
import CrosselCard from 'components/shared/CrosselCard'
import {setPopup, setPopupName, setUpCrossProd, setTempData} from '../../store/general'


function CrossSell({product, hasTitle}) {
  // console.log(product, "product in  crossel")

  const dispatch = useDispatch();
  useEffect(() => {
    console.log(product)
  }, [product])


  return (
    <>
      <div className="crossel-content">
        {hasTitle
          ? (
            <div className="crossel-title">
              <div>
                <CrosselSvg/>
                <span className="crossel_success_message">
            <FormattedMessage
              id="crosselTitle"
              defaultMessage="Your product has been successfully replaced"
            />
          </span>
              </div>
            </div>
          )
          : <></>}
        {/*<h1 className='crossel_tittle__heading'>{hasTitle ? `Congrats!` : ""} People also buy these products</h1>*/}
        <h3 className="crossel_tittle__heading">
          <FormattedMessage
            id="also-buy"
            defaultMessage={`${hasTitle ? " Congrats! " : " "}People also buy these products`}
          />
        </h3>
        <div className="crossel_body">
          {
            product.length !== 0 && product.length >= 2
              // ? product.slice(0, 2).map((prod, ind) => (
              //   <>
              //     <CrosselCard product={prod} key={ind}/>
              //   </>
              // ))
              ? <>
                <CrosselCard product={product[0]}/>
                <CrosselCard product={product[1]}/>
              </>
              : <><CrosselCard product={product[0]} only={true}/></>
          }
        </div>
        <span
          className="no-thanks"
          onClick={() => {
            product.length > 2 ? dispatch(setPopupName("crossel2")) : ""
            product.length > 2 ? dispatch(setPopup(true)) : dispatch(setPopup(false))
          }}
        >
        <FormattedMessage
          id="noThanks"
          defaultMessage="Continue"
        />
      </span>
      </div>
    </>
  )
}


export default CrossSell
