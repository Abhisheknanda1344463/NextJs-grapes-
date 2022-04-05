import React from "react";
import Link from "next/link";
import { FormattedMessage } from "react-intl";
import FooterContacts from "./FooterContacts";
import { url } from "../../helper";
import { connect } from "react-redux";
import { ArrowRoundedDown12x7Svg, ArrowssSvg } from "../../svg";

class FooterAccount extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      footerLinks: [],
      storeOpen: "none",
    };
  }

  componentDidMount() {
    this.setState({
      footerLinks: this.props.menuList.filter((item) => item.type == "footer"),
    });
  }

  storeToggle = () => {
    if (this.state.storeOpen == "none") {
      this.setState({ storeOpen: "block" });
    } else {
      this.setState({ storeOpen: "none" });
    }
  };

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

    const links = this.state.footerLinks.map((link, index) => (
      <div key={index}>
        <Link
          key={link.id}
          href={link.custom_url || link.url_key || "/page/" + link.page_id}
        >
          {link.name}
        </Link>
      </div>
    ));

    return (
      <div className="site-footer__widget p-0">
        <div className="footer-title" onClick={this.storeToggle}>
          <FormattedMessage
            id="termsAndConditions"
            defaultMessage="Terms and Conditions"
          />
          <span className="mobile-footer-arrow">
            <ArrowRoundedDown12x7Svg
              className={
                this.state.storeOpen == "none" ? "d-block  " : "rott_fms"
              }
            />
          </span>
        </div>

        <div
          style={{ display: this.state.storeOpen }}
          className="mobile-footer-content"
        >
          {links}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  locale: state.locale.code,
  menuList: state.general.menuList,
});

export default connect(mapStateToProps)(FooterAccount);
