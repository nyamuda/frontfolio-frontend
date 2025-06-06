import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { useAuthStore } from "@/stores/auth";
import AuthView from "@/views/AuthView.vue";
import UserAccount from "@/components/auth/UserAccount.vue";
import LoginUser from "@/components/auth/LoginUser.vue";
import RegisterUser from "@/components/auth/RegisterUser.vue";
import EmailVerificationRequest from "@/components/auth/EmailVerificationRequest.vue";
import VerifyEmailOtp from "@/components/auth/VerifyEmailOtp.vue";
import PasswordResetRequest from "@/components/auth/PasswordResetRequest.vue";
import VerifyPasswordResetOtp from "@/components/auth/VerifyPasswordResetOtp.vue";
import ResetPassword from "@/components/auth/ResetPassword.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/auth",
      name: "Auth",
      component: AuthView,
      children: [
        {
          path: "",
          name: "UserAccount",
          component: UserAccount,
          beforeEnter: (to) => {
            const authStore = useAuthStore();
            //this is a protected route
            if (!authStore.isAuthenticated) {
              //store the attempted URL
              authStore.attemptedUrl = to.fullPath;
              // Redirect to login page
              return { name: "Login" };
            }
            return true;
          },
        },
        {
          path: "login",
          name: "Login",
          component: LoginUser,
        },
        {
          path: "register",
          name: "Register",
          component: RegisterUser,
        },
        {
          path: "email-verification/request",
          component: EmailVerificationRequest,
        },
        {
          path: "email-verification/verify",
          component: VerifyEmailOtp,
        },
        {
          path: "password-reset/request",
          component: PasswordResetRequest,
        },
        {
          path: "password-reset/verify-otp",
          component: VerifyPasswordResetOtp,
        },
        {
          path: "password-reset/reset",
          component: ResetPassword,
        },
      ],
    },
  ],
});

export default router;
