// react
import React from "react";
import Link from "next/link";
// data stubs
import theme from "../../data/theme";
import { LogoSvg } from "../../svg";
import SocialLinks from "../shared/SocialLinks";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";

export default function FooterContacts() {
  const storeConfigs = useSelector((state) => state.general.store_configs);
  // const links = [
  //   { title: <FormattedMessage id="topbar.phone1" defaultMessage="Phone number" />, url: "" },
  //   { title: <FormattedMessage id="topbar.phone2" defaultMessage="Phone number" />, url: "" },
  // ];
  // const linksList = links.map((item, index) => {
  //     return (
  //         <Link key={index} href={`tel:${item.title.props.defaultMessage}`}>
  //             {item.title}
  //         </Link>
  //     )
  // });

  // dangerouslySetInnerHTML={}
  //Commented BY MANVEL Discuss with Ruben
  const contacts = (
    <ul className="footer-contacts__contacts">
      <li className="contatsAddress">
        {storeConfigs.footer_email ? (
          <p dangerouslySetInnerHTML={{ __html: storeConfigs.footer_email }} />
        ) : (
          ""
          // <span>example@zegashop.com</span>
        )}
      </li>
      <li className="contatsAddress middleAddress">
        {storeConfigs.phone ? (
          <Link href={`tel:${storeConfigs.phone}`}>{storeConfigs.phone}</Link>
        ) : (
          ""
          // <span>+1 (929) 336 - 4318</span>
        )}
      </li>
      <li className="contatsAddress">
        {storeConfigs.footer_address ? (
          <p dangerouslySetInnerHTML={{ __html: storeConfigs.footer_address }} />
        ) : (
          ""
          // <span>Address։ City name, Country name</span>
        )}
      </li>
      <li>
        <SocialLinks
          className="footer-newsletter__social-links"
          shape="circle"
        />
      </li>
    </ul>
  );

  return <div className="site-footer__widget footer-contacts">{contacts}</div>;

  // return (
  //   <div className="site-footer__widget footer-contacts">
  //     <ul className="footer-contacts__contacts">
  //       <li className="contatsAddress">
  //         <FormattedMessage
  //           id="footer.contacts.mail"
  //           defaultMessage="example@gmail.com"
  //         />
  //       </li>
  //       <li className="contatsAddress middleAddress">
  //         <FormattedMessage
  //           id="footer.contacts.phone"
  //           defaultMessage="Phone number"
  //         />
  //       </li>
  //       <li className="contatsAddress">
  //         <FormattedMessage
  //           id="footer.contacts.address"
  //           defaultMessage="Address։ "
  //         />
  //       </li>
  //       <li>
  //         <SocialLinks
  //           className="footer-newsletter__social-links"
  //           shape="circle"
  //         />
  //       </li>
  //     </ul>
  //   </div>
  // );
}
