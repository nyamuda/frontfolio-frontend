<template>
  <div>
    <TitleSection title="Work in Progress" subtitle="Portfolio Projects" />

    <div class="row">
      <p class="col-md-6">
        Here’s a quick overview of your portfolio projects. You can view details, update content, or
        publish drafts anytime.
      </p>
    </div>
    <div class="row">
      <div class="col-sm-6 col-lg-4 g-3" v-for="i in 8" :key="i">
        <ProjectItem />
      </div>
    </div>
    <ProjectItemSkeleton />
  </div>
</template>

<script setup lang="ts">
import TitleSection from "../shared/TitleSection.vue";
import ProjectItem from "./ProjectItem.vue";
import ProjectItemSkeleton from "./skeletons/ProjectItemSkeleton.vue";
</script>
