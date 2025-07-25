<template>
  <div>
    <TitleSection title="Work in Progress" subtitle="Portfolio Projects" />

    <div class="row">
      <p class="col-md-6">
        Here’s everything you’ve added so far. You can continue refining your drafts, publish new
        ones, or revisit existing projects to keep your portfolio fresh and up to date
      </p>
    </div>
    <div class="d-flex justify-content-end gap-3 mb-3">
      <!-- Sort projects input -->
      <SelectItemInput
        :options="sortOptions"
        :callback-on-change="sortProjects"
        placeholder-text="Sort by"
      />
      <!-- Filter projects input -->
      <SelectItemInput
        :options="filterOptions"
        :callback-on-change="filterProjects"
        placeholder-text="Status"
      />
      <!-- Add new project button -->
      <router-link to="/projects/add">
        <Button
          icon="pi pi-plus"
          label="New project"
          severity="primary"
          aria-label="Add new project"
          size="small"
        />
      </router-link>
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
        <div class="d-flex justify-content-center mt-4">
          <LoadMoreItemsButton
            label="Load more projects"
            :end-label="endOfListMessage"
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
          :title="noProjectsMessage.title"
          :message="noProjectsMessage.message"
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
import { computed, onMounted, ref, type Ref } from "vue";
import ProjectItemSkeleton from "./skeletons/ProjectItemSkeleton.vue";
import EmptyList from "../shared/EmptyList.vue";
import { ProjectSortOption } from "@/enums/projectSortOption";
import { ProjectStatusFilter } from "@/enums/projectStatusFilter";
import SelectItemInput from "../shared/SelectItemInput.vue";
const projectStore = useProjectStore();
const toast = useToast();

const isGettingProjects = ref(false);
const isLoadingMoreProjects = ref(false);

onMounted(() => {
  getProjects();
});

//Message to display if there are no projects to display (project list is empty)
//based on the current applied status filter
const noProjectsMessage: Ref<{ title: string; message: string }> = computed(() => {
  switch (projectStore.statusFilter) {
    case ProjectStatusFilter.Published:
      return {
        title: "No Published Projects",
        message:
          "No published projects found. Make sure to mark your projects as 'Published' once they're ready to be shared.",
      };
    case ProjectStatusFilter.Draft:
      return {
        title: "No Drafts Available",
        message: "You don’t have any draft projects saved. ",
      };
    default:
      return {
        title: "No Projects Yet",
        message: "No projects found. Create a new one to showcase your work.",
      };
  }
});
//Message to display if the is user has reached the end of the list of projects
//based on the current applied status filter
const endOfListMessage = computed(() => {
  switch (projectStore.statusFilter) {
    case ProjectStatusFilter.Published:
      return "You've reached the end of the published projects";
    case ProjectStatusFilter.Draft:
      return "No more draft projects to show";
    default:
      return "You’ve reached the end of the list";
  }
});
const sortOptions = ref(["Title", "Difficulty level", "Sort order"]);
const filterOptions = ref([
  ProjectStatusFilter.All,
  ProjectStatusFilter.Draft,
  ProjectStatusFilter.Published,
]);

const sortProjects = (selectedSortOption: string) => {
  //reset the current page to 1
  //to start from the beginning of the sorted list
  projectStore.pageInfo.page = 1;

  //save the selected option as its corresponding enum value
  switch (selectedSortOption) {
    case "Title":
      projectStore.sortBy = ProjectSortOption.Title;
      break;
    case "Difficulty level":
      projectStore.sortBy = ProjectSortOption.DifficultyLevel;
      break;
    default:
      projectStore.sortBy = ProjectSortOption.SortOrder;
  }
  //get the sort list of projects
  getProjects();
};

const filterProjects = (selectedFilterOption: ProjectStatusFilter) => {
  projectStore.statusFilter = selectedFilterOption;
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
        summary: "Failed to Fetch Projects",
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
        summary: "Unable to Load More Projects",
        detail: message,
        life: 10000,
      });
    })
    .finally(() => {
      isLoadingMoreProjects.value = false;
    });
};
</script>
