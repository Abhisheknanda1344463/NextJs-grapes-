import AccountPageEditAddress from "../../../components/account/AccountPageEditAddress";
import { useRouter } from "next/router";

export default function Addresses() {
    const router = useRouter();
    return <AccountPageEditAddress addressId={router.query.addressId} />
}
