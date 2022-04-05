// react
import React from 'react';

// third-party
import PropTypes from 'prop-types';
import Link from 'next/link';
import Image from 'components/hoc/Image';

function WidgetPosts(props) {
    const { posts } = props;
    const postImage = (post) => post.image.replace(/\.jpg$/, '-thumbnail.jpg');

    const postsList = posts.map((post) => (
        <div key={post.id} className="widget-posts__item">
            <div className="widget-posts__image">
                <Link href="/blog/post-classic">
                    <Image src={postImage(post)} alt="" layout='fill' />
                </Link>
            </div>
            <div className="widget-posts__info">
                <div className="widget-posts__name">
                    <Link href="/blog/post-classic">{post.title}</Link>
                </div>
                <div className="widget-posts__date">{post.date}</div>
            </div>
        </div>
    ));

    return (
        <div className="widget-posts widget">
            <h4 className="widget__title">Latest Posts</h4>
            <div className="widget-posts__list">
                {postsList}
            </div>
        </div>
    );
}

WidgetPosts.propTypes = {
    /**
     * array of posts
     */
    posts: PropTypes.array,
};
WidgetPosts.defaultProps = {
    posts: [],
};

export default WidgetPosts;
