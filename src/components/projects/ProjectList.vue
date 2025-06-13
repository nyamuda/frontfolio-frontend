<template>
  <div>
    <div class="row">
      <div class="col-sm-6 col-lg-4 g-3" v-for="i in 8" :key="i">
        <ProjectItem />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProjectItem from "./ProjectItem.vue";
</script>
