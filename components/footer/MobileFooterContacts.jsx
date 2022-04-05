// react
import React, { useState } from "react";

// data stubs
import { FormattedMessage } from "react-intl";
import { ArrowRoundedDown12x7Svg, ContactsSVG } from "../../svg";

export default function MobileFooterContacts() {
  const links = [
    {
      title: (
        <FormattedMessage id="topbar.phone1" defaultMessage="Phone number" />
      ),
      url: "",
    },
    {
      title: (
        <FormattedMessage id="topbar.phone2" defaultMessage="Phone number" />
      ),
      url: "",
    },
  ];
  const [storeOpen, setStoreOpen] = useState("none");

  function storeToggle() {
    if (storeOpen == "none") {
      setStoreOpen("block");
    } else {
      setStoreOpen("none");
    }
  }

  return (
    <div className="site-footer__widget footer-contacts">
      <div className="footer-title" onClick={() => storeToggle()}>
        <ContactsSVG className="contacts-path-fms" />
        <FormattedMessage id="ourcontact" defaultMessage="Our Contact" />

        <span className="mobile-footer-arrow">
          <ArrowRoundedDown12x7Svg
            className={storeOpen == "none" ? "d-block  " : "rott_fms"}
          />
        </span>
      </div>

      <ul className="footer-contacts__contacts" style={{ display: storeOpen }}>
        <li className="contatsAddress">
          <FormattedMessage
            id="footer.contacts.mail"
            defaultMessage="example@gmail.com"
          />
        </li>
        <li className="contatsAddress middleAddress">
          <FormattedMessage
            id="footer.contacts.phone"
            defaultMessage="Phone number"
          />
        </li>
        <li className="contatsAddress">
          <FormattedMessage
            id="footer.contacts.address"
            defaultMessage="Address։ City name, Country name"
          />
        </li>

        {/* <li>
          <SocialLinks
            className="footer-newsletter__social-links"
            shape="circle"
          />
        </li> */}
      </ul>
    </div>
  );
}
