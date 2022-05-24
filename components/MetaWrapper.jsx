import React from "react";
import Head from "next/head";
import {useSelector} from "react-redux"


export const MetaWrapper = ({title, m_title, m_desc, m_key, m_img, children}) => {
  const dbName = useSelector(state => state.general.dbName)
  let databaseName;

  if (dbName.includes(".zegashop.com")) {
    var dataName = dbName.split(".zegashop.com");

    databaseName = dataName[0];
    process.env.domainName = dbName;

    process.env.databaseName = databaseName;
  } else {
    process.env.domainName = dbName;
    databaseName = dbName.split(".")[0];
    if (databaseName == "www") {
      databaseName = dbName.split(".")[1];
    }
    process.env.databaseName = databaseName;
  }
  // const domain = useSelector(state => state.general.domain)

  const logoPath = `https://${dbName}/storage/${databaseName}/configuration/logo/logo.webp`

  const sharePic = m_img ? m_img : logoPath
  return (
    <>
      <Head>
        <title>{title}</title>
        {/*meta tag*/}
        <meta name="title" content={m_title}/>
        <meta name="description" content={m_desc}/>
        <meta name="keywords" content={m_key}/>
        {/*open graph tags*/}
        <meta property="og:type" content="website"/>
        <meta property="og:title" name="title" content={m_title}/>
        <meta property="og:description" name="description" content={m_desc}/>
        <meta property="og:keywords" name="keywords" content={m_key}/>
        <meta property="og:image" name="image" content={sharePic}/>
        {/*meta tags for twitter*/}
        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:title" content={m_title}/>
        <meta name="twitter:description" content={m_desc}/>
        <meta name="twitter:image" content={sharePic}/>
      </Head>
      {children}
    </>
  )

}
