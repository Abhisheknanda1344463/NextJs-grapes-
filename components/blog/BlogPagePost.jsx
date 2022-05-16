// react
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Helmet } from "react-helmet-async";

import PropTypes from "prop-types";
import { url } from "../../helper";
import BlogPost from "./BlogPost";
import theme from "../../data/theme";
import PageHeader from "../shared/PageHeader";

export default function BlogPagePost(props) {
  let content;
  let bogOne;
  const router = useRouter();
  const [blog, setBlog] = useState(props.blog[0]);
  const [redirect, setRedirect] = useState();
  const { layout, blogSlug } = props;
  const selectedData = useSelector((state) => state.locale.code);

  const prevBlogSlugRef = useRef();
  const prevLocaleCodeRef = useRef();

  useEffect(() => {
    prevBlogSlugRef.current = blogSlug;
    prevLocaleCodeRef.current = selectedData;
  }, []);

  useEffect(() => {
    if (
      prevBlogSlugRef.current != blogSlug ||
      prevLocaleCodeRef.current != selectedData
    ) {
      setBlog(props.blog[0]);
      prevBlogSlugRef.current = blogSlug;
      prevLocaleCodeRef.current = selectedData;
    }
  }, [blogSlug, props.locale]);
  console.log(blog, "blogblogblog");
  if (redirect) {
    return router.push("/404");
  }

  if (blog) {
    bogOne = blog;
  }

  content = (
    <div className="row justify-content-center">
      <div className="col-md-12 col-lg-9 col-xl-8">
        <BlogPost blog={bogOne} dbName={props.dbName} layout={layout} />
      </div>
    </div>
  );

  const breadcrumbs = [
    { title: <FormattedMessage id="home" defaultMessage="Home" />, url: "" },
    {
      title: <FormattedMessage id="blog" defaultMessage="Blog" />,
      url: "/blog",
    },
    { title: <FormattedMessage id="news" defaultMessage="News" />, url: "" },
  ];

  return (
    <React.Fragment>
      <Helmet>
        <title>{`Blog Post Page — ${theme.name}`}</title>
      </Helmet>

      <PageHeader breadcrumb={breadcrumbs} />

      <div className="container">{content}</div>
    </React.Fragment>
  );
}

BlogPagePost.propTypes = {
  /**
   * post layout
   * one of ['classic', 'full'] (default: 'classic')
   */
  layout: PropTypes.oneOf(["classic", "full"]),
  /**
   * sidebar position (default: 'start')
   * one of ['start', 'end']
   * for LTR scripts "start" is "left" and "end" is "right"
   */
  sidebarPosition: PropTypes.oneOf(["start", "end"]),
};

BlogPagePost.defaultProps = {
  layout: "classic",
  sidebarPosition: "start",
};
