import { useEffect } from "react";
import { useRouter } from "next/router";
import shopApi from "../../api/shop";
import { domainUrl } from "../../helper";
import store from "../../store";
import allActions from "../../services/actionsArray";
import SiteCustomPage from "../../components/site/SiteCustomPage";
import BlogPageCategory from "../../components/blog/BlogPageCategory";
import { generalProcessForAnyPage } from "../../services/utils";

export default function Page(props) {
  const { query } = useRouter();
  const { dispatch } = store;

  useEffect(() => {
    window.history.replaceState(null, "", window.location.pathname);
    ///router.push(window.location.pathname, window.location.pathname);
  }, [query.pageSlug]);

  useEffect(() => {
    for (let actionKey in props.dispatches) {
      dispatch(allActions[actionKey](props.dispatches[actionKey]));
    }
  }, []);

  if (query.pageSlug == "blogs") {
    return <BlogPageCategory blog={props.blog} pageSlug={query.pageSlug} />;
  } else {
    return <SiteCustomPage pageSlug={query.pageSlug} content={props.content} />;
  }
}

export async function getServerSideProps({ locale, locales, req, res, query }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );
  const { pageSlug, page = 1 } = query;
  console.log(locale, "localelocalelocale");
  const {
    locale: defaultLocaleSelected,
    currency,
    dispatches: generalDispatches,
  } = await generalProcessForAnyPage(locale);

  const dbName = req.headers["x-forwarded-host"];

  const selectedLocale = locale !== "catchAll" ? locale : defaultLocaleSelected;

  let blog = null;
  let content = null;
  let redirect = false;
  let dataContent;
  if (pageSlug == "blogs") {
    // await shopApi.getBlogs({ selectedLocale, page, limit: 6 }).then((res) => {
    //   blog = {
    //     data: res.data,
    //     total: res?.meta?.total || 3,
    //     current_page: page || res.meta.current_page,
    //   };
    // });
    content = await fetch(
      domainUrl(
        `${dbName}/db/cms/blogs?locale=${locale}&page=${page}&limit=${6}`
      )
    );

    dataContent = await content.json();
    blog = {
      data: dataContent.data,
      total: dataContent?.meta?.total || 3,
      current_page: page || dataContent.meta.current_page,
    };
  } else {
    content = await fetch(
      domainUrl(`${dbName}/db/cms/page/${pageSlug}?locale=${selectedLocale}`)
    );

    dataContent = await content.json();
  }
  const dispatches = {
    ...generalDispatches.clientSide,
    ...generalDispatches.serverSide,
  };

  /////REMEBER NOT WORK
  // const metas = await fetch(
  //   domainUrl(`${dbName}/db/get-meta?locale=${selectedLocale}`)
  // );

  // const data = await metas.json();

  return {
    props: {
      locale: selectedLocale,
      dispatches,
      redirect,
      metas: [],
      content: dataContent,
      blog: blog,
    },
  };
}
