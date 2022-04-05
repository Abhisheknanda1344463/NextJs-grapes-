// react
import React from 'react';

// third-party
import { Link } from 'react-router-dom';

function WidgetTags() {
    return (
        <div className="widget-tags widget">
            <h4 className="widget__title">Tags Cloud</h4>
            <div className="tags tags--lg">
                <div className="tags__list">
                    <Link href="/">Promotion</Link>
                    <Link href="/">Power Tool</Link>
                    <Link href="/">New Arrivals</Link>
                    <Link href="/">Screwdriver</Link>
                    <Link href="/">Wrench</Link>
                    <Link href="/">Mounts</Link>
                    <Link href="/">Electrodes</Link>
                    <Link href="/">Chainsaws</Link>
                    <Link href="/">Manometers</Link>
                    <Link href="/">Nails</Link>
                    <Link href="/">Air Guns</Link>
                    <Link href="/">Cutting Discs</Link>
                </div>
            </div>
        </div>
    );
}

export default WidgetTags;
