// react
import React,{useEffect} from "react";

// third-party
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import Head from "next/head";

// application
import Menu from "./Menu";
import { ArrowRoundedRight6x9Svg } from "../../svg";
import { FormattedMessage } from "react-intl";
import { url } from "../../services/utils";
import { useRouter } from 'next/router'

function DepartmentsLinks(props) {
  const router = useRouter()
  const selectedData = useSelector((state) => state.locale.code);
  // const slugID = useSelector((state) => state.general.categories && state.general.categories[0].children.map(item => item.slug));
  const dispatch = useDispatch();
  const depart = props?.dep;
  const schemaCategories = {
    "@context": "/",
    "@type": "Menu",
    url: "/",
    name: "Categories",
    description: "Categories description",
    hasMenuSection: [],
  };
  useEffect(() => {
  },[router.pathname])

  const linksList =
    depart &&
    depart[0].children.map((department, index) => {
      let arrow = null;
      let submenu = null;
      let itemClass = "";
      if (department.children && department.children.length > 0) {
        arrow = <ArrowRoundedRight6x9Svg className="departments__link-arrow" />;
        itemClass = "departments__item--menu";
        submenu = (
          <div className="departments__menu">
            <Menu items={department.children} onClick={()=> {
              props.func()
              console.log(props.func(), "props in ")
            }} />
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
      // console.log(props.func, "props func in props")

      return (
        <React.Fragment>
          <li key={index} className={`departments__item ${itemClass}`}>
            <Link href={url.category(department)}>
              <a onClick={() => {
                props.func()
                console.log(props.func, "props func onclick")
              }}>
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaCategories) }}
        />
      </Head>
      <ul className="departments__links">{linksList}</ul>
    </React.Fragment>
  );
}

export default DepartmentsLinks;
