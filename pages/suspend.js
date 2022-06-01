import suspendImage from "../images/suspend.png";
import Image from "next/image";
import Link from "next/link";

const Suspend = ({ DomainName }) => {
    return (
        <div className="SuspendMain">
            <div className="SuspendBody container p-0">
                <div className="Suspend">
                    <div>
                        <div className="SuspendImage">
                            <Image src={suspendImage} alt="Suspend Image" />
                        </div>
                    </div>

                    <h1>
                        {DomainName} <br />
                        is no longer aviable
                    </h1>

                    <h3>
                        This website has been archived or suspended in accordance with our{" "}
                        <Link href="https://www.zegashop.com/web/terms-of-service/">
                            <a target="_blank">Terms Of Service.</a>
                        </Link>
                    </h3>
                    <h5>
                        For more information, Please,{" "}
                        <Link href="https://www.zegashop.com/web/contact-us/" >
                            <a target="_blank" >Contact us.</a>
                        </Link>
                    </h5>
                </div>
            </div>
        </div>
    );
};

export default Suspend;
