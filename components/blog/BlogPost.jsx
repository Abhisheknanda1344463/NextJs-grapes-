// react
import React from "react";
import Head from "next/head";
// third-party
import classNames from "classnames";
import PropTypes from "prop-types";
import Link from "next/link";
import defaultImage from "../../images/defoultpic.png";
import Image from "components/hoc/Image";

export default function BlogPost(props) {
  const { layout, blog, dbName } = props;
  // console.log(blog, "blog in blog post")
  const postClasses = classNames("post__content typography", {
    "typography--expanded": layout === "full",
  });

  if (!blog) {
    return "";
  }
  const createMarkup = (item) => {
    return { __html: item };
  };
  console.log(blog, "blogblogblogblog");
  let day = new Date(blog.created_at);
  console.log(defaultImage, "defaultImage   in create");
  let dd = String(day.getDate()).padStart(2, "0");
  let mm = String(day.getMonth() + 1).padStart(2, "0"); //January is 0!
  let yyyy = day.getFullYear();

  day = dd + "/" + mm + "/" + yyyy;

  return (
    <>
      <Head>
        <meta property="og:title" name="title" content={blog?.meta_title} />
        <meta
          property="og:description"
          name="description"
          content={blog?.meta_description}
        />
        <meta
          property="og:keywords"
          name="keywords"
          content={blog?.meta_keywords}
        />
      </Head>
      <div className={`block post post--layout--${layout}`}>
        <div
          className={`post__header post-header post-header--layout--${layout}`}
        >
          <h1 className="post-header__title">{blog.title}</h1>
          <div className="post-header__meta">
            <div className="post-header__meta-item"> {day}</div>
          </div>
        </div>

        <div className="post__featured">
          <Image
            src={`/storage/${dbName}/${
              blog.image ? blog.image : defaultImage.src
            }`}
            alt=""
            layout="fill"
          />
        </div>

        <div
          className={postClasses}
          dangerouslySetInnerHTML={createMarkup(blog.html_content)}
        />
      </div>
    </>
  );
}

BlogPost.propTypes = {
  /**
   * post layout
   * one of ['classic', 'full'] (default: 'classic')
   */
  layout: PropTypes.oneOf(["classic", "full"]),
};

BlogPost.defaultProps = {
  layout: "classic",
};
