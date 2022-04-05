// react
import React from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";
// import { apiImageUrl } from "../../helper";
// import { url } from "../․․/helper";

// data stubs
import { connect } from "react-redux";
import Image from "components/hoc/Image";
// import { url } from "../Bv007a67/helper";

function SocialLinks(props) {
  const { shape, className, social } = props;
  const classes = classNames(className, "social-links", {
    "social-links--shape--circle": shape === "circle",
    "social-links--shape--rounded": shape === "rounded"
  });

  // const items = [
  //     { type: 'facebook', url: theme.fb, icon: 'fab fa-facebook-f social-link-color' },
  //     { type: 'instagram', url: theme.instagram, icon: 'fab fa-instagram social-link-color' },
  //     { type: 'twitter', url: theme.twitter, icon: 'fab fa-twitter social-link-color' },
  //     { type: 'youtube', url: theme.youtube, icon: 'fab fa-youtube' },
  // ]
  let socialLinks;
  if (social) {
    socialLinks = social.map((item) => (
      <li className="social-links__item" key={item.name}>
        <a
          className={`social-links__link social-link-color`}
          href={item.link}
          aria-label="socials"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src={"/storage/" + item.icon} alt="" layout="fill" />
        </a>
      </li>
    ));
  }

  return (
    <div className={classes}>
      <ul className="social-links__list">{socialLinks}</ul>
    </div>
  );
}

SocialLinks.propTypes = {
  /**
   * rating value
   */
  shape: PropTypes.oneOf(["circle", "rounded"]),
  className: PropTypes.string
};
SocialLinks.defaultProps = {
  shape: null
};

const mapStateToProps = ({ general: { social } }) => ({
  social
});

export default connect(mapStateToProps)(React.memo(SocialLinks));
