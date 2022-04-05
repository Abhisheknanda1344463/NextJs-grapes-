// react
import React from 'react';

// third-party
import PropTypes from 'prop-types';
import Link from 'next/link';
import Image from 'components/hoc/Image';

// application
import BlockHeader from '../shared/BlockHeader';

export default function BlockCategories(props) {

    const { title, layout, categories } = props;

    const categoriesList = categories.map((category, index) => {
        const classes = `block-categories__item category-card category-card--layout--${layout}`;

        const subcategories = category.subcategories.map((sub, subIndex) => (
            <li key={subIndex}>
                <Link href={sub.url} >{sub.title}</Link>
            </li>
        ));

        return (
            <div key={index} className={classes}>
                <div className=" category-card__body">
                    <div className=" category-card__image">
                        <Link href={category.url}><Image src={category.image} alt="" layout='fill' /></Link>
                    </div>
                    <div className=" category-card__content">
                        <div className=" category-card__name">
                            <Link href={category.url}>{category.title}</Link>
                        </div>
                        <ul className="category-card__links">
                            {subcategories}
                        </ul>
                        <div className="category-card__all">
                            <Link href={category.url}>Show All</Link>
                        </div>
                        <div className="category-card__products">
                            {`${category.products} Products`}
                        </div>
                    </div>
                </div>
            </div>
        );
    });

    return (
        <div className={`block block--highlighted block-categories block-categories--layout--${layout}`}>
            <div className="container">
                <BlockHeader title={title} />

                <div className="block-categories__list">
                    {categoriesList}
                </div>
            </div>
        </div>
    );
}

BlockCategories.propTypes = {
    title: PropTypes.string.isRequired,
    categories: PropTypes.array,
    layout: PropTypes.oneOf(['classic', 'compact']),
};

BlockCategories.defaultProps = {
    categories: [],
    layout: 'classic',
};
