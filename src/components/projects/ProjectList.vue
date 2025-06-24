<template>
  <div>
    <TitleSection title="Work in Progress" subtitle="Portfolio Projects" />

    <div class="row">
      <p class="col-md-6">
        Here’s everything you’ve added so far. You can continue refining your drafts, publish new
        ones, or revisit existing projects to keep your portfolio fresh and up to date
      </p>
    </div>
    <div class="d-flex justify-content-end mb-3">
      <router-link to="/projects/add">
        <Button
          icon="pi pi-plus"
          label="New project"
          severity="contrast"
          aria-label="Add new project"
          size="small"
        />
      </router-link>
    </div>
    <!-- Skeleton list start -->
    <div v-if="isGettingProjects" class="row mb-3">
      <div class="col-sm-6 col-lg-4 g-3" v-for="i in 8" :key="i">
        <ProjectItemSkeleton />
      </div>
    </div>
    <!-- Skeleton list end -->
    <!-- Project list start -->
    <div v-else class="row mb-3">
      <div
        class="col-sm-6 col-lg-4 g-3"
        v-for="project in projectStore.pageInfo.items"
        :key="project.id"
      >
        <ProjectItem :project="project" />
      </div>
    </div>
    <!-- Project list end -->
    <div class="d-flex justify-content-center mt-5">
      <LoadMoreItemsButton
        label="Load more projects"
        end-label="These are all your projects"
        :is-loading="isGettingProjects"
        :has-more="projectStore.pageInfo.hasMore"
        :is-disabled="isGettingProjects || isLoadingMoreProjects || !projectStore.pageInfo.hasMore"
        :onClick="loadMoreProjects"
        end-variant="text"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import TitleSection from "../shared/TitleSection.vue";
import ProjectItem from "./ProjectItem.vue";
import Button from "primevue/button";
import LoadMoreItemsButton from "../shared/LoadMoreItemsButton.vue";
import { useProjectStore } from "@/stores/project";
import { useToast } from "primevue/usetoast";
import { onMounted, ref } from "vue";
import ProjectItemSkeleton from "./skeletons/ProjectItemSkeleton.vue";

const projectStore = useProjectStore();
const toast = useToast();

const isGettingProjects = ref(false);
const isLoadingMoreProjects = ref(false);

onMounted(() => {
  getProjects();
});

//get projects
const getProjects = () => {
  isGettingProjects.value = true;
  projectStore
    .getProjects()
    .then(() => {})
    .catch((message) => {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: message,
        life: 10000,
      });
    })
    .finally(() => {
      isGettingProjects.value = false;
    });
};

//load more projects
const loadMoreProjects = () => {
  isLoadingMoreProjects.value = true;
  //move the next pagination page
  projectStore.pageInfo.page = projectStore.pageInfo.page + 1;
  projectStore
    .getProjects()
    .then(() => {})
    .catch((message) => {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: message,
        life: 10000,
      });
    })
    .finally(() => {
      isLoadingMoreProjects.value = false;
    });
};
</script>
