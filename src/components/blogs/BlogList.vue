<template>
  <div>
    <TitleSection title="Work in Progress" subtitle="Portfolio Blogs" />

    <div class="row">
      <p class="col-md-6">
        Here’s everything you’ve added so far. You can continue refining your drafts, publish new
        ones, or revisit existing blogs to keep your portfolio fresh and up to date
      </p>
    </div>
    <div class="d-flex justify-content-end gap-3 mb-3">
      <!-- Sort blogs input -->
      <SelectItemInput
        :options="sortOptions"
        :callback-on-change="sortBlogs"
        placeholder-text="Sort by"
      />
      <!-- Filter blogs input -->
      <SelectItemInput
        :options="filterOptions"
        :callback-on-change="filterBlogs"
        placeholder-text="Status"
      />
      <!-- Add new blog button -->
      <router-link to="/blogs/add">
        <Button
          icon="pi pi-plus"
          label="New blog"
          severity="primary"
          aria-label="Add new blog"
          size="small"
        />
      </router-link>
    </div>
    <!-- Skeleton list start -->
    <div v-if="isGettingBlogs" class="row">
      <div class="col-md-6 col-lg-4 g-3" v-for="i in 8" :key="i">
        <BlogItemSkeleton />
      </div>
    </div>
    <!-- Skeleton list end -->
    <!-- Blog list start -->
    <div v-else>
      <div v-if="blogStore.pageInfo.items.length > 0">
        <!-- Blog list -->
        <div class="row">
          <div
            class="col-md-6 col-lg-4 g-3"
            v-for="blog in blogStore.pageInfo.items"
            :key="blog.id"
          >
            <BlogItem :blog="blog" />
          </div>
        </div>
        <!-- Load more button -->
        <div class="d-flex justify-content-center mt-4">
          <LoadMoreItemsButton
            label="Load more blogs"
            :end-label="endOfListMessage"
            :is-loading="isLoadingMoreBlogs"
            :has-more="blogStore.pageInfo.hasMore"
            :is-disabled="
              isGettingBlogs || isLoadingMoreBlogs || !blogStore.pageInfo.hasMore
            "
            :onClick="loadMoreBlogs"
            end-variant="text"
            variant="outlined"
          />
        </div>
      </div>
      <!-- Blog list empty -->
      <div v-else>
        <EmptyList
          :title="noBlogsMessage.title"
          :message="noBlogsMessage.message"
          icon-type="pi pi-folder-open"
        />
      </div>
    </div>
    <!-- Blog list end -->
  </div>
</template>

<script setup lang="ts">
import TitleSection from "../shared/TitleSection.vue";
import BlogItem from "./BlogItem.vue";
import Button from "primevue/button";
import LoadMoreItemsButton from "../shared/LoadMoreItemsButton.vue";
import { useBlogStore } from "@/stores/blog";
import { useToast } from "primevue/usetoast";
import { computed, onMounted, ref, type Ref } from "vue";
import BlogItemSkeleton from "./skeletons/BlogItemSkeleton.vue";
import EmptyList from "../shared/EmptyList.vue";
import { BlogSortOption } from "@/enums/blogSortOption";
import { BlogStatusFilter } from "@/enums/blogStatusFilter";
import SelectItemInput from "../shared/SelectItemInput.vue";
const blogStore = useBlogStore();
const toast = useToast();

const isGettingBlogs = ref(false);
const isLoadingMoreBlogs = ref(false);

onMounted(() => {
  getBlogs();
});

//Message to display if there are no blogs to display (blog list is empty)
//based on the current applied status filter
const noBlogsMessage: Ref<{ title: string; message: string }> = computed(() => {
  switch (blogStore.statusFilter) {
    case BlogStatusFilter.Published:
      return {
        title: "No Published Blogs",
        message:
          "No published blogs found. Make sure to mark your blogs as 'Published' once they're ready to be shared.",
      };
    case BlogStatusFilter.Draft:
      return {
        title: "No Drafts Available",
        message: "You don’t have any draft blogs saved. ",
      };
    default:
      return {
        title: "No Blogs Yet",
        message: "No blogs found. Create a new one to showcase your work.",
      };
  }
});
//Message to display if the is user has reached the end of the list of blogs
//based on the current applied status filter
const endOfListMessage = computed(() => {
  switch (blogStore.statusFilter) {
    case BlogStatusFilter.Published:
      return "You've reached the end of the published blogs";
    case BlogStatusFilter.Draft:
      return "No more draft blogs to show";
    default:
      return "You’ve reached the end of the list";
  }
});
const sortOptions = ref(["Title", "Date Published"]);
const filterOptions = ref([
  BlogStatusFilter.All,
  BlogStatusFilter.Draft,
  BlogStatusFilter.Published,
]);

const sortBlogs = (selectedSortOption: string) => {
  //reset the current page to 1
  //to start from the beginning of the sorted list
  blogStore.pageInfo.page = 1;

  //save the selected option as its corresponding enum value
  switch (selectedSortOption) {
    case "Title":
      blogStore.sortBy = BlogSortOption.Title;
      break;
    default:
      blogStore.sortBy = BlogSortOption.PublishedAt;
  }
  //get the sort list of blogs
  getBlogs();
};

const filterBlogs = (selectedFilterOption: BlogStatusFilter) => {
  blogStore.statusFilter = selectedFilterOption;
  getBlogs();
};

//get blogs
const getBlogs = () => {
  isGettingBlogs.value = true;
  blogStore
    .getBlogs()
    .then(() => {})
    .catch((message) => {
      toast.add({
        severity: "error",
        summary: "Failed to Fetch Blogs",
        detail: message,
        life: 10000,
      });
    })
    .finally(() => {
      isGettingBlogs.value = false;
    });
};

//load more blogs
const loadMoreBlogs = () => {
  isLoadingMoreBlogs.value = true;
  //move the next pagination page
  blogStore.pageInfo.page = blogStore.pageInfo.page + 1;
  blogStore
    .loadMoreBlogs()
    .then(() => {})
    .catch((message) => {
      toast.add({
        severity: "error",
        summary: "Unable to Load More Blogs",
        detail: message,
        life: 10000,
      });
    })
    .finally(() => {
      isLoadingMoreBlogs.value = false;
    });
};
</script>
