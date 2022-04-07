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
      blogSlug={query.blogSlug}
      locale={props.locale}
      blog={props.blog}
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
  console.log(blogSlug, "11111111111111");
  // console.log(
  //   `${url}/cms/blog/${blogSlug}?locale=${locale}`,
  //   "${url}/cms/blog/${blogSlug}?locale=${locale}"
  // );
  if (blogSlug != "undefined") {
    console.log(blogSlug, "222222222222");
    await fetch(`${url}/db/cms/blog/${blogSlug}?locale=${selectedLocale}`)
      .then((res) => res.json())
      .then((responce) => {
        // console.log(responce.data, "responce.dataresponce.dataresponce.data");
        blog = responce.data;
      });
  }

  return {
    props: {
      locale: selectedLocale,
      dispatches,
      blog: blog,
    },
  };
}
