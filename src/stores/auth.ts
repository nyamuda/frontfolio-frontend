import { ref, computed } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const useCounterStore = defineStore("counter", () => {
  const isAuthenticated = ref(false);

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
      const decodedToken = jwtDecode(token);
      //check if access token has expired or not
      const exp = decodedToken.exp; // in seconds
      const now = Math.floor(Date.now() / 1000); // current time in seconds

      const hasExpired: boolean = exp ? exp > now : true;
      //if token has expired, then the user is not authenticated
      isAuthenticated.value = hasExpired ? false : true;
    } catch {
      isAuthenticated.value = false;
    }
  };

  return {};
});
