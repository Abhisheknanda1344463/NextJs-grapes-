// react
import React, { Fragment } from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Link from 'next/link'
// application
import { ArrowRoundedLeft6x9Svg } from '../../svg';
import { getCategoryParents, url } from '../../services/utils';

function FilterCategory(props) {
    const { data } = props;
    const categoriesList = data.map((category) => {
        const itemClasses = classNames('filter-categories__item', {
            'filter-categories__item--current': data.value === category,
        });
        return (
            <Fragment key={category.id}>
                <li className={itemClasses}>
                    <Link href={url.category(category)} >{category}</Link>
                </li>
            </Fragment>
        );
    });


    return (
        <div className="filter-categories">
            <ul className="filter-categories__list">
                {categoriesList}
            </ul>
        </div>
    );
}

FilterCategory.propTypes = {
    /**
     * Filter object.
     */
    data: PropTypes.object,
};

export default FilterCategory;
