import React from "react";
import Head from "next/head";
import {useSelector} from "react-redux"


export const MetaWrapper = ({title, m_title, m_desc, m_key, m_img, children}) => {
  const dbName = useSelector(state => state.general.dbName)
  const domain = useSelector(state => state.general.domain)

  const logoPath = `https://${dbName}/storage/${domain}/configuration/share_pic/share_pic.webp`
  const sharePic = m_img ? m_img : logoPath
  return (
    <>
      <Head>
        <title>{title}</title>
        {/*meta tags for page*/}
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