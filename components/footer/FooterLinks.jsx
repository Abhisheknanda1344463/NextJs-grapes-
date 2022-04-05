// react
import React from 'react';

// third-party
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {DaysSvg} from '../../svg'
import {HyumensSvg} from '../../svg'

export default function FooterLinks(props) {
    let dateObj = new Date();
    let month = dateObj.getUTCMonth() + 1; //months from 1-12
    let day = dateObj.getUTCDate();
    let year = dateObj.getUTCFullYear();

    let newdate = day + "-" + month + "-" + year;
    return (
        <div className="site-footer__widget footer-links">
            {/* <h5 className="footer-links__title">{title}</h5> */}
            <ul className="footer-links__list">
                <li>ԿԱՅՔԻ ԱՅՑԵՐԸ</li>
                <li>
                    <span>Այսօր</span><span>660</span>
                </li>
                <li>
                    <span>Երեկ</span><span>2678</span>
                </li>
                <li>
                    <span>Այս Շաբաթ</span><span>6162</span>
                </li>
                <li>
                    <span>Այս Ամիս</span><span>111624</span>
                </li>
                <li>
                    <span>Անցած Ամիս</span><span>131934</span>
                </li>
                <li>
                    <span>Բոլոր Օրերին</span><span>1990372</span>
                </li>
                <li className='footer_day'>
                    <DaysSvg />
                    <span >{newdate}</span>
                </li>
                <li className='footer_calc'>
                    <HyumensSvg />
                    <span >Այցելուների Հաշվիչ</span>
                </li>

            </ul>


 {/* <div className="elfsight-app-2af51906-3724-411e-9f8b-229c3dba5e26"></div> */}
        </div>  
    );
}

FooterLinks.propTypes = {
    /** widget title */
    title: PropTypes.node.isRequired,
    /** array of links */
    items: PropTypes.array,
};

FooterLinks.defaultProps = {
    items: [],
};
