// react

import React from "react";
import Head from "next/head";
import Content from "./Content";
import {useState} from "react";
import {useEffect} from "react";
import {url, apiUrlWithStore} from "../../helper";
import {useSelector} from "react-redux";
import {useRouter} from "next/router";
import {Helmet} from "react-helmet-async";

function SiteCustomPage(props) {
  const history = useRouter();
  const {pageSlug} = props;
  const [content, setContent] = useState(props.content);
  const selectedData = useSelector((state) => state.locale.code);
  const [isTable, setIsTable] = useState(false)
  const router = useRouter();
  // useEffect(() => {
  //   if (pageSlug) {
  //     async function getPageBySlug() {
  //       fetch(apiUrlWithStore(`/db/cms/page/${pageSlug}?locale=${selectedData}`))
  //         .then((response) => response.json()).then(res => {
  //           let response = await res
  //           response === undefined || response.length == 0 ? history.push("/") : setContent(response);
  //         }).catch(console.log);
  //     }
  //     getPageBySlug()
  //   }
  // }, [pageSlug, selectedData]);

  useEffect(() => {
    if (pageSlug) {
      setContent(props.content);
    }
  }, [pageSlug, router.locale]);

  useEffect(() => {
    if (content) {
      let text = document.getElementsByTagName('table')
      text && text[0] ? setIsTable(true) : setIsTable(false)
    }
  }, [])

  return (
    <div>
      <Content text={content} {...props} isTable={isTable} domain={props.domain} dbName={props.dbName}/>
    </div>
  );
}

export default SiteCustomPage;
