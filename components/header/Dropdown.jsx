// // react
// ************** Class component ************** //
// import React, { Component } from "react";
// import { connect } from "react-redux";
//
// // third-party
// import classNames from "classnames";
// import PropTypes from "prop-types";
// import { apiImageUrl } from "../../helper";
//
// // application
// import Menu from "./Menu";
// import Image from "components/hoc/Image";
// import { ArrowRoundedDown7x5Svg } from "../../svg";
//
// class Dropdown extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       open: false,
//     };
//   }
//   componentDidMount() {
//     document.addEventListener("mousedown", this.handleOutsideClick);
//   }
//
//   componentWillUnmount() {
//     document.removeEventListener("mousedown", this.handleOutsideClick);
//   }
//
//   setWrapperRef = (node) => {
//     this.wrapperRef = node;
//   };
//
//   handleOutsideClick = (event) => {
//     if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
//       this.setState(() => ({
//         open: false,
//       }));
//     }
//   };
//
//   handleButtonClick = () => {
//     this.setState((state) => ({
//       open: !state.open,
//     }));
//   };
//
//   handleItemClick = (item) => {
//     const { onClick } = this.props;
//
//     this.setState(() => ({
//       open: false,
//     }));
//
//     if (onClick) {
//       onClick(item);
//     }
//   };
//
//   render() {
//     const { open } = this.state;
//     const { title, withIcons, items, locale } = this.props;
// let local = null;
//     const classes = classNames("topbar-dropdown", {
//       "topbar-dropdown--opened": open,
//     });
//     if(locale && locale.list.length > 0) {
//       local = locale.list.find(item => item.code === locale.code)
//     }
//
//     if (this.props.for == "language") {
//       return (
//         <div className={classes} ref={this.setWrapperRef}>
//           {items.length > 1 ? (
//             <button
//               className="topbar-dropdown__btn"
//               type="button"
//               onClick={this.handleButtonClick}
//             >
//               <span style={{ paddingBottom: "3px", paddingRight: "10px" }}>
//                 {local?.name}
//               </span>
//               <Image
//                 height={16}
//                 width={20}
//                 alt="language"
//                 src={
//                   local?.locale_image
//                     ? `${apiImageUrl}/storage/${this.props.domain}/${local?.locale_image}`
//                     : "../../vendor/webkul/ui/assets/images/flag_" +
//                     local?.code +
//                     ".svg"
//                 }
//               />
//
//
//               <ArrowRoundedDown7x5Svg className="language-dropdown-arrow" />
//             </button>
//           ) : (
//             <button
//               className="topbar-dropdown__btn null-icon-fms"
//               type="button"
//               onClick={this.handleButtonClick}
//             >
//               <span style={{ paddingBottom: "3px", paddingRight: "10px" }}>
//                 {local?.name}
//               </span>
//               <Image
//                 height={16}
//                 width={20}
//                 alt="language"
//                 src={
//                   local?.locale_image
//                     ? `${apiImageUrl}/storage/${this.props.domain}/${local?.locale_image}`
//                     : "../../vendor/webkul/ui/assets/images/flag_" +
//                     local?.code +
//                     ".svg"
//                 }
//               />
//             </button>
//           )}
//           {items.length > 1 && (
//             <div className="topbar-dropdown__body">
//               <Menu
//                 layout="topbar"
//                 withIcons={withIcons}
//                 items={items.filter((e) => e.code != local?.code)}
//                 onClick={this.handleItemClick}
//               />
//             </div>
//           )}
//         </div>
//       );
//     } else if (this.props.for == "currency") {
//       return (
//         <div className={classes} ref={this.setWrapperRef}>
//           <button
//             className="topbar-dropdown__btn"
//             type="button"
//             onClick={this.handleButtonClick}
//           >
//             <span style={{ paddingBottom: "3px" }}>
//               {this.props.current.name}
//             </span>
//             <span style={{ paddingBottom: "3px" }}>
//               {this.props.current.symbol}
//             </span>
//             {items.length > 0 ? (
//               <ArrowRoundedDown7x5Svg className="language-dropdown-arrow" />
//             ) : null}
//           </button>
//           {items.length > 0 && (
//             <div className="topbar-dropdown__body">
//               <Menu
//                 layout="topbar"
//                 withIcons={withIcons}
//                 items={items.filter((e) => e.code != local?.code)}
//                 onClick={this.handleItemClick}
//                 symbol={this.props.items[0].symbol}
//               />
//             </div>
//           )}
//         </div>
//       );
//     }
//   }
// }
//
// Dropdown.propTypes = {
//   /** title */
//   title: PropTypes.node.isRequired,
//   /** array of menu items */
//   items: PropTypes.array.isRequired,
//   /** default: false */
//   withIcons: PropTypes.bool,
//   /** callback function that is called when the item is clicked */
//   onClick: PropTypes.func,
// };
//
// Dropdown.defaultProps = {
//   withIcons: false,
//   onClick: undefined,
// };
//
// const mapStateToProps = ({ general: { domain } }) => ({
//   domain,
// });
// export default connect(mapStateToProps)(Dropdown);

