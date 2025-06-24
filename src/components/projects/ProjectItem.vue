<template>
  <div>
    <div class="card">
      <div class="card-body">
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-1 gap-1">
          <h5 class="card-title mb-0 text-secondary">{{ project.title }}</h5>
          <Tag
            :severity="project.status == 'published' ? 'primary' : 'secondary'"
            :value="project.status == 'published' ? 'Primary' : 'Draft'"
          ></Tag>
        </div>
        <p class="card-text">
          {{ project.summary }}
        </p>
        <div class="">
          <Button label="View more" severity="contrast" size="small" />
        </div>
      </div>
      <img
        src="https://mdbcdn.b-cdn.net/img/new/slides/042.webp"
        class="card-img-bottom"
        alt="Camera"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Tag from "primevue/tag";
import Button from "primevue/button";
import { Project } from "@/models/project";

defineProps({
  project: {
    type: Project,
    required: true,
  },
});
</script>
