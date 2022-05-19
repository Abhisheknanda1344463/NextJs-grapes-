// react
import React, {useEffect} from 'react'
import {connect, useSelector, useDispatch} from 'react-redux'
import {FormattedMessage} from "react-intl";
import CrosselCard from 'components/shared/CrosselCard'
import {setPopup, setPopupName, setUpCrossProd, setTempData} from '../../store/general'

function CrosselSecond({product}) {

  const dispatch = useDispatch();

  useEffect(() => {
    // console.log(product)
  }, [product])


  return (
    <div className="crossel-content">
      <h3 className="crossel_tittle__heading">
        <FormattedMessage
          id="also-buy"
          defaultMessage="People also buy these products"
        />
      </h3>
      <div className="crossel_body">

        <>
          {
            product.length === 3
              ? <CrosselCard product={product[2]} only={true}/>
              : <>
                <CrosselCard product={product[2]}/>
                <CrosselCard product={product[3]}/>
              </>
          }

        </>

      </div>

      <span
        className="no-thanks"
        onClick={() => dispatch(setPopup(false))}
      >
        <FormattedMessage
          id="continue"
          defaultMessage="Continue"
        />
      </span>
    </div>
  );
}

export default CrosselSecond;
