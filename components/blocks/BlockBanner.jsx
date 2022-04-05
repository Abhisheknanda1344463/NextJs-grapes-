// react
import React from 'react';

// third-party
import Link from 'next/link';

export default function BlockBanner() {
    return (
        <div className="block block-banner">
            <div className="container">
                <Link href="/" className="block-banner__body">
                    <a>
                        <div
                            className="block-banner__image block-banner__image--desktop"
                            style={{ backgroundImage: 'url("images/banners/banner-1.jpg")' }}
                        />
                        <div
                            className="block-banner__image block-banner__image--mobile"
                            style={{ backgroundImage: 'url("images/banners/banner-1-mobile.jpg")' }}
                        />
                        <div className="block-banner__title">
                            Hundreds
                            <br className="block-banner__mobile-br" />
                            Hand Tools
                        </div>
                        <div className="block-banner__text">
                            Hammers, Chisels, Universal Pliers, Nippers, Jigsaws, Saws
                        </div>
                        <div className="block-banner__button">
                            <span className="btn btn-sm btn-primary">Shop Now</span>
                        </div>
                    </a>
                </Link>
            </div>
        </div>
    );
}
