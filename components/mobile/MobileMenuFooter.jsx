// react
import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import Link from "next/link";
// application
import { localeChange } from "../../store/locale";
import { currencyChange } from "../../store/currency";
import { mobileMenuClose } from "../../store/mobile-menu";
import DropdownLanguage from "components/header/DropdownLanguage";
import MobileFooterAccount from "components/footer/MobileFooterAccount";
import SocialLinks from "components/shared/SocialLinks";
import MobileFooterContacts from "components/footer/MobileFooterContacts";
import DropdownCurrency from "components/header/DropdownCurrency";

function MobileMenuFooter(props) {
  const currency = useSelector((state) => state.currency);

  return (
    <div className="mobile-footer-dropdown">
      {currency.list?.length > 1 ? (
        <div className="mobile-footer-dropdown-divs">
          <DropdownCurrency />
        </div>
      ) : null}

      <div className="mobile-footer-dropdown-divs">
        <DropdownLanguage />
      </div>
      <div className="mobile-footer-dropdown-divs">
        <MobileFooterContacts />
      </div>

      <div className="mobile-footer-dropdown-last-divs">
        <SocialLinks
          className="footer-newsletter__social-links"
          shape="circle"
        />
      </div>
    </div>
  );
}

export default React.memo(MobileMenuFooter);
