// react
import React from "react";
import { Helmet } from "react-helmet-async";

import theme from "../../data/theme";

function Content({ text, isTable }) {
  // if (!text) {
  //   return "";
  // }
  const data = text ? text?.data[0] : "";



  return (
    <div className="block about-us">
      {/* <Helmet>
        <title>{`${data?.page_title} — ${theme.name}`}</title>
        <meta name="description" content={data?.meta_description}/>
        <meta name="keywords" content={data?.meta_keywords}/>
        <meta name="title" content={data?.meta_title}/>
      </Helmet> */}

      <div className="block">
        <div className="container">
          <h1
            className="text-center contact_us_fms"
            dangerouslySetInnerHTML={{ __html: data?.page_title }}
          />
          <div className="document">
            <div dangerouslySetInnerHTML={{ __html: data?.html_content }} style={{ overflowX: isTable ? "auto" : '' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Content;
