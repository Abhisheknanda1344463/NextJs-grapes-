import React from "react";
import Link from "next/link";
import Head from "next/head";
import theme from "../../data/theme";
import Image from "components/hoc/Image";
import err from "../../images/Error.png";
import { FormattedMessage } from "react-intl";

function SitePageNotFound() {
  return (
    <div className="block">
      <Head>
        <title>{`404 Page Not Found — ${theme.name}`}</title>
      </Head>
      <div className="container">
        <div className="not-found__con">
          <div className="not-found__con__image">
            <Image src={err} alt="" layout="fill" />
          </div>
          <div className="not-found__con__text">
            <div className="text-con">
              <p className="not-found__con__text_p">
                <FormattedMessage
                  id="try.use.seach"
                  defaultMessage="Sorry, but the page you're looking for isn't available. Try to search again or use the Go Back button below."
                />
              </p>
              <Link href="/" className="not-found__con__text_a">
                <a>
                  <FormattedMessage
                    id="go.home.page"
                    defaultMessage="Back to homepage"
                  />
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(SitePageNotFound);
