// react
import React,{useEffect} from 'react'
import {connect} from 'react-redux'
import {FormattedMessage} from 'react-intl'
import {CrosselSvg} from 'svg'
import CrosselCard from 'components/shared/CrosselCard'


function CrossSell({product}) {
  console.log(product, "product in  crossel")
  useEffect(() => {},[product])
  return (
    <div className="crossel-content">
      <div className="crossel-title">
        <div>
          <CrosselSvg/>
          <span>
            <FormattedMessage
              id="crosselTitle"
              defaultMessage="Your product has been successfully replaced"
            />
          </span>
        </div>
      </div>
      <h1 style={{textAlign: "center", margin: "20px 0"}}>Congrats! People also buy these products</h1>
      <div style={{display: 'flex', justifyContent: "center", gap: "50px"}}>
        {
          product.length !== 0 && product.length >= 2
            ? product.slice(0, 2).map((prod, ind) => (
              <CrosselCard product={prod} key={ind}/>
            ))
            : <CrosselCard product={product}/>
        }
      </div>
      <span className="no-thanks">
        <FormattedMessage id="noThanks" defaultMessage="No, Thanks"/>
      </span>
    </div>
  )
}


export default CrossSell
