import { useEffect } from "react";
import { useRouter } from "next/router";
import BlogPagePost from "../../components/blog/BlogPagePost";

import store from "../../store";
import { url } from "../../helper";
import allActions from "../../services/actionsArray";
import {
  ApiCustomSettingsAsync,
  ApiCategoriesAndMenues,
} from "../../services/utils";
import { generalProcessForAnyPage } from "../../services/utils";
export default function Contact(props) {
  const { query } = useRouter();
  const { dispatch } = store;

  useEffect(() => {
    for (let actionKey in props.dispatches) {
      dispatch(allActions[actionKey](props.dispatches[actionKey]));
    }
  }, [props.locale]);

  return (
    <BlogPagePost
      dbName={props.dbName}
      blogSlug={query.blogSlug}
      locale={props.locale}
      blog={props.blog}
      domain={props.domain}
    />
  );
}

export async function getServerSideProps({ locale, locales, req, res, query }) {
  const { blogSlug } = query;
  //   const { locale: stateLocale, currency: stateCurrency } = store.getState();
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );
  const dbName = req.headers["x-forwarded-host"];
  var databaseName;

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
  const {
    locale: defaultLocaleSelected,
    currency,
    dispatches: generalDispatches,
  } = await generalProcessForAnyPage(locale);
  const selectedLocale = locale !== "catchAll" ? locale : defaultLocaleSelected;

  let dispatches = {};
  //   let locale = null;
  let blog = null;

  //// const settingsResponse = await ApiCustomSettingsAsync();
  const { setCatgoies, setMenuList } = await ApiCategoriesAndMenues(
    selectedLocale
  );

  dispatches = {
    ...generalDispatches.clientSide,
    ...generalDispatches.serverSide,
    setCatgoies,
    setMenuList,
  };
  /// locale = selectedLocale;

  if (blogSlug != "undefined") {
    await fetch(`${url}/db/cms/blog/${blogSlug}?locale=${selectedLocale}`)
      .then((res) => res.json())
      .then((responce) => {
        blog = responce.data;
      });
  }

  return {
    props: {
      locale: selectedLocale,
      dispatches,
      blog: blog,
      dbName: dbName,
      domain: databaseName,
    },
  };
}
