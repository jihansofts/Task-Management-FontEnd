import Swal from "sweetalert2";
import { DeleteRequest } from "../APIRequest/ApiRequest";
export function DeleteToDo(id) {
  return Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  })
    .then((result) => {
      if (result.isConfirmed) {
        return DeleteRequest(id);
      } else {
        console.log("Erorr");
      }
    })
    .catch((err) => {
      console.log("Error Alert", err);
    });
}
