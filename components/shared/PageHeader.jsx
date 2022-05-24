// react
import React from "react";

// third-party
import PropTypes from "prop-types";
import Link from "next/link";

// application
import {ArrowRoundedRight6x9Svg} from "../../svg";
import Head from "next/head";

function PageHeader(props) {
  let {header, breadcrumb} = props;
  if (header) {
    header = (
      <div className="page-header__title">
        <h1>{header}</h1>
      </div>
    );
  }

  if (breadcrumb.length > 0) {
    const lastIndex = breadcrumb.length - 1;

    const schemaPageHeader = {
      "@context": `https://schema.org/`,
      "@type": "BreadcrumbList",
      "name": "Breadcrumb",
      "url": `/`,
      "itemListElement": [],
    };

    breadcrumb = breadcrumb.map((item, index) => {
      console.log(item.title, "item in pageHeader")
      let link;

      schemaPageHeader.itemListElement.push({
        "@type": "ListItem",
        "position": breadcrumb.indexOf(item),
        "item": {
          "@id": item.url,
        },
      });

      if (lastIndex === index) {
        link = (
          <React.Fragment>
            <Head>
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify(schemaPageHeader),
                }}
              />
            </Head>
            <li
              key={index}
              className="breadcrumb-item active"
              aria-current="page"
            >
              {item.title}
            </li>
          </React.Fragment>
        );
      } else {
        link = (
          <li key={index} className="breadcrumb-item">
            <Link href={item.url}>
              <a>{item.title}</a>
            </Link>
            <ArrowRoundedRight6x9Svg className="breadcrumb-arrow"/>
          </li>
        );
      }

      return link;
    });

    breadcrumb = (
      <div className="page-header__breadcrumb">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">{breadcrumb}</ol>
        </nav>
      </div>
    );
  }

  return (
    <div className="page-header">
      <div className="page-header__container container-offHome">
        {breadcrumb}
      </div>
    </div>
  );
}

PageHeader.propTypes = {
  /** page header */
  header: PropTypes.node,
  /** array of breadcrumb links */
  breadcrumb: PropTypes.array,
};

PageHeader.defaultProps = {
  breadcrumb: [],
};

export default PageHeader;
