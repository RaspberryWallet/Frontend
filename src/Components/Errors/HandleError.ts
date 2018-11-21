import {toast} from "react-toastify";

export default async function handleError(response: Response) {
    if (response.body) {
        try {
            const error = await response.json();
            toast.error(error.message.message);
        } catch (e) {
            console.error(e)
        }
    } else {
        toast.error(response.statusText);
    }
}