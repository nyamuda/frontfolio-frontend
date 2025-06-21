import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { useAuthStore } from "@/stores/auth";
import AuthView from "@/views/AuthView.vue";
import UserAccount from "@/components/auth/UserAccount.vue";
import LoginUser from "@/components/auth/LoginUser.vue";
import RegisterUser from "@/components/auth/RegisterUser.vue";
import EmailVerificationRequest from "@/components/auth/EmailVerificationRequest.vue";

import PasswordResetRequest from "@/components/auth/PasswordResetRequest.vue";

import ResetPassword from "@/components/auth/ResetPassword.vue";
import ProjectView from "@/views/ProjectView.vue";
import ProjectList from "@/components/projects/ProjectList.vue";
import AddProject from "@/components/projects/AddProject.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    //Project routes
    {
      path: "/projects",
      name: "Projects",
      component: ProjectView,
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
      children: [
        {
          path: "",
          name: "ProjectList",
          component: ProjectList,
        },
        {
          path: "add",
          name: "AddProject",
          component: AddProject,
        },
      ],
    },

    //Auth routes
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
          path: "password-reset/request",
          component: PasswordResetRequest,
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
