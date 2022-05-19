import { useEffect } from "react";
import SearchedProducts from "../../../components/shop/SearchedProducts";
import { useRouter } from "next/router";
import store from "../../../store";
import allActions from "../../../services/actionsArray";
import { generalProcessForAnyPage } from "../../../services/utils";
import Head from 'next/head'

export default function Catlog(props) {
  const { dispatch } = store;
  const { query } = useRouter();

  useEffect(() => {
    for (let actionKey in props.dispatches) {
      dispatch(allActions[actionKey](props.dispatches[actionKey]));
    }
  }, [props.locale]);

  const logoPath = `configuration/logo/logo.webp`
  return (
    <>
      <Head>
        <title>{query.slug}</title>
        <meta property="og:title" name="title"
              content={query.slug}/>
        <meta property="og:description" name="description"
              content={props.dbName}/>
        <meta property="og:keywords" name="keywords"
              content={query.slug}/>
        <meta
          property="og:image"
          name="image"
          content={`https://${props.dbName}/storage/${props.domain}/${logoPath}`}
        />
        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:title"
              content={query.slug}/>
        <meta name="twitter:description"
              content={props.dbName}/>
        <meta name="twitter:image"
              content={`https://${props.dbName}/storage/${props.domain}/${logoPath}`}/>
      </Head>
      <SearchedProducts
        columns={3}
        dbName={props.dbName}
        viewMode="grid"
        sidebarPosition="start"
        searchedItem={query.slug}
      />
    </>
  );
}

export async function getServerSideProps({
  ///query: { slug },
  locale,
  locales,
  req,
  query,
  res,
}) {
  // res.setHeader(
  //   "Cache-Control",
  //   "public, s-maxage=10, stale-while-revalidate=59"
  // );
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
  /////FIXME WE DONT NEED ALL THIS DATA
  const {
    locale: defaultLocaleSelected,
    currency,
    dispatches: generalDispatches,
  } = await generalProcessForAnyPage(locale);
  const selectedLocale = locale !== "catchAll" ? locale : defaultLocaleSelected;
  /////REMEBER WE NEED THIS BUT NEED TO OPTIMI
  const dispatches = {
    ...generalDispatches.clientSide,
    ...generalDispatches.serverSide,
  };
  return {
    props: {
      dispatches,
      dbName: dbName,
      domain: databaseName,
      locale: selectedLocale,
    },
  };
}
