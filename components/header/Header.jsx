// react
import React, { useMemo, useEffect } from "react";
import Link from "next/link";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { cartUpdateQuantitiesSuccess } from "../../store/cart";
import NavLinks from "./NavLinks";
import NavPanel from "./NavPanel";
import Image from "components/hoc/Image";
import { apiImageUrl, url } from "../../helper";
import Head from "next/head";

function Header(props) {
  const { layout, domain } = props;

  const schemaSiteHeader = {
    "@context": "/",
    "@type": "ItemList",
    "name": "Site Header Items",
    "description": "contact, change currency and language",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 0,
        "name": "Telephone"
      },
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Currency"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Language"
      },
    ]
  }

  return (
    <React.Fragment>
      <Head>
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaSiteHeader) }}
        />
      </Head>
      <div className="site-header postition-sticky">
        {layout === "default" && (
          <div className="site-header__middle container">
            <div
              className="header__logo"
              style={{ marginBottom: "14px", marginTop: "14px" }}
            >
              {domain ? (
                <Link href="/">
                  <a>
                    <img
                      alt="logo"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        cursor: "pointer",
                      }}
                      rel="preload"
                      src={`${apiImageUrl}/storage/${domain}/configuration/logo/logo.webp`}
                      onError={(e) => {
                        e.target.src = `${apiImageUrl}/vendor/webkul/ui/assets/images/stores-logo.svg`;
                      }}
                    />
                  </a>
                </Link>
              ) : (
                <Link href="/">
                  <a>
                    <Image
                      style={{ objectFit: "contain", cursor: "pointer" }}
                      alt="logoSVG"
                      width={150}
                      height={45}
                      src={`${apiImageUrl}/vendor/webkul/ui/assets/images/stores-logo.svg`}
                    />
                  </a>
                </Link>
              )}
            </div>
            <div className="site-header__search">
              <NavLinks />
            </div>
          </div>
        )}
        <div className="site-header__nav-panel">
          <NavPanel layout={layout} />
        </div>
      </div>
    </React.Fragment>
  );
}

Header.propTypes = {
  layout: PropTypes.oneOf(["default", "compact"])
};

Header.defaultProps = {
  layout: "default"
};
const mapStateToProps = ({ general: { domain } }) => ({
  domain
});
export default connect(mapStateToProps)(React.memo(Header));
