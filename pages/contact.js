import { useRouter } from "next/router";
import ContactWithUs from "components/footer/ContactWithUs";

export default function Contact() {
  const router = useRouter();
  //   const { id, orderID } = router.query

  return <ContactWithUs />;
}
