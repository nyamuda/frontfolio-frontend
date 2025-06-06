import { ref, type Ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import type { CustomJwtPayload } from "@/interfaces/auth/jwtPayload";
import { User } from "@/models/User";
import { apiUrl } from "@/helpers/urlHelper";
import { unexpectedErrorMessage } from "@/helpers/errorMessageHelper";
import type { LoginDetails } from "@/interfaces/auth/loginDetails";
import type { RegistrationDetails } from "@/interfaces/auth/registerDetails";

export const useAuthStore = defineStore("auth", () => {
  const isAuthenticated = ref(false);
  const user: Ref<User | null> = ref(null);
  //the email of a user if they're not verified
  const emailToVerify: Ref<string | null> = ref(null);
  const isVerifyingEmailOtp: Ref<boolean> = ref(false);
  //email verification OTP code
  const emailVerificationOtp: Ref<string | null> = ref(null);
  //attempted url if the user is not logged in
  //and they're redirected to the log in page
  const attemptedUrl = ref("");

  const getUserDetails = (): Promise<User> => {
    return new Promise((resolve, reject) => {
      //add access token to the request
      //to access the protected route
      setAuthToken();
      axios
        .get<User>(`${apiUrl}/me`)
        .then((response) => {
          user.value = response.data;
          resolve(response.data);
        })
        .catch((error) => {
          const message = error.response.data?.message || unexpectedErrorMessage;
          reject(message);
        });
    });
  };

  //Login user and get the access token
  const login = (loginDetails: LoginDetails): Promise<{ isVerified: boolean }> => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${apiUrl}/login`, loginDetails)
        .then((response) => {
          //get the access token
          const token = response.data?.token;
          if (!token) throw new Error("Login failed.");
          //decode the access token
          const decodedToken = jwtDecode<CustomJwtPayload>(token);
          if (decodedToken.isVerified?.toLocaleLowerCase() == "true") {
            //save the token to local storage
            localStorage.setItem("jwt_token", token);

            //mark the user as authenticated
            authenticateUser();

            resolve({ isVerified: true });
          }
          //if the user is not verified
          //store the email that needs to be verified
          else {
            emailToVerify.value =
              decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ||
              null;

            resolve({ isVerified: false });
          }
        })
        .catch((error) => {
          const message = error.response.data?.message || unexpectedErrorMessage;
          reject(message);
        });
    });
  };

  //Register a new user
  const register = (registrationDetails: RegistrationDetails) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${apiUrl}/register`, registrationDetails)
        .then(() => resolve({}))
        .catch((error) => {
          const message = error.response.data?.message || unexpectedErrorMessage;
          reject(message);
        });
    });
  };

  //Send an email to let the user verify their email using a one-time password(OTP)
  //The OTP is emailed to the user email
  const requestEmailVerification = async (email: string) => {
    await axios.post(`${apiUrl}/email-verification/request`, { email });
  };

  //Verify email using a one-time password (OTP)
  const verifyEmail = (verifyDetails: { email: string; otpCode: string }) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${apiUrl}/email-verification/verify`, verifyDetails)
        .then(() => resolve({}))
        .catch((error) => {
          const message = error.response.data?.message || unexpectedErrorMessage;
          reject(message);
        });
    });
  };

  //Send a request to reset password using a one-time password(OTP)
  //The OTP is emailed to the user email
  const passwordResetRequest = async (email: string) => {
    await axios.post(`${apiUrl}/password-reset/request`, { email });
  };

  //Verifies password reset one-time password(OTP)
  //Returns a reset token if the OTP code is valid
  const verifyPasswordResetOtp = (verifyOtpDetails: {
    email: string;
    otpCode: string;
  }): Promise<{ resetToken: string }> => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${apiUrl}/password-reset/verify-otp`, verifyOtpDetails)
        .then((response) => resolve({ resetToken: response.data.resetToken }))
        .catch((error) => {
          const message = error.response.data?.message || unexpectedErrorMessage;
          reject(message);
        });
    });
  };

  //Set authorization header for all request to access protected routes from the API
  const setAuthToken = () => {
    //check if there is a token in local storage
    const localToken = localStorage.getItem("jwt_token");

    //the current token
    const token = localToken ? localToken : null;

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  //check to see if user is authenticated by using the Jwt token
  const authenticateUser = () => {
    try {
      //check if there is a token in local storage
      const token = localStorage.getItem("jwt_token");

      if (!token) throw new Error("Token not found in localStorage");

      //decode the token
      const decodedToken = jwtDecode<CustomJwtPayload>(token);
      //check if access token has expired or not
      const exp = decodedToken.exp; // in seconds
      const now = Math.floor(Date.now() / 1000); // current time in seconds

      const hasExpired: boolean = exp ? exp > now : true;
      //if token has expired, then the user is not authenticated
      isAuthenticated.value = hasExpired ? false : true;

      if (isAuthenticated.value) {
        getUserDetails();
      }
    } catch {
      isAuthenticated.value = false;
    }
  };

  return {
    login,
    register,
    passwordResetRequest,
    requestEmailVerification,
    verifyEmail,
    verifyPasswordResetOtp,
    attemptedUrl,
    isAuthenticated,
    emailToVerify,
    emailVerificationOtp,
    isVerifyingEmailOtp,
  };
});
