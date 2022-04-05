import React from 'react';
import Link from 'next/link';

function WishlistSideAccount() {
    return (
        <div className="side-account-body">
            <h5 style={{ fontWeight: "400" }}>Account</h5>
            <div className="side-account-title-underline"></div>
            <Link href="/account" className="side-account-link">My account</Link>
            <Link href="/orders" className="side-account-link">My orders</Link>
            <p className="side-account-link color-green" >My wish list</p>
            <Link href="/addresses" className="side-account-link">Adresses</Link>
            <Link href="/personal" className="side-account-link">Personal information</Link>
        </div>
    )
}

export default WishlistSideAccount;
