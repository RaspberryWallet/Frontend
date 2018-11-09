import {toast} from "react-toastify";

export default async function handleError(response: Response) {
    if (response.body) {
        const error = await response.json();
        toast.error(error.message);
    } else {
        toast.error(response.statusText);
    }
}