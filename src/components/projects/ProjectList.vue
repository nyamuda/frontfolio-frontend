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
          severity="primary"
          aria-label="Add new project"
          size="small"
        />
      </router-link>


      <!-- Filter select input start -->
      <div
        class="d-flex justify-content-start justify-content-md-end align-items-center gap-3 flex-wrap mb-3"
      >
        <div class="flex-grow-1 flex-md-grow-0">
          <!-- For desktop screens -->
          <Select
            style="width: 12rem"
            class="d-none d-md-flex"
            placeholder="Sort by"
            checkmark
            v-model="selectedFilterOption"
            :options="filterOptions"
            @change="filterProjects"
          />

          <!-- For mobile screens -->
          <Select
            class="w-100 d-md-none"
            placeholder="Sort by"
            checkmark
            v-model="selectedFilterOption"
            :options="filterOptions"
            @change="filterProjects"
          />
        </div>
      </div>
      <!-- Filter select input end -->
    </div>
    <!-- Skeleton list start -->
    <div v-if="isGettingProjects" class="row">
      <div class="col-md-6 col-lg-4 g-3" v-for="i in 8" :key="i">
        <ProjectItemSkeleton />
      </div>
    </div>
    <!-- Skeleton list end -->
    <!-- Project list start -->
    <div v-else>
      <div v-if="projectStore.pageInfo.items.length > 0">
        <!-- Project list -->
        <div class="row">
          <div
            class="col-md-6 col-lg-4 g-3"
            v-for="project in projectStore.pageInfo.items"
            :key="project.id"
          >
            <ProjectItem :project="project" />
          </div>
        </div>
        <!-- Load more button -->
        <div class="d-flex justify-content-center mt-5">
          <LoadMoreItemsButton
            label="Load more projects"
            end-label="These are all your projects"
            :is-loading="isLoadingMoreProjects"
            :has-more="projectStore.pageInfo.hasMore"
            :is-disabled="
              isGettingProjects || isLoadingMoreProjects || !projectStore.pageInfo.hasMore
            "
            :onClick="loadMoreProjects"
            end-variant="text"
            variant="outlined"
          />
        </div>
      </div>
      <!-- Project list empty -->
      <div v-else>
        <EmptyList
          title="No projects yet"
          message="Ready to get started? Use the button above to create your first project."
          icon-type="pi pi-folder-open"
        />
      </div>
    </div>
    <!-- Project list end -->
  </div>
</template>

<script setup lang="ts">
import TitleSection from "../shared/TitleSection.vue";
import ProjectItem from "./ProjectItem.vue";
import Button from "primevue/button";
import LoadMoreItemsButton from "../shared/LoadMoreItemsButton.vue";
import { useProjectStore } from "@/stores/project";
import { useToast } from "primevue/usetoast";
import { onMounted, ref, type Ref } from "vue";
import ProjectItemSkeleton from "./skeletons/ProjectItemSkeleton.vue";
import EmptyList from "../shared/EmptyList.vue";
import { ProjectSortOption } from "@/enums/projectSortOption";
import Select from "primevue/select";
import { ProjectFilterOption } from "@/enums/projectFilterOption";

const projectStore = useProjectStore();
const toast = useToast();

const isGettingProjects = ref(false);
const isLoadingMoreProjects = ref(false);

onMounted(() => {
  getProjects();
});

const selectedSortOption: Ref<string> = ref("");
const selectedFilterOption: Ref<ProjectFilterOption> = ref(ProjectFilterOption.All);
const sortOptions = ref(["Title", "Difficulty level", "Sort order"]);
const filterOptions = ref([
  ProjectFilterOption.All,
  ProjectFilterOption.Draft,
  ProjectFilterOption.Published,
]);

const sortProjects = () => {
  //reset the current page to 1
  //to start from the beginning of the sorted list
  projectStore.pageInfo.page = 1;

  //convert the selected option to its corresponding enum value
  switch (selectedSortOption.value) {
    case "Title":
      projectStore.sortBy = ProjectSortOption.Title;
      alert(projectStore.sortBy);
      break;
    case "Difficulty level":
      projectStore.sortBy = ProjectSortOption.DifficultyLevel;
      alert(projectStore.sortBy);
      break;
    default:
      projectStore.sortBy = ProjectSortOption.SortOrder;
  }
  //get the sort list of projects
  getProjects();
};

const filterProjects = () => {
  projectStore.status = selectedFilterOption.value;
  getProjects();
};

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
    .loadMoreProjects()
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
