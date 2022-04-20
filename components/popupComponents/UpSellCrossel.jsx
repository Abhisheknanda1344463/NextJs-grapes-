import React, {useState, useEffect} from 'react'
import ProductCard from '../shared/ProductCard'
import {setPopup, setPopupName} from '../../store/general'
import {useSelector, useDispatch} from 'react-redux'
import UpSell from './UpSell'
import CrossSell from './CrossSell'
import CrosselSecond from './CrosselSecond'
import PasswordChangePoup from 'components/account/PasswordChangePoup'
import IndicatoDropDownBody from 'components/header/IndicatoDropDownBody'
import shopApi from '../../api/shop'
import {url} from '../../helper'


function UpSellCrossel({active, upCrosProd}) {
  // console.log(upCrosProd, 'upCrosProd in upsell')
  const popUpName = useSelector(state => state.general.popUpName)
  const dispatch = useDispatch()
  useEffect(() => {

  }, [upCrosProd])
  if (!popUpName) {
    return null
  }

  let content
  if (popUpName == 'register') {
    content = <IndicatoDropDownBody/>
  } else if (popUpName == 'passwordChange') {
    content = <PasswordChangePoup/>
  } else if (popUpName == 'upsell') {
    content = <UpSell product={upCrosProd[0]}/>
  } else if (popUpName == 'crossel') {
    content = <CrossSell product={upCrosProd}/>
  } else if (popUpName == 'crossel2') {
    content = <CrossSell product={upCrosProd}/>
  }

  return (
    <div
      className={active ? 'modalss active' : 'modalss'}
      onClick={() => dispatch(setPopup(false))}
    >
      <div
        className={
          active ? `modal-content active ${popUpName}` : 'modal-content'
        }
        onClick={(e) => e.stopPropagation()}
      >

        {content}

      </div>
    </div>
  )
}


export default UpSellCrossel
