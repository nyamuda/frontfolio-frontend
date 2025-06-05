import { ref, computed } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import { jwtDecode } from "jwt-decode";


export const useCounterStore = defineStore("counter", () => {
  const count = ref(0);
  const doubleCount = computed(() => count.value * 2);
  function increment() {
    count.value++;
  }
  //Set authorization header for all request to access protected routes from the API
  setAuthToken = () => {
    //check if there is a token in local storage
    const localToken = localStorage.getItem("jwt_token");

    //the current token
    const token = localToken ? localToken : null;

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

//check to see if user is authenticated by using the Jwt token
    authenticateUser = ()=> {

      //check if there is a token in local storage
      const localToken = localStorage.getItem("jwt_token");

      //the current token
      const token = localToken ? localToken : "";

      try {
        if (token) {
//decode the token
 const decodedToken = jwtDecode(token);
          //check if access token has expired or not
 const exp = decodedToken["exp"]; // in seconds
    const now = Math.floor(Date.now() / 1000); // current time in seconds

let hasExpired:boolean=exp? now>exp:true;
          //if token has expired, then the user is not authenticated
          const isUserAuthenticated = hasExpired ? false : true;

          //if token hasn't expired
          //store the user details
          if (!hasExpired) {
const userId=decodedToken.sub;
const  email=decodedToken.

            let userData = {
              id: decodedToken[
                ""
              ],
              email:
                decodedToken[
                  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
                ],
              role: decodedToken[
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
              ],
              isVerified: decodedToken?.isVerified.toLowerCase(),
            };
            //add an extra boolean field
            userData.isAdmin =
              userData.role.toLowerCase() == "admin" ? true : false;
            //store the user details
            commit("addUserInfo", userData);
          }
          commit("authenticateUser", isUserAuthenticated);
        } else {
          commit("authenticateUser", false);
        }
      } catch (error) {
        commit("authenticateUser", false);
      }
    }

  return { count, doubleCount, increment };
});


