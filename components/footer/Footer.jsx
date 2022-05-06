// react
import React from "react";

// application
import FooterContacts from "./FooterContacts";
// import FooterLinks from './FooterLinks';
import FooterNewsletter from "./FooterNewsletter";
import ToTop from "./ToTop";
import FooterAccount from "./FooterAccount";
import {useSelector} from "react-redux";

function Footer() {
  const hasTracking = useSelector(state => state.general.coreConfigs.sales_tracking_tracking_active)
  const hasContact = useSelector(state => state.general.coreConfigs.theme_contact_us_active)
  const showSubscribtion = useSelector(state => state.general.coreConfigs.theme_subscription_active)
  const storeConfigs = useSelector((state) => state.general.store_configs);
  return (
    <div className="site-footer">
      <div className="footer-container container">
        <div className="footer-body">
          {/*add this block, only if there are any elements there*/}
          {/*{*/}
          {/*  hasTracking === "1" || hasContact === "1"*/}
          {/*    ? <div className="footer-first-column">*/}
          {/*      <FooterAccount*/}
          {/*        hasTracking={hasTracking}*/}
          {/*        hasContact={hasContact}*/}
          {/*      />*/}
          {/*    </div>*/}
          {/*    : <></>*/}
          {/*}*/}

          <div className="footer-first-column">
            <FooterAccount
              hasTracking={hasTracking}
              hasContact={hasContact}
            />
          </div>

          <div className="footer-newsletter-hide">
            <FooterContacts/>
          </div>

          {
            showSubscribtion === "1" &&
            <div className="newsletter-block">
              <FooterNewsletter id='outlined-email-input_2'/>
            </div>
          }
        </div>
      </div>
      <ToTop/>
    </div>
  );
}

export default React.memo(Footer);
