// react
import React from "react";

// third-party
import PropTypes from "prop-types";
import Link from "next/link";

function AppLink(props) {
  const { external, children, ...otherProps } = props;
  let link;
  console.log(props, "otherprops in applink")
  if (external) {
    const { href, replace, innerRef, ...linkProps } = otherProps;


    link = (
      <Link href={href} {...linkProps}>
        {children}
      </Link>
    );
  } else {
    link = <Link {...otherProps}>{children}</Link>;
  }

  return link;
}

AppLink.propTypes = {
  href: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      pathname: PropTypes.string,
      search: PropTypes.string,
      hash: PropTypes.string,
      state: PropTypes.any,
    }),
  ]).isRequired,
  replace: PropTypes.bool,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  external: PropTypes.bool,
};
AppLink.defaultProps = {
  external: false,
};

export default AppLink;
