import ThankPage from "../components/site/ThankPage";
import { useRouter } from 'next/router';
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { cartRemoveAllItems } from '../store/cart'

export default function Thank() {
  const router = useRouter();
  const { id, orderID } = router.query
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(cartRemoveAllItems())
  }, [])

  return <ThankPage id={id} orderID={orderID} />
}
