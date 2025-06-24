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

        <!-- Project Duration -->
        <!-- Project Dates -->
        <div class="card-text d-flex align-items-center text-muted mb-1" style="font-size: 0.9rem">
          <i class="pi pi-calendar me-2" />
          {{ project.startDate }} - {{ project.endDate || "Ongoing" }}
        </div>

        <!-- Tech Stack -->
        <div class="card-text d-flex flex-wrap align-items-center gap-1 mb-3">
          <small
            v-for="(tech, index) in project.techStack.slice(0, 5)"
            :key="index"
            class="text-muted"
          >
            {{ tech }}<span v-if="index < project.techStack.slice(0, 5).length - 1"> · </span>
          </small>
        </div>

        <!-- Action Button -->
        <div>
          <router-link :to="'/projects/' + project.id + '/edit'">
            <Button label="View more" severity="contrast" size="small" />
          </router-link>
        </div>
      </div>

      <!-- Image -->
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
