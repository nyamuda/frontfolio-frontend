<template>
  <div class="d-flex flex-column min-vh-100">
    <NavBarItem />
    <div class="flex-grow-1">
      <RouterView />
    </div>
  </div>
  <Toast />
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import NavBarItem from "./components/layout/NavBarItem.vue";
import Toast from "primevue/toast";
</script>

<style scoped></style>
