import {toast} from "react-toastify";

export default async function handleError(response: Response) {
    if (response.body) {
        try {
            const error = await response.json();
            toast.error(error.message);
        } catch (e) {
            console.error(e)
        }
        toast.error(response.statusText);
    } else {
        toast.error(response.statusText);
    }
}