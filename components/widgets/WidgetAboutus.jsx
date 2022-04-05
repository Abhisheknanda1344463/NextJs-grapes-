// react
import React from 'react';

// application
import SocialLinks from '../shared/SocialLinks';

function WidgetAboutus() {
    return (
        <div className="widget-aboutus widget">
            <h4 className="widget__title">About Blog</h4>
            <div className="widget-aboutus__text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt, erat in
                malesuada aliquam, est erat faucibus purus, eget viverra nulla sem vitae neque.
                Quisque id sodales libero.
            </div>

            <SocialLinks className="widget-aboutus__socials" shape="rounded" />
        </div>
    );
}

export default WidgetAboutus;
