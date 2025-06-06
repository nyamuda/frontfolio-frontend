import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { useAuthStore } from "@/stores/auth";
import AuthView from "@/views/AuthView.vue";
import UserAccount from "@/components/auth/UserAccount.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
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
      ],
    },
  ],
});

export default router;
