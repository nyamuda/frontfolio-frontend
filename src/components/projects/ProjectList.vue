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
    <div class="row">
      <div class="col-sm-6 col-lg-4 g-3" v-for="i in 8" :key="i">
        <ProjectItem />
      </div>
    </div>
    <div class="m-auto">
      <LoadMoreItemsButton
        label="Load more projects"
        end-label="These are all your projects"
        :is-loading="isGettingProjects"
        :has-more="projectStore.pageInfo.hasMore"
        :is-disabled="isGettingProjects"
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
import { ref } from "vue";

const projectStore = useProjectStore();
const toast = useToast();

const isGettingProjects = ref(false);
const isLoadingMoreProjects =ref(false);
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
</script>
