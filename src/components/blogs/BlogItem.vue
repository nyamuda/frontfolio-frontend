<template>
  <div>
    <div class="card">
      <div class="card-body">
        <!-- Title and Status Tag -->
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-2 gap-1">
          <h5 class="card-title mb-0 text-secondary">{{ blog.title }}</h5>
          <Tag
            :severity="blog.status === 'published' ? 'primary' : 'secondary'"
            :value="blog.status === 'published' ? 'Published' : 'Draft'"
            rounded
          />
        </div>

        <!-- Topic and Published Date -->
        <div
          class="d-flex flex-wrap align-items-center gap-3 mb-2 text-muted"
          style="font-size: 0.85rem"
        >
          <div class="d-flex align-items-center gap-1 text-capitalize">
            <i class="pi pi-tag text-primary" /> {{ blog.topic || "Uncategorized" }}
          </div>
          <div class="d-flex align-items-center gap-1" v-if="blog.publishedAt">
            <i class="pi pi-calendar text-primary" />
            {{ DateHelper.formatDateToDayMonthYear(blog.publishedAt) }}
          </div>
        </div>

        <!-- Tags -->
        <div class="card-text d-flex flex-wrap align-items-center gap-1 mb-3">
          <small v-for="(tag, index) in visibleTags" :key="index" class="text-muted">
            #{{ tag }}<span v-if="index < visibleTags.length - 1"> · </span>
          </small>
          <span v-if="hasHiddenTags">...</span>
        </div>

        <!-- Action Button -->
        <div>
          <router-link :to="'/blogs/' + blog.id + '/edit'">
            <Button label="Read more" severity="contrast" size="small" />
          </router-link>
        </div>
      </div>

      <!-- Cover Image -->
      <img
        :src="blog.imageUrl || 'https://mdbcdn.b-cdn.net/img/new/slides/042.webp'"
        class="card-img-bottom"
        alt="Blog Cover"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Tag from "primevue/tag";
import Button from "primevue/button";
import { Blog } from "@/models/blog";
import { DateHelper } from "@/helpers/dateHelper";
import { computed, ref } from "vue";

const props = defineProps({
  blog: {
    type: Blog,
    required: true,
  },
});

// Limit how many tags are shown before ellipsis
const maxVisibleTagCount = ref(5);
// Get the visible portion of the tags
const visibleTags = props.blog.tags.slice(0, maxVisibleTagCount.value);

// Used to display an ellipsis ("...") if the list is truncated
const hasHiddenTags = computed(() => props.blog.tags.length > visibleTags.length);
</script>
