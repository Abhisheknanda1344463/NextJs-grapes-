import AccountPageOrderDetails from "../../../components/account/AccountPageOrderDetails";
import { useRouter } from "next/router";

function Orders(props) {
  const router = useRouter();
  return (
    <AccountPageOrderDetails
      dbName={props.dbName}
      locale={props.locale}
      orderId={router.query.orderId}
    />
  );
}
export async function getServerSideProps({ locale, locales, req, res }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );
  const dbName = req.headers["x-forwarded-host"];

  return {
    props: {
      locale: locale,
      dbName: dbName,
    },
  };
}
export default Orders;
