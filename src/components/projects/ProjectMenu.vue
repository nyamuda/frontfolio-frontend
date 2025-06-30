<template>
  <div>
    <Button
      icon="pi pi-ellipsis-v"
      severity="contrast"
      @click="toggle"
      aria-haspopup="true"
      aria-controls="overlay_menu"
      size="small"
    />
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Button from "primevue/button";
import Menu from "primevue/menu";

const menu = ref();
const items = ref([
  {
    label: "Options",
    items: [
      {
        label: "Refresh",
        icon: "pi pi-refresh",
      },
      {
        label: "Export",
        icon: "pi pi-upload",
      },
    ],
  },
]);

const toggle = (event: MouseEvent) => {
  menu.value.toggle(event);
};
</script>
