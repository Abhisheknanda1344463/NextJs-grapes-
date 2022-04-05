// react
import React from "react";
import { GroupSvg } from "../../svg";
// import { ProftecSvg } from '../../svg';
// import { UnielSvg } from '../../svg';
// import { VolpeVolanteSvg } from '../../svg';
// import { SupraSvg } from '../../svg';

import era from "../../images/era_m.png";
import grifon from "../../images/grifon.png";
import kosmos from "../../images/kosmos_m.png";
import prof from "../../images/profitec_m.png";
import supra from "../../images/supra_m.png";
import elect from "../../images/tdm-electric_m.png";
import unibob from "../../images/unibob_m.png";
import uniel from "../../images/uniel_m.png";
import volpe from "../../images/volpe-volante_m.png";
import BlockHeaderCustom from "../shared/BlockHeaderCustom";
import Image from 'components/hoc/Image';
import Link from 'next/link'

function BlockBrandsImages(props) {
    return (
        <div className="brands">
            <div className="container">
                <BlockHeaderCustom title="Products" />
                {/* <GroupSvg /> */}
                <div className="row">
                    <div className="col-md-4 d-flex justify-content-center align-items-cente ">
                        <Link className="m-auto" href="#">
                            <Image src={era} alt="" layout='fill' />{" "}
                        </Link>
                        <Link className="m-auto" href="#">
                            {" "}
                            <Image src={grifon} alt="" layout='fill' />{" "}
                        </Link>
                        <Link className="m-auto" href="#">
                            {" "}
                            <Image src={kosmos} alt="" layout='fill' />{" "}
                        </Link>
                    </div>
                    <div className="col-md-4 d-flex justify-content-center align-items-cente">
                        <Link className="m-auto" href="#">
                            <Image src={prof} alt="" layout='fill' />{" "}
                        </Link>
                        <Link className="m-auto" href="#">
                            {" "}
                            <Image src={supra} alt="" layout='fill' />{" "}
                        </Link>
                        <Link className="m-auto" href="#">
                            {" "}
                            <Image src={elect} alt="" layout='fill' />{" "}
                        </Link>
                    </div>
                    <div className="col-md-4 d-flex justify-content-center align-items-cente">
                        <Link className="m-auto" href="#">
                            {" "}
                            <Image src={unibob} alt="" layout='fill' />{" "}
                        </Link>
                        <Link className="m-auto" href="#">
                            {" "}
                            <Image src={uniel} alt="" layout='fill' />{" "}
                        </Link>
                        <Link className="m-auto" href="#">
                            {" "}
                            <Image src={volpe} alt="" layout='fill' />{" "}
                        </Link>
                    </div>
                </div>

                {/* <div><SupraSvg /></div>
                <div> <VolpeVolanteSvg /></div>
                <div><UnielSvg /></div>
                <div><ProftecSvg /></div> */}
            </div>
        </div>
    );
}

export default BlockBrandsImages;
