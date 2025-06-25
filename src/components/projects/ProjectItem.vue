<template>
  <div>
    <div class="card">
      <div class="card-body">
        <!-- Title and Status Tag -->
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-2 gap-1">
          <h5 class="card-title mb-0 text-secondary">{{ project.title }}</h5>
          <Tag
            :severity="project.status === 'published' ? 'primary' : 'secondary'"
            :value="project.status === 'published' ? 'Published' : 'Draft'"
          />
        </div>

        <!-- Difficulty and Sort Order -->
        <div
          class="d-flex flex-wrap align-items-center gap-3 mb-2 text-muted"
          style="font-size: 0.85rem"
        >
          <div class="d-flex align-items-center gap-1">
            <i class="pi pi-signal" /> {{ project.difficultyLevel }}
          </div>
          <div class="d-flex align-items-center gap-1">
            <i class="pi pi-sort-amount-down-alt" /> Order: {{ project.sortOrder }}
          </div>
        </div>

        <!-- Project Dates -->
        <div class="card-text d-flex align-items-center text-muted mb-1" style="font-size: 0.9rem">
          <i class="pi pi-calendar me-2" />
          {{ DateHelper.formatDateToMonthYear(project.startDate) }} -
          {{ DateHelper.formatDateToMonthYear(project.endDate) || "Ongoing" }}
        </div>

        <!-- Tech Stack -->
        <div class="card-text d-flex flex-wrap align-items-center gap-1 mb-3">
          <small v-for="(tech, index) in visibleTechStack" :key="index" class="text-muted">
            {{ tech }}<span v-if="index < visibleTechStack.length - 1"> · </span>
          </small>
          <span v-if="hasHiddenTechItems">...</span>
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
        :src="project.imageUrl || 'https://mdbcdn.b-cdn.net/img/new/slides/042.webp'"
        class="card-img-bottom"
        alt="Project Image"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Tag from "primevue/tag";
import Button from "primevue/button";
import { Project } from "@/models/project";
import { DateHelper } from "@/helpers/dateHelper";
import { computed, ref } from "vue";

const props = defineProps({
  project: {
    type: Project,
    required: true,
  },
});

// Maximum number of tech stack items to display
const maxVisibleTechCount = ref(5);

// Get the visible portion of the tech stack
const visibleTechStack = props.project.techStack.slice(0, maxVisibleTechCount.value);

// Determine if there are additional tech items not shown
// Used to display an ellipsis ("...") if the list is truncated
const hasHiddenTechItems = computed(() => props.project.techStack.length > visibleTechStack.length);
</script>
