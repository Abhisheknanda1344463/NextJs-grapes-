import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";

import DropdownLanguage from "./DropdownLanguage";
import DropdownCurrency from "./DropdownCurrency";

function Topbar() {
  const storeConfigs = useSelector((state) => state.general.store_configs);
  const linksList = (
    <div className="topbar__item topbar__item--link ">
      {storeConfigs.phone ? (
        <Link href={`tel:${storeConfigs.phone}`}>{storeConfigs.phone}</Link>
      ) : (
        <span>+1 (929) 336 - 4318</span>
      )}
    </div>
  );

  return (
    <div className="site-header__topbar topbar d-lg-block d-none">
      <div className="topbar__container container">
        <div className="topbar__row">
          {linksList}
          {/*<div className="topbar__spring" />*/}
          <div className="topbar__item currency-adjust">
            <DropdownCurrency />
          </div>
          <div className="topbar__item language-adjust">
            <DropdownLanguage />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Topbar;
