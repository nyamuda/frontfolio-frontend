<template>
  <div class="card">
    <Menubar :model="items">
      <template #start>
        <svg
          width="35"
          height="40"
          viewBox="0 0 35 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="h-8"
        >
          <path
            d="M25.87 18.05L23.16 17.45L25.27 20.46V29.78L32.49 23.76V13.53L29.18 14.73L25.87 18.04V18.05ZM25.27 35.49L29.18 31.58V27.67L25.27 30.98V35.49ZM20.16 17.14H20.03H20.17H20.16ZM30.1 5.19L34.89 4.81L33.08 12.33L24.1 15.67L30.08 5.2L30.1 5.19ZM5.72 14.74L2.41 13.54V23.77L9.63 29.79V20.47L11.74 17.46L9.03 18.06L5.72 14.75V14.74ZM9.63 30.98L5.72 27.67V31.58L9.63 35.49V30.98ZM4.8 5.2L10.78 15.67L1.81 12.33L0 4.81L4.79 5.19L4.8 5.2ZM24.37 21.05V34.59L22.56 37.29L20.46 39.4H14.44L12.34 37.29L10.53 34.59V21.05L12.42 18.23L17.45 26.8L22.48 18.23L24.37 21.05ZM22.85 0L22.57 0.69L17.45 13.08L12.33 0.69L12.05 0H22.85Z"
            fill="var(--p-primary-color)"
          />
          <path
            d="M30.69 4.21L24.37 4.81L22.57 0.69L22.86 0H26.48L30.69 4.21ZM23.75 5.67L22.66 3.08L18.05 14.24V17.14H19.7H20.03H20.16H20.2L24.1 15.7L30.11 5.19L23.75 5.67ZM4.21002 4.21L10.53 4.81L12.33 0.69L12.05 0H8.43002L4.22002 4.21H4.21002ZM21.9 17.4L20.6 18.2H14.3L13 17.4L12.4 18.2L12.42 18.23L17.45 26.8L22.48 18.23L22.5 18.2L21.9 17.4ZM4.79002 5.19L10.8 15.7L14.7 17.14H14.74H15.2H16.85V14.24L12.24 3.09L11.15 5.68L4.79002 5.2V5.19Z"
            fill="var(--p-text-color)"
          />
        </svg>
      </template>
      <template #item="{ item, props, hasSubmenu }">
        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <a v-ripple :href="href" v-bind="props.action" @click="navigate">
            <span :class="item.icon" />
            <span>{{ item.label }}</span>
          </a>
        </router-link>
        <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
          <span :class="item.icon" />
          <span>{{ item.label }}</span>
          <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down" />
        </a>
      </template>
      <template #end>
        <div class="d-flex align-items-center">
          <div v-if="authStore.isAuthenticated">
            <!--For normal users-->
            <div class="d-flex align-items-center">
              <Button
                icon="fas fa-user-circle"
                label="Account"
                severity="secondary"
                rounded
                aria-label="User"
                @click="toggleAccountButton"
              />
              <Menu ref="accountMenu" id="overlay_menu" :model="userAccountItems" :popup="true" />
            </div>
          </div>
          <template v-else>
            <router-link to="/auth/login"
              ><Button label="Log in" severity="contrast" variant="text"
            /></router-link>
            <router-link class="me-0 me-md-2" to="/auth/register"
              ><Button label="Sign up" class="ms-2" severity="primary"
            /></router-link>
          </template>
        </div>
      </template>
    </Menubar>
  </div>
</template>

<script setup lang="ts">
import Menubar from "primevue/menubar";
import { computed, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import Button from "primevue/button";
import Menu from "primevue/menu";
import { useRouter } from "vue-router";
import { useToast } from "primevue";

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

//Logout user by removing the access token from local storage
const logout = () => {
  try {
    localStorage.removeItem("jwt_token");
    router.push("/");
    authStore.authenticateUser();
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Logout Failed",
      detail: error,
      life: 10000,
    });
  }
};

// Controls the account dropdown menu for regular users.
// This button appears on the right side of the navigation bar.
// It allows users to view their profile or log out.
const accountMenu = ref();
const toggleAccountButton = (event: MouseEvent) => {
  accountMenu.value.toggle(event);
};
const userAccountItems = ref([
  {
    label: "Profile",
    icon: "fas fa-id-badge",
    command: () => {
      router.push("/auth");
    },
  },
  {
    label: "Logout",
    icon: "fas fa-sign-out-alt",
    command: () => {
      logout();
    },
  },
]);

const items = computed(() => {
  //Nav links for logged in users
  if (authStore.isAuthenticated) {
    return [
      {
        label: "Home",
        icon: "pi pi-home",
        route: "/",
      },
      {
        label: "Projects",
        icon: "pi pi-folder",

        items: [
          {
            label: "Add Project",
            icon: "pi pi-folder-plus",
            route: "/projects/add",
          },
          {
            label: "View Projects",
            icon: "pi pi-eye",
            route: "/projects",
          },
        ],
      },
      {
        label: "Blogs",
        icon: "pi pi-file",

        items: [
          {
            label: "Add Blog",
            icon: "pi pi-file-plus",
            route: "/blogs/add",
          },
          {
            label: "View Blogs",
            icon: "pi pi-eye",
            route: "/blogs",
          },
        ],
      },
    ];
  }
  //Nav links for non-logged in users
  else {
    return [
      {
        label: "Home",
        icon: "pi pi-home",
        route: "/",
      },
    ];
  }
});
</script>
