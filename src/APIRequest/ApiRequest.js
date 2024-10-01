import axios from "axios";
import { ErrorToast, SuccessToast } from "../helper/FormHelper";
import {
  getEmail,
  getToken,
  setEmail,
  setOTP,
  setToken,
  setUserDetails,
} from "../helper/SessionHelper";
import { HideLoader, ShowLoader } from "../redox/state-slice/settingSlice";
import { SetSummary } from "../redox/state-slice/summarySlice";
import {
  SetCanceledTask,
  SetCompletedTask,
  SetNewTask,
  SetProgressTask,
} from "../redox/state-slice/taskSlice";
import { setProfile } from "../redox/state-slice/profileSlice";
import store from "../redox/store/store";
const baseURL = "https://task-management-backend-ep6l.onrender.com/api/v1";
//const baseURL = "http://localhost:5400/api/v1";
const AxiosHeader = { headers: { token: getToken() } };

export const LoginRequest = async (email, password) => {
  store.dispatch(ShowLoader());
  let URL = baseURL + "/Logins";
  try {
    store.dispatch(ShowLoader());
    let res = await axios.post(URL, { email: email, password: password });
    store.dispatch(HideLoader());
    console.log(res.data["data"].length > 0, "login");
    if (res.status === 201 && res.data["status"] === "success") {
      setToken(res.data["token"]);
      setEmail(email);
      setUserDetails(res.data["data"]);
      SuccessToast("Login Success");
      return true;
    } else {
      ErrorToast("Something Went Wrong");
      return false;
    }
  } catch (err) {
    ErrorToast(err, "Something is Wrong");
    store.dispatch(HideLoader());
    return false;
  }
};
export function NewTaskRequest(title, description) {
  store.dispatch(ShowLoader());
  let URL = baseURL + "/CreateTask";
  let postBody = { title: title, description: description, status: "New" };
  return axios
    .post(URL, postBody, AxiosHeader)
    .then((res) => {
      store.dispatch(HideLoader());
      if (res.status === 201) {
        SuccessToast("Task Created");
        return true;
      } else {
        ErrorToast("Something Went Wrong");
        return false;
      }
    })
    .catch((err) => {
      ErrorToast("Something is Wrong");
      store.dispatch(HideLoader());
      return false;
    });
}

export function RegistrationRequest(
  email,
  firstName,
  lastName,
  mobile,
  password,
  photo
) {
  store.dispatch(ShowLoader());
  let URL = baseURL + "/Registrations";
  let postBody = {
    email: email,
    firstName: firstName,
    lastName: lastName,
    mobile: mobile,
    password: password,
    photo: photo,
  };
  return axios
    .post(URL, postBody)
    .then((res) => {
      store.dispatch(HideLoader());
      if (res.status === 201) {
        if (res.data["status"] === "fail") {
          if (
            res.data["data"]["keyPattern"]["email"] === "Email Already Exists"
          ) {
            ErrorToast("Something Wrong");
            return false;
          }
        } else {
          SuccessToast("Registration Success");
          return true;
        }
      } else {
        ErrorToast("Something Wrong");
        return false;
      }
    })
    .catch((err) => {
      store.dispatch(HideLoader());
      ErrorToast("Email Alreay exists" + err);
      return false;
    });
}

export const TasklistByStatus = async (status) => {
  store.dispatch(ShowLoader());
  let URL = baseURL + "/ListTaskByStatus/" + status;
  try {
    let res = await axios.get(URL, AxiosHeader);
    store.dispatch(HideLoader());
    if (res.status === 201) {
      if (status === "New") {
        store.dispatch(SetNewTask(res.data["data"]));
      } else if (status === "Progress") {
        store.dispatch(SetProgressTask(res.data["data"]));
      } else if (status === "Completed") {
        store.dispatch(SetCompletedTask(res.data["data"]));
      } else if (status === "Canceled") {
        store.dispatch(SetCanceledTask(res.data["data"]));
      }
      return true;
    } else {
      ErrorToast("Something Wrong");
      return false;
    }
  } catch (error) {
    store.dispatch(HideLoader());
    ErrorToast("Something is Wrong");
    return false;
  }
};

export function TaskCountRequest() {
  store.dispatch(ShowLoader());
  let URL = baseURL + "/TaskStausCount?";
  axios
    .get(URL, AxiosHeader)
    .then((res) => {
      store.dispatch(HideLoader());
      if (res.status === 201) {
        store.dispatch(SetSummary(res.data["data"]));
      } else {
        ErrorToast("Something Wrong");
      }
    })
    .catch((err) => {
      store.dispatch(HideLoader());
      ErrorToast("Something Went Wrong");
    });
}

export async function DeleteRequest(id) {
  try {
    store.dispatch(ShowLoader());
    let URL = baseURL + "/DeleteTask/" + id;
    let result = await axios.delete(URL, AxiosHeader);
    store.dispatch(HideLoader());
    if (result.status === 201) {
      SuccessToast("Delete Success");
      return true;
    } else {
      ErrorToast("Something Wrong");
      return false;
    }
  } catch (error) {
    console.log(error);
    store.dispatch(HideLoader());
    ErrorToast("Something is Wrong");
    return false;
  }
}

