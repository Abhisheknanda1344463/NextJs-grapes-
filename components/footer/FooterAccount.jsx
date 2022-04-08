import React from "react";
import Link from "next/link";
import { FormattedMessage } from "react-intl";

import { url } from "../../helper";
import { connect } from "react-redux";
import TrackingNumber from "./TrackingNumber";

class FooterAccount extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      footerLinks: [],
    };
  }

  componentDidMount() {
    console.log("this props in footer account",this.props)
    this.setState({
      footerLinks: this.props.menuList.filter((item) => item.type == "footer"),
    });
    //     fetch(`${url}/api/cms/menus?locale=${this.props.locale}`)
    //         .then((res) => res.json())
    //         .then((res) => this.setState({ footerLinks: res.data.filter((item) => item.type == "footer") }));
  }

  render() {
    let navLinks = this.state.footerLinks;
    if (navLinks != undefined) {
      navLinks.sort(function (a, b) {
        var keyA = a.position,
          keyB = b.position;
        // Compare the 2 dates
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });
    }
    const trackingNumber = (
      <div className="trackingNumber-fms">
        <Link href="/tracking">
          <a>
            <FormattedMessage id="tracking" defaultMessage="Tracking Number" />
          </a>
        </Link>
      </div>
    );

    const contactWith = (
      <div className="trackingNumber-fms">
        <Link href="/contact">
          <a>
            <FormattedMessage
              id="contact.with.us"
              defaultMessage="Contact With Us"
            />
          </a>
        </Link>
      </div>
    );

    const links = this.state.footerLinks.map((link, index) => (
      <div key={index} className="footerLinks-fms">
        <Link
          key={link.id}
          href={link.custom_url || link.url_key || "/page/" + link.page_id}
        >
          <a>{link.name}</a>
        </Link>
      </div>
    ));


    return (
      <>
        {links}
        {this.props.hasTracking === "1" ? trackingNumber : ""}
        {this.props.hasContact  === "1" ? contactWith: ""}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  locale: state.locale,
  menuList: state.general.menuList,
});

export default connect(mapStateToProps)(FooterAccount);
