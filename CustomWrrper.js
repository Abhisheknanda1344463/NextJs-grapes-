import { useEffect } from "react";
import { useRouter } from "next/router";
import { IntlProvider } from "react-intl";
import { useSelector } from "react-redux";

import Layout from "./components/Layout";
import AccountLayout from "./components/account/AccountLayout";

function CustomWrrper({ Component, pageProps }) {
  const list = useSelector((state) => state.locale.list);
  const locale = useSelector((state) => state.locale.code);
  // console.log(locale, Component, pageProps, "state.locale.code");
  // pageProps.locale = locale;
  // console.log(pageProps.locale, "pageProps.locale");

  const customer = useSelector((state) => state.customer);
  const translations = useSelector((state) => state.general.translations);
  const router = useRouter();
  const isItAccountPage =
    router.pathname.indexOf("account") != -1 ? true : false;

  useEffect(() => {
    if (
      isItAccountPage &&
      !customer.token &&
      !customer.authenticated &&
      router.pathname != "/account/login"
    ) {
      router.push("/");
      return null;
    } else if (
      isItAccountPage &&
      customer.token &&
      customer.authenticated &&
      router.pathname == "/account/login"
    ) {
      router.push("/account/profile");
      return null;
    }
  }, []);

  return (
    <IntlProvider
      locale={pageProps.locale}
      messages={translations[pageProps.locale]?.translations}
    >
      <Layout>
        {isItAccountPage && customer.token && customer.authenticated ? (
          <AccountLayout>
            <Component {...pageProps} />
          </AccountLayout>
        ) : (
          <Component {...pageProps} />
        )}
      </Layout>
    </IntlProvider>
  );
}

export default CustomWrrper;
