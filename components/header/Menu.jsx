// react
import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import { apiImageUrl } from "../../helper";
import AppLink from "../shared/AppLink";
import Image from "components/hoc/Image";
import { ArrowRoundedRight6x9Svg } from "../../svg";
import { url } from "../../services/utils";
function Menu(props) {
  const { layout, withIcons, items, onClick, symbol } = props;
  // console.log(props, "onClickonClick");
  const domain = useSelector((state) => state.general.domain);

  const renderLink = (item, content) => {
    let link;
    if (item.slug) {
      link = (
        <AppLink
          {...item.props}
          href={url.category(item)}
          onClick={() => {
            onClick(item)
          }}
        >
          <a>{content}</a>
        </AppLink>
      );
    } else {
      link = (
        <button
          type="button"
          onClick={() => {
            onClick(item)
          }}>
          {content}
        </button>
      );
    }

    return link;
  };
  const itemsList = items?.map((item, index) => {
    let arrow;
    let submenu;
    let icon;

    if (item.children && item.children.length) {
      arrow = <ArrowRoundedRight6x9Svg className="menu__arrow" />;
    }

    if (item.children && item.children.length) {
      submenu = (
        <div className="menu__submenu">
          <Menu items={item.children} onClick={onClick} />
        </div>
      );
    }

    if (withIcons && item.locale_image) {
      icon = (
        <div className="menu__icon">
          <Image
            src={`${apiImageUrl}/storage/${domain || process.env.themesName}/${item.locale_image
              }`}
            alt="language"
            width={20}
            height={16}
          />
        </div>
      );
    }

    return (
      <li key={index}>
        {renderLink(
          item,
          <React.Fragment>
            {icon}
            <div className="dropdown-submenu-items">{item.title || item.name}</div>
            {arrow}
            {/* <span style={{ paddingLeft: "10px" }}>{symbol}</span> */}
          </React.Fragment>
        )}
        {submenu}
      </li>
    );
  });

  const classes = classNames(`menu menu--layout--${layout}`, {
    "menu--with-icons": withIcons,
  });

  return <ul className={classes}>{itemsList}</ul>;
}

Menu.propTypes = {
  /** one of ['classic', 'topbar'] (default: 'classic') */
  layout: PropTypes.oneOf(["classic", "topbar"]),
  /** default: false */
  withIcons: PropTypes.bool,
  /** array of menu items */
  items: PropTypes.array,
  /** callback function that is called when the item is clicked */
  onClick: PropTypes.func,
};

Menu.defaultProps = {
  layout: "classic",
  withIcons: false,
  items: [],
  onClick: () => { },
};

export default React.memo(Menu);
