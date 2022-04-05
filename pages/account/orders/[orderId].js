import AccountPageOrderDetails from "../../../components/account/AccountPageOrderDetails";
import { useRouter } from "next/router";

export default function Orders() {
    const router = useRouter();
    return <AccountPageOrderDetails
        orderId={router.query.orderId}
    />
}
