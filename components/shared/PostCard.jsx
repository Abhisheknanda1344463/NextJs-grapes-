import React from "react";

// third-party
import Link from "next/link";
import classNames from "classnames";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import defaultImage from "../../images/defoultpic.png";

function PostCard(props) {
  const { post, layout, dbName, domain } = props;
  const cardClasses = classNames("post-card", {
    "post-card--layout--grid": ["grid-nl", "grid-lg"].includes(layout),
    "post-card--layout--list": ["list-nl", "list-sm"].includes(layout),
    "post-card--size--nl": ["grid-nl", "list-nl"].includes(layout),
    "post-card--size--lg": layout === "grid-lg",
    "post-card--size--sm": layout === "list-sm",
  });

  let day = new Date(post.created_at);

  let dd = String(day.getDate()).padStart(2, "0");
  let mm = String(day.getMonth() + 1).padStart(2, "0"); //January is 0!
  let yyyy = day.getFullYear();

  day = dd + "/" + mm + "/" + yyyy;

  return (
    <div className={cardClasses}>
      <div className="post-card__image">
        <Link href={`/blog/${post.url_key}`}>
          <a>
            <img
              alt="post-image"
              src={`${
                post.image
                  ? `/storage/${dbName}/` + post.image
                  : defaultImage.src
              } `}
              layout="fill"
            />
          </a>
        </Link>
      </div>
      <div className="post-card__info">
        <div className="post-card__name">
          <Link href={`/blog/${post.url_key}`}>{post.blog_title}</Link>
        </div>
        <div className="post-card__read-data">
          <div className="post-card__date">{day}</div>
          <div className="post-card__read-more">
            <Link
              href={`/blog/${post.url_key}`}
              className="btn btn-secondary btn-sm"
            >
              <a>
                <FormattedMessage id="read.more" defaultMessage=" Read More" />
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

PostCard.propTypes = {
  /**
   * post data object
   */
  post: PropTypes.object,
  /**
   * post card layout
   * one of ['grid-nl', 'grid-lg', 'list-nl', 'list-sm']
   */
  layout: PropTypes.oneOf(["grid-nl", "grid-lg", "list-nl", "list-sm"]),
};

export default PostCard;
