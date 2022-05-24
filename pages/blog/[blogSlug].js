import {useEffect} from "react";
import {useRouter} from "next/router";
import BlogPagePost from "../../components/blog/BlogPagePost";
import {MetaWrapper} from "../../components/MetaWrapper";
import Head from "next/head";
import store from "../../store";
import {url} from "../../helper";
import allActions from "../../services/actionsArray";
import {
  ApiCustomSettingsAsync,
  ApiCategoriesAndMenues,
} from "../../services/utils";
import {generalProcessForAnyPage} from "../../services/utils";

export default function Contact(props) {
  const {query} = useRouter();
  const {dispatch} = store;

  useEffect(() => {
    for (let actionKey in props.dispatches) {
      dispatch(allActions[actionKey](props.dispatches[actionKey]));
    }
  }, [props.locale]);
  const logoPath = `configuration/logo/logo.webp`;

  return (
    <MetaWrapper
      title={`Blog Post Page — ${props.dbName}`}
      m_title={props.blog[0]?.meta_title || props.blog[0]?.blog_title}
      m_desc={props.blog[0]?.meta_description || props.blog[0]?.blog_title}
      m_key={props.blog[0]?.meta_keywords || props.blog[0]?.blog_title}
      m_img={props.blog[0]?.image && `https://${props.dbName}/storage/${props.domain}/${props.blog[0].image}`}
    >
      <BlogPagePost
        dbName={props.dbName}
        blogSlug={query.blogSlug}
        locale={props.locale}
        blog={props.blog}
        domain={props.domain}
      />
    </MetaWrapper>
    // <>
    //   <Head>
    //     <title>{`Blog Post Page — ${props.dbName}`}</title>
    //     <meta property="og:title" name="title" content={props.blog[0]?.meta_title || props.blog[0]?.blog_title}/>
    //     <meta
    //       property="og:description"
    //       name="description"
    //       content={props.blog[0]?.meta_description || props.blog[0]?.blog_title}
    //     />
    //     <meta
    //       property="og:keywords"
    //       name="keywords"
    //       content={props.blog[0]?.meta_keywords || props.blog[0]?.blog_title}
    //     />
    //     <meta
    //       property="og:image"
    //       name="image"
    //       content={
    //         props.blog[0]?.image ? `https://${props.dbName}/storage/${props.domain}/${props.blog[0].image}` : `https://${props.dbName}/storage/${props.domain}/${logoPath}`}
    //     />
    //     <meta name="twitter:card" content="summary_large_image"/>
    //     <meta name="twitter:title" content={props.blog[0]?.meta_title || props.blog[0]?.blog_title}/>
    //     <meta name="twitter:description" content={props.blog[0]?.meta_description || props.blog[0]?.blog_title}/>
    //     <meta name="twitter:image"
    //           content={props.blog[0]?.image ? `https://${props.dbName}/storage/${props.domain}/${props.blog[0].image}` : `https://${props.dbName}/storage/${props.domain}/${logoPath}`}/>
    //   </Head>
    //   <BlogPagePost
    //     dbName={props.dbName}
    //     blogSlug={query.blogSlug}
    //     locale={props.locale}
    //     blog={props.blog}
    //     domain={props.domain}
    //   />
    // </>
  );
}

export async function getServerSideProps({locale, locales, req, res, query}) {
  const {blogSlug} = query;
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
  const {setCatgoies, setMenuList} = await ApiCategoriesAndMenues(
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
