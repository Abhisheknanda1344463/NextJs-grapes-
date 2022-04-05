import ThankPage from "../components/site/ThankPage";
import { useRouter } from 'next/router';

export default function Thank() {
  const router = useRouter();
  const { id, orderID } = router.query

  return <ThankPage id={id} orderID={orderID} />
}