export async function UpdateRequest(id, status) {
  store.dispatch(ShowLoader());
  let URL = baseURL + "/UpdateTask/" + id + "/" + status;
  try {
    store.dispatch(ShowLoader());
    let result = await axios.put(URL, AxiosHeader);
    store.dispatch(HideLoader());
    if (result.status === 201) {
      SuccessToast("Update Success");
      return true;
    } else {
      ErrorToast("Something Wrong");
      return false;
    }
  } catch (error) {
    ErrorToast("Something Went Wrong");
    store.dispatch(HideLoader());
    return false;
  }
}

export async function DeleteUserRequest(id) {
  store.dispatch(ShowLoader());
  let URL = baseURL + "/DeleteUser/" + id;
  try {
    let res = await axios.delete(URL, AxiosHeader);
    store.dispatch(HideLoader());
    if (res.status === 201) {
      SuccessToast("User Delete Success");
      return true;
    } else {
      // handle other cases
      return false;
    }
  } catch (error) {
    ErrorToast("Something Went Wrong");
    store.dispatch(HideLoader());
    return false;
  }
}

export async function GetProfileDetails() {
  store.dispatch(ShowLoader());
  let URL = baseURL + "/UserProfileDetails";
  try {
    const res = await axios.get(URL, AxiosHeader);
    store.dispatch(HideLoader());
    if (res.status === 201 && res.data["status"] === "success") {
      if (res.data["data"].length > 0) {
        store.dispatch(setProfile(res.data["data"]));
      } else {
        ErrorToast("Something Wrong");
      }
    } else {
      ErrorToast("Something Wrong");
    }
  } catch (err) {
    ErrorToast("Somethig went Wrong");
    store.dispatch(HideLoader());
  }
}

export function UserProfileUpdate(
  email,
  firstName,
  lastName,
  mobile,
  password,
  photo
) {
  store.dispatch(ShowLoader());
  let URL = baseURL + "/UpdateProfiles";
  let postBody = {
    email: email,
    firstName: firstName,
    lastName: lastName,
    mobile: mobile,
    password: password,
    photo: photo,
  };
  let UserDetalis = {
    email: email,
    firstName: firstName,
    lastName: lastName,
    mobile: mobile,
    photo: photo,
  };
  return axios
    .post(URL, postBody, AxiosHeader)
    .then((res) => {
      store.dispatch(HideLoader());
      if (res.status === 201) {
        SuccessToast("Profile Update Success");
        setUserDetails(UserDetalis);
        return true;
      } else {
        ErrorToast("Somethig Went Wrong");
        return false;
      }
    })
    .catch((err) => {
      ErrorToast("Something Went Wrong");
      store.dispatch(HideLoader());
      return false;
    });
}

// Recovery Password step 1 SendOTP

export function RecoveryVerifyEmailRequest(email) {
  store.dispatch(ShowLoader());
  let URL = baseURL + "/RecoveryVerifyEmail/" + email;
  return axios
    .get(URL)
    .then((res) => {
      store.dispatch(HideLoader());
      if (res.status === 201) {
        setEmail(email);
        return true;
      } else {
        ErrorToast("Something Went Wrong");
        return false;
      }
    })
    .catch((err) => {
      ErrorToast("Somethig Wrong");
      store.dispatch(HideLoader());
      return false;
    });
}

// Recovery Password step 2 Verify OTP

export function RecoveryVerifyOTPRequest(email, OTP) {
  store.dispatch(ShowLoader());
  let URL = baseURL + "/RecoveryVerifyOTP/" + email + "/" + OTP;
  return axios
    .get(URL)
    .then((res) => {
      store.dispatch(HideLoader());
      if (res.status === 201) {
        SuccessToast("OTP Verification Success");
        setOTP(OTP);
        return true;
      } else {
        ErrorToast(res.data["data"]);
        return false;
      }
    })
    .catch((err) => {
      ErrorToast("Something Went Wrong");
      store.dispatch(HideLoader());
      return false;
    });
}

// Recovery Password step 3 Rest Password
export function ResetPasswordRequest(email, OTP, password) {
  store.dispatch(ShowLoader());
  let URL = baseURL + "/ResetPassword";
  let PostBody = { email: email, OTP: OTP, password: password };

  return axios
    .post(URL, PostBody)
    .then((res) => {
      store.dispatch(HideLoader());
      if (res.data["status"] === "success") {
        setOTP(OTP);
        SuccessToast("New Password Update");
        return true;
      } else {
        ErrorToast("Something Went Wrong");
        return false;
      }
    })
    .catch((err) => {
      ErrorToast("Something Went Wrong");
      store.dispatch(HideLoader());
      return false;
    });
}
