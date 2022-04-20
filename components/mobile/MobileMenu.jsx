// react
import React from "react";
import classNames from "classnames";
import {FormattedMessage} from "react-intl";
import {connect, useSelector} from "react-redux";
import Link from "next/link";
// application
import MobileLinks from "./MobileLinks";
import {BlogSVG} from "../../svg";
import {local} from "../../store/locale";
import {currencyChange} from "../../store/currency";
import {mobileMenuClose} from "../../store/mobile-menu";
import MobileHeader from "./MobileHeader";
import MobileMenuFooter from "./MobileMenuFooter";

function MobileMenu(props) {
  const children = [];
  const {closeMobileMenu, changeLocale} = props;

  //Manvel Chnages
  const mobileMenuState = useSelector(state => state.mobileMenu)
  const languages = useSelector(state => state.locale.code)
  const menuPagesList = useSelector(state => state.mobileMenu.menuList)
  const hasBlog = useSelector(
    (state) => state.general.coreConfigs.theme_blog_active
  );

  for (let i = 0; i < languages?.length; i++) {
    const {locale_image, code, name} = languages[i];
    children.push({
      type: "button",
      label: name,
      image: locale_image,
      data: {type: "language", locale: code},
    });
  }

  const pages = <FormattedMessage id="pages" defaultMessage="Pages"/>;
  const category = (
    <FormattedMessage id="categoies" defaultMessage="Category"/>
  );

  const classes = classNames("mobilemenu", {
    "mobilemenu--open": mobileMenuState.open,
  });

  const navLinksMobile = useSelector((state) =>
    state.general.menuList.filter((items) => items.type == "header")
  );
  const navLinksMobileFooter = useSelector((state) =>
    state.general.menuList.filter((items) => items.type == "footer")
  );
  const handleItemClick = (item) => {
    console.log(item, "item in handle item:___________________________________________")
    if (item.data) {
      if (item.data.type === "language") {
        changeLocale(item.data.locale);
        closeMobileMenu();
      }
    }
    if (item.type === "link" || item.type === "header") {
      closeMobileMenu();
    }
  };

  const statecategories = useSelector((state) => state.general.categories);
  const categories = [{label: category, children: statecategories}];
  return (
    <div className={classes} style={{opacity: mobileMenuState.open ? 1 : 0}}>
      <div className="mobilemenu__backdrop" onClick={closeMobileMenu}/>
      <div className="mobilemenu__body">
        {/* <div className="mobilemenu__header">
          <div className="mobilemenu__title">
            <FormattedMessage id="menu" defaultMessage="Menu" />
          </div>
          <button
            type="button"
            className="mobilemenu__close"
            onClick={closeMobileMenu}
          >
            <Cross20Svg />
          </button>
        </div> */}
        <MobileHeader/>
        <div className="mobilemenu__content">
          <MobileLinks links={categories} onItemClick={handleItemClick}/>
          {props.menuPagesList ? (
            <>
              <MobileLinks
                links={[{label: pages, childs: [...navLinksMobile, ...navLinksMobileFooter]}]}
                onItemClick={handleItemClick}
              />

              {/*{hasBlog === "1" ? (*/}
              {/*  <li className="nav-links__item">*/}
              {/*    <Link href="/page/blogs">*/}
              {/*      <a>*/}
              {/*        <FormattedMessage id="blog" defaultMessage="Blog" />*/}
              {/*      </a>*/}
              {/*    </Link>*/}
              {/*  </li>*/}
              {/*) : (*/}
              {/*  <React.Fragment></React.Fragment>*/}
              {/*)}*/}
              {
                hasBlog === "1" ? (
                    <ul className="mob-links__item">
                      <Link href="/page/blogs">
                        <a className="mob-links__blok-a" onClick={closeMobileMenu}>
                    <span className="mobile-links__blok">
                      <BlogSVG/>
                      <FormattedMessage id="blog" defaultMessage="Blog"/>
                    </span>
                        </a>
                      </Link>
                    </ul>
                  ) :
                  <></>
              }

            </>
          ) : (
            ""
          )}
          <MobileLinks onItemClick={handleItemClick}/>
        </div>
        <div className="mobileMenuFooter-fms">
          <MobileMenuFooter/>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  mobileMenuState: state.mobileMenu,
  languages: state.general.languages,
  menuPagesList: state.mobileMenu.mobileMenuList,
});

const mapDispatchToProps = {
  closeMobileMenu: mobileMenuClose,
  changeLocale: local,
  changeCurrency: currencyChange,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(MobileMenu));
