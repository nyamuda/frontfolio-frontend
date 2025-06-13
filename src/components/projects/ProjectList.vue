<template>
  <div>
    <TitleSection title="Your Current Projects" subtitle="Portfolio Projects" />
    <div class="row">
      <div class="col-sm-6 col-lg-4 g-3" v-for="i in 8" :key="i">
        <ProjectItem />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TitleSection from "../shared/TitleSection.vue";
import ProjectItem from "./ProjectItem.vue";
</script>
