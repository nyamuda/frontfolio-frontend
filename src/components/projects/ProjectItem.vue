<template>
  <div>
    <div class="card">
      <div class="card-body">
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-1 gap-1">
          <h5 class="card-title mb-0 text-secondary">{{ project.title }}</h5>
          <Tag
            :severity="project.status == 'published' ? 'primary' : 'secondary'"
            :value="project.status == 'published' ? 'Published' : 'Draft'"
          ></Tag>
        </div>
        <div class="card-text d-flex flex-column align-items-start">
          <span><i class="pi pi-clock" style="font-size: 1rem"></i></span>
        </div>
        <div class="">
          <router-link :to="'/projects/' + project.id + '/edit'"
            ><Button label="View more" severity="contrast" size="small"
          /></router-link>
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
