import React from "react";

import MobileFooterAccount from "./MobileFooterAccount";
import MobileFooterContacts from "./MobileFooterContacts";
import FooterNewsletter from "./FooterNewsletter";
import ToTop from "./ToTop";
import SocialLinks from "components/shared/SocialLinks";
import MobileFooterNavs from "components/mobile/MobileFooterNavs";

function MobileFooter() {
  return (
    <>
      <div className="mobile-footer">
        <div className="container home-product-container">
          <div className="mobile-footer-container">
            <div className="mobile-footer-dropdowns-list">
              {/* <div className="mobile-footer-dropdown">
                <MobileFooterAccount />
              </div>
              <div className="mobile-footer-dropdown">
                <MobileFooterContacts />
              </div>
              <div className="mobile-social-links">
                <SocialLinks
                  className="footer-newsletter__social-links"
                  shape="circle"
                />
              </div> */}
            </div>
            <div className="mobile-footer-newsletter">
              <FooterNewsletter id='outlined-email-input_1'/>
            </div>
            {/* < */}
          </div>
        </div>
        {/* <ToTop /> */}
      </div>
      <div>
        <MobileFooterNavs />
      </div>
    </>
  );
}
export default MobileFooter;
