// react
import React, {useEffect, useState} from "react";

// third-party
import Link from "next/link";
import {useDispatch, useSelector} from "react-redux";
import Head from "next/head";

// application
import Menu from "./Menu";
import {ArrowRoundedRight6x9Svg} from "../../svg";
import {FormattedMessage} from "react-intl";
import {url} from "../../services/utils";
import {useRouter} from 'next/router'

function DepartmentsLinks(props) {
  const router = useRouter()
  const selectedData = useSelector((state) => state.locale.code);
  const dbName = useSelector(state => state.general.dbName)
  // const slugID = useSelector((state) => state.general.categories && state.general.categories[0].children.map(item => item.slug));
  const dispatch = useDispatch();
  const depart = props?.dep;
  const schemaCategories = {
    "@context": `https://schema.org/`,
    "@type": "Menu",
    url: `/`,
    name: "Categories",
    description: "Categories description",
    hasMenuSection: [],
  };
  useEffect(() => {
  }, [router.pathname])

  /*test functionality*/

  const [offsetTop, setTop] = useState()
  const [left, setLeft] = useState()
  // const [display, setDisplay] = useState('block')
  const [scrollTop, setScrollTop] = useState(0)

  useEffect(() => {
    const onScroll = (e) => {
      // setDisplay('none')
      setScrollTop(e.target.documentElement.scrollTop)
    }
    window.addEventListener('scroll', onScroll)

    return () => window.removeEventListener('scroll', onScroll)
  }, [scrollTop])

  const scrollHandle = (e) => {
    // setDisplay("none");
  }

  const onMouseEnterHandler = (e) => {
    // setDisplay('block')
    const re = e.target.getBoundingClientRect()
    setTop(re.top)
    setLeft(re.left + e.target.offsetWidth)
  }

  const linksList =
    depart &&
    depart[0].children.map((department, index) => {
      let arrow = null;
      let submenu = null;
      let itemClass = "";
      if (department.children && department.children.length > 0) {
        arrow = <ArrowRoundedRight6x9Svg className="departments__link-arrow"/>;
        itemClass = "departments__item--menu";
        submenu = (
          // <div className="departments__menu">
          <div
            key={index}
            style={{
              top: `${offsetTop}px`,
              left: `${left}px`,
            }}
            onScroll={scrollHandle}
            className={`departments__menu`}>
            <Menu
              items={department.children}
              onClick={props.func}
            />
          </div>
        );
      }

      schemaCategories.hasMenuSection.push({
        "@type": "MenuSection",
        name: "Categories menu section",
        position: props?.dep?.indexOf(department),
        hasMenuItem: {
          "@type": "MenuItem",
          name: department.name,
          description: department.meta_description || department.description,
        },
      });

      return (
        <React.Fragment>
          {/*<li key={index} className={`departments__item ${itemClass}`} ref={linkRef}>*/}
          <li key={index} onMouseEnter={onMouseEnterHandler} className={`departments__item ${itemClass}`}>
            <Link href={url.category(department, router.query)}>
              <a onClick={props.func}>
                {/*<FormattedMessage id={department.slug} defaultMessage={department.name} />*/}
                {department.name}
                {arrow}
              </a>
            </Link>
            <span className="departments__border"></span>
            {submenu}
          </li>
          {/*<Link href={`/catalog/${department.slug}`}>*/}
          {/*  {department.name}*/}
          {/*</Link>*/}
        </React.Fragment>
      );
    });


  return (
    <React.Fragment>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(schemaCategories)}}
        />
      </Head>
      <ul className="departments__links">{linksList}</ul>
    </React.Fragment>
  );
}

export default DepartmentsLinks;