// *************** Functional Component ******************** //

import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

// third-party
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { apiImageUrl } from '../../helper'

// application
import Menu from './Menu'
import Image from 'components/hoc/Image'
import { ArrowRoundedDown7x5Svg } from '../../svg'



const Dropdown = (props) => {
  const [open, setOpen] = useState(false)
  const domain = useSelector(state => state.general.domain)
  const wrapperRef = useRef(null)

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])


  const setWrapperRef = (node) => {
    wrapperRef.current = node
  }

  const handleOutsideClick = (event) => {

    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setOpen(() => false)
    }
  }

  const handleButtonClick = () => {
    setOpen((bool) => !bool)
  }

  const handleItemClick = (item) => {
    // console.log(domain, "domain")

    const { onClick } = props

    setOpen(() => false)

    if (onClick) {
      onClick(item)
    }
  }

  const { title, withIcons, items, locale, newLocal } = props
  let local = null
  const classes = classNames('topbar-dropdown', {
    'topbar-dropdown--opened': open,
  })
  const openDrpdownLanguageClasses = classNames('topbar-dropdown__body', {
    'newclass': open,
  })
  if (locale && locale.list.length > 0) {
    local = locale.list.find(item => item.code === newLocal)
  }

  if (props.for == 'language') {
    return (
      <div className={classes} ref={setWrapperRef}>
        {items.length > 1 ? (
          <button
            className="topbar-dropdown__btn"
            type="button"
            onClick={handleButtonClick}
          >
            <span style={{ paddingBottom: '3px', paddingRight: '10px' }}>
              {local && local?.name}
            </span>
            <Image
              height={16}
              width={20}
              alt="language"
              src={
                local && local?.locale_image
                  ? `${apiImageUrl}/storage/${domain}/${local?.locale_image}`
                  : '../../vendor/webkul/ui/assets/images/flag_' +
                  local?.code +
                  '.svg'
              }
            />


            <ArrowRoundedDown7x5Svg className="language-dropdown-arrow" />
          </button>
        ) : (
          <button
            className="topbar-dropdown__btn null-icon-fms"
            type="button"
            onClick={handleButtonClick}
          >
            <span style={{ paddingBottom: '3px', paddingRight: '10px' }}>
              {local && local?.name}
            </span>
            <Image
              height={16}
              width={20}
              alt="language"
              src={
                local && local?.locale_image
                  ? `${apiImageUrl}/storage/${domain}/${local?.locale_image}`
                  : '../../vendor/webkul/ui/assets/images/flag_' +
                  local?.code +
                  '.svg'
              }
            />
          </button>
        )}
        {items.length > 1 && (
          <div className={openDrpdownLanguageClasses}>
            <Menu
              layout="topbar"
              withIcons={withIcons}
              items={items.filter((e) => e.code != local?.code)}
              onClick={handleItemClick}
            />
          </div>
        )}
      </div>
    )
  } else if (props.for == 'currency') {
    return (
      <div className={classes} ref={setWrapperRef}>
        <button
          className="topbar-dropdown__btn"
          type="button"
          onClick={handleButtonClick}
        >
          <span style={{ paddingBottom: '3px' }}>
            {props.current.name}
          </span>
          <span style={{ paddingBottom: '3px' }}>
            {props.current.symbol}
          </span>
          {items.length > 0 ? (
            <ArrowRoundedDown7x5Svg className="language-dropdown-arrow" />
          ) : null}
        </button>
        {items.length > 0 && (
          <div className="topbar-dropdown__body">
            <Menu
              layout="topbar"
              withIcons={withIcons}
              items={items.filter((e) => e.code != local?.code)}
              onClick={handleItemClick}
              symbol={props.items[0].symbol}
            />
          </div>
        )}
      </div>
    )
  }

}

Dropdown.propTypes = {
  /** title */
  title: PropTypes.node.isRequired,
  /** array of menu items */
  items: PropTypes.array.isRequired,
  /** default: false */
  withIcons: PropTypes.bool,
  /** callback function that is called when the item is clicked */
  onClick: PropTypes.func,
}

Dropdown.defaultProps = {
  withIcons: false,
  onClick: undefined,
}

export default Dropdown
