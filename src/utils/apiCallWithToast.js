import { toast } from "react-hot-toast";

export async function apiCallWithToast(promise, messages) {
  return toast.promise(promise, messages, {
    style: { minWidth: "250px" },
  });
}
