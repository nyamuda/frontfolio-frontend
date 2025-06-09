<template>
  <div class="d-flex flex-column min-vh-100">
    <NavBarItem />
    <div class="flex-grow-1">
      <RouterView />
    </div>
  </div>
  <Toast position="top-center" />
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import NavBarItem from "./components/layout/NavBarItem.vue";
import Toast from "primevue/toast";
import { useAuthStore } from "./stores/auth";
import { onMounted } from "vue";

const authStore = useAuthStore();

//authenticate the user when the app starts
onMounted(() => {
  authStore.authenticateUser();
});
</script>
