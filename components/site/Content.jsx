// react
import React from "react";
import {Helmet} from "react-helmet-async";
import Head from "next/head";

import theme from "../../data/theme";

function Content({text, isTable, domain, dbName}) {
  // if (!text) {
  //   return "";
  // }
  const data = text ? text?.data[0] : "";


  const logoPath = `configuration/logo/logo.webp`
  return (
    <div className="block about-us">
      <Head>
        <title>{`${data?.page_title}`}</title>

        <meta property="og:title" name="title" content={data?.meta_title || data?.page_title}/>
        <meta
          property="og:description"
          name="description"
          content={data?.meta_description || data?.page_title}
        />
        <meta
          property="og:keywords"
          name="keywords"
          content={data?.meta_keywords || data?.page_title}
        />
        <meta
          property="og:image"
          name="image"
          content={`https://${domain}/storage/${dbName}/${logoPath}`}
        />

        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:title" content={data?.meta_title || data?.page_title}/>
        <meta name="twitter:description" content={data?.meta_description || data?.page_title}/>
        <meta name="twitter:image" content={`https://${domain}/storage/${dbName}/${logoPath}`}/>
      </Head>

      <div className="block">
        <div className="container">
          <h1
            className="text-center contact_us_fms"
            dangerouslySetInnerHTML={{__html: data?.page_title}}
          />
          <div className="document">
            <div dangerouslySetInnerHTML={{__html: data?.html_content}} style={{overflowX: isTable ? "auto" : ''}}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Content;
