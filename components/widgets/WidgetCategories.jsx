// react
import React from 'react';

// third-party
import PropTypes from 'prop-types';
import Link from 'next/link';
import { FormattedMessage } from 'react-intl';

// application
import Collapse from '../shared/Collapse';
import { ArrowRoundedRight6x9Svg } from '../../svg';

function WidgetCategories(props) {
    const { categories, location, catID, dispatch } = props;
    const categoriesList = categories.map((category) => {
        const renderCategory = ({ toggle, setItemRef, setContentRef }) => {
            let expander;
            let children;
            let active = false;
            let activated;
            if (category.children && category.children.length > 0) {
                expander = <button className="widget-categories__expander" type="button" aria-label="Expand" onClick={toggle} />;
                children = (
                    <div className="widget-categories__subs" ref={setContentRef}>
                        <ul>

                            {category.children.map((sub) => {
                                if (catID == sub.id) {
                                    active = true;
                                    activated = true;
                                }

                                return <li className={activated ? 'hoverStyle' : ''} key={sub.id}>
                                    <Link onClick={() => (

                                        dispatch({
                                            type: 'SET_OPTION_VALUE',
                                            option: 'category_id',
                                            value: sub.id
                                        })
                                    )}>{sub.name} </Link>
                                    {activated = false}
                                </li>

                            })}
                        </ul>
                    </div>
                );
            }
            return (

                <li className={` ${(catID == category.id || active === true) ? 'widget-categories__item--open' : ''} widget-categories__item`} ref={setItemRef}>
                    <div className="widget-categories__row">
                        <Link onClick={() => (

                            dispatch({
                                type: 'SET_OPTION_VALUE',
                                option: 'category_id',
                                value: category.id
                            })
                        )} className={(catID == category.id) ? "hoverStyle" : ''}>
                            <a>
                                <ArrowRoundedRight6x9Svg className="widget-categories__arrow" />
                                {category.name}
                            </a>
                        </Link>
                        {expander}
                    </div>
                    {children}
                </li>
            );
        };

        return <Collapse key={category.id} toggleClass="widget-categories__item--open" render={renderCategory} />;
    });

    return (
        <div className={`widget-categories widget-categories--location--${location} widget`}>
            <h4 className="widget__title">
                <FormattedMessage id="categories" defaultMessage="Categories" />
            </h4>
            <ul className="widget-categories__list">
                {categoriesList}
            </ul>
        </div>
    );
}

WidgetCategories.propTypes = {
    /**
     * category array
     */
    categories: PropTypes.array,
    /**
     * widget location (default: 'blog')
     * one of ['blog', 'shop']
     */
    location: PropTypes.oneOf(['blog', 'shop']),
};

WidgetCategories.defaultProps = {
    categories: [],
    location: 'blog',
};

export default WidgetCategories;
