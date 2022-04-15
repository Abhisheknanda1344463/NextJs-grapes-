//react
import React, { memo } from "react";

// third-party
import classNames from "classnames";
import { connect } from "react-redux";

// application
import languages from "../../i18n";
import NavMenu from "./NavMenu";
import { ArrowRoundedDown9x6Svg } from "../../svg";
import { setMenuPagesList } from "../../store/mobile-menu/";

// data stubs
//import navLinks from '../../data/headerNavigation';
import { useSelector } from "react-redux";
import Link from "next/link";
import { FormattedMessage } from "react-intl";
import Head from "next/head";
import { useRouter } from "next/router";
function NavLinks(props) {
  const { locale } = props;
  const menuList = useSelector((state) => state.general.menuList);
  const hasBlog = useSelector(
    (state) => state.general.coreConfigs.theme_blog_active
  );
  const navLinks = JSON.parse(JSON.stringify(menuList)).filter(
    (item) => item.type == "header"
  );

  let linksList = "";

  const handleMouseEnter = (event) => {
    const { direction } = languages[locale];

    const item = event.currentTarget;
    const megamenu = item.querySelector(".nav-links__megamenu");
    const linksList = "";
    if (megamenu) {
      const container = megamenu.offsetParent;
      const containerWidth = container.getBoundingClientRect().width;
      const megamenuWidth = megamenu.getBoundingClientRect().width;
      const itemOffsetLeft = item.offsetLeft;

      if (direction === "rtl") {
        const itemPosition =
          containerWidth -
          (itemOffsetLeft + item.getBoundingClientRect().width);

        const megamenuPosition = Math.round(
          Math.min(itemPosition, containerWidth - megamenuWidth)
        );

        megamenu.style.left = "";
        megamenu.style.right = `${megamenuPosition}px`;
      } else {
        const megamenuPosition = Math.round(
          Math.min(itemOffsetLeft, containerWidth - megamenuWidth)
        );

        megamenu.style.right = "";
        megamenu.style.left = `${megamenuPosition}px`;
      }
    }
  };

  if (navLinks != undefined) {
    navLinks.sort(function (a, b) {
      var keyA = a.position,
        keyB = b.position;
      // Compare the 2 dates
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });
  }
  let sortedNavLinks = null;
  if (navLinks) {
    let withParentId = {};
    let withOutParentId = {};

    for (let key in navLinks) {
      if (navLinks[key]?.parent_id) {
        withParentId[navLinks[key].id] = navLinks[key];
      } else {
        withOutParentId[navLinks[key].id] = navLinks[key];
      }
    }

    // making third level
    for (let key in withParentId) {
      const current = withParentId[key];
      for (let Kkey in withParentId) {
        if (current.parent_id == withParentId[Kkey].id) {
          if (withParentId[Kkey]?.child) {
            withParentId[Kkey].child = [...withParentId[Kkey].child, current];
          } else {
            withParentId[Kkey].child = [current];
          }
          delete withParentId[key];
        }
      }
    }

    // making second level
    for (let key in withParentId) {
      const object = withParentId[key];
      const found = withOutParentId[object.parent_id];
      if (withOutParentId[object.parent_id]) {
        if (found.child) {
          found.child = [...found.child, object];
        } else {
          found.child = [object];
        }
      }
    }

    sortedNavLinks = Object.values(withOutParentId);
  }

  if (sortedNavLinks) {
    const schemaLinks = {
      "@context": "/",
      "@type": "Menu",
      url: "/",
      name: "MenuItems",
      description: "Company menu items description",
      hasMenuSection: [],
    };

    const key = "page_key";
    const navLinks2 = [
      ...new Map(navLinks.map((item) => [item[key], item])).values(),
    ];

    linksList = sortedNavLinks.map((item, index) => {
      let arrow;
      let submenu;
      navLinks2.map((el) => {
        if (el.page_key && el.id === item.id) {
          item["page_key"] = el.page_key;
        }
      });
      let pageUrl = item.url_key;
      if (item.child && item.child.length > 0) {
        arrow = <ArrowRoundedDown9x6Svg className="nav-links__arrow" />;
      }
      if (item.child && item.child.length > 0) {
        submenu = (
          <div className="nav-links__menu">
            <NavMenu items={item.child} />
          </div>
        );
      }

      const classes = classNames("nav-links__item", {
        "nav-links__item--with-submenu": item.child,
      });

      const hello = (event, pageUrl) => {
        if (pageUrl.url_key) {
          event.preventDefault();
        }
      };

      const openNewWindow = (event) => {
        event.preventDefault();
        window.open(item.url_key);
      };

      const madePath = item.page_key || item.custom_url || item.page_id;

      schemaLinks.hasMenuSection.push({
        "@type": "MenuSection",
        position: sortedNavLinks.indexOf(item),
        hasMenuItem: {
          "@type": "MenuItem",
          name: item.name,
        },
      });
      const router = useRouter();
      return (
        /**Chackoing if object has pageID  then url to pages/? else custom url **/
        <React.Fragment>
          <Head>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaLinks) }}
            />
          </Head>
          <li key={index} className={classes} onMouseEnter={handleMouseEnter}>
            <Link
              href={`${
                !item.url_key ? `/${router.locale}/page/${madePath}` : ""
              }`}
            >
              <a onClick={item.url_key ? (event) => openNewWindow(event) : ""}>
                <span className="navbar-link-hover">
                  {item.name}
                  {arrow}
                </span>
              </a>
            </Link>
            {submenu}
          </li>
        </React.Fragment>
      );
    });
  }

  return (
    <ul className="nav-links__list">
      {linksList}
      {hasBlog === "1" ? (
        <li className="nav-links__item">
          <Link href="/page/blogs">
            <a>
              <FormattedMessage id="blog" defaultMessage="Blog" />
            </a>
          </Link>
        </li>
      ) : (
        <React.Fragment></React.Fragment>
      )}
    </ul>
  );
}

NavLinks.propTypes = {
  /** current locale */
  //  locale: PropTypes.string,
};

const mapStateToProps = (state) => ({
  locale: state.locale.code,
});

const mapDispatchToState = (dispatch) => ({
  setMenuPagesList: (list) => dispatch(setMenuPagesList(list)),
});

export default connect(mapStateToProps, mapDispatchToState)(NavLinks);
