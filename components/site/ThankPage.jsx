// react
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Check100Svg } from '../../svg';
import { runFbPixelEvent } from '../../services/utils';

function ThankPage() {
  const router = useRouter();
  const { id, orderID } = router.query
  // const [iframe, setIframe] = useState();

  useEffect(() => {
    // if (orderID || id) {
    //   if (orderID) {
    //     setIframe(`<iframe src="https://testpayments.ameriabank.am/forms/frm_checkprint.aspx?lang=am&paymentid=${orderID}" width="100%" height="1000px"></iframe>`);
    //   } else {
    //     setIframe('<div style="height:250px"></div>');
    //   }
    // }
    runFbPixelEvent({ name: "Purchase" })
  })


  const createMarkup = (item) => {
    return { __html: item };
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="order-success__body">
          <div className="order-success__header">
            <Check100Svg className="order-success__icon" />
            <h1 className="order-success__title">Thank you</h1>
            <div className="order-success__subtitle">Your order #{orderID} has been received</div>
            <div className="order-success__actions">
              <Link href="/"><a className="btn btn-secondary">Go To Homepage</a></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThankPage;
