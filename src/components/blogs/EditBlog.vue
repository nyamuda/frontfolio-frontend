<template>
  <div>
    <!-- Title and description start -->
    <TitleSection title="Update your blog content" subtitle="Blog Editor" />
    <div class="row mb-2">
      <div class="col-md-6">
        <p>
          Feel free to continue working on your blog post. Changes will be saved automatically as
          you go. If the post is already published, any updates you make will be visible on your
          public blog right away. You can also choose to save manually whenever needed.
        </p>
      </div>
    </div>
    <!-- Title and description end -->

    <!-- Loader -->
    <div v-if="isLoadingBlog && displayLoadingSpinner" class="mb-5">
      <ProgressBar mode="indeterminate" style="height: 6px"></ProgressBar>
    </div>
    <!-- Buttons start-->
    <div v-else>
      <div v-if="!isPlaceholderBlog" class="d-flex flex-column align-items-end mb-5 gap-4">
        <div class="d-flex justify-content-end gap-3 align-items-center flex-wrap">
          <!-- Form error message -->
          <Message
            v-if="hasInvalidSubForms || v$.$error"
            icon="pi pi-times-circle"
            severity="error"
            variant="simple"
            size="small"
            >{{ invalidFormMessage }}</Message
          >
          <!-- Save changes button -->
          <Button
            v-else
            :icon="
              isPublishingBlog || isSavingBlog
                ? 'pi pi-spin pi-spinner-dotted'
                : !hasUnsavedChanges && !isInitialLoad
                  ? 'pi pi pi-check-circle'
                  : hasUnsavedChanges
                    ? 'pi pi-save'
                    : 'pi pi-pencil'
            "
            :label="
              isSavingBlog
                ? 'Saving changes...'
                : isPublishingBlog
                  ? 'Publishing blog...'
                  : !hasUnsavedChanges && !isInitialLoad
                    ? 'Last saved ' + dayjs.utc(blog.updatedAt).local().fromNow()
                    : hasUnsavedChanges
                      ? 'Save changes'
                      : 'No changes yet'
            "
            severity="contrast"
            @click="saveBlog"
            size="small"
            :disabled="
              isPublishingBlog ||
              isDeletingBlog ||
              isSavingBlog ||
              v$.$errors.length > 0 ||
              hasInvalidSubForms ||
              !hasUnsavedChanges
            "
            :variant="!hasUnsavedChanges && !isInitialLoad ? 'text' : ''"
          />
          <!-- Publish blog button -->
          <Button
            v-if="blog.status != BlogStatus.Published"
            @click="publishBlog"
            label="Publish blog"
            size="small"
            :disabled="
              isPublishingBlog ||
              isSavingBlog ||
              v$.$errors.length > 0 ||
              hasInvalidSubForms ||
              isDeletingBlog ||
              hasUnsavedChanges
            "
          />
          <!-- Turn auto save on/off -->
          <div
            class="d-flex align-items-center gap-1 text-secondary"
            style="font-size: 0.9rem; margin-top: 0.2rem"
          >
            AutoSave
            <ToggleSwitch
              @value-change="onChangeAutoSave"
              :modelValue="isAutoSaveEnabled"
              :disabled="isPublishingBlog || isSavingBlog || isDeletingBlog"
            >
            </ToggleSwitch>
          </div>
        </div>
        <!-- Delete blog button -->
        <ConfirmDeleteButton
          title="Delete Blog"
          message="Are you sure you want to delete this blog?"
          :delete-callback="deleteBlog"
          button-accept-label="Yes, delete it"
          :is-deleting="isDeletingBlog"
          :isDisabled="isPublishingBlog || isSavingBlog"
        />
      </div>
    </div>
    <!--Buttons end-->
    <form class="">
      <!-- Blog main details start -->
      <Panel class="mb-3" toggleable>
        <template #header>
          <div class="d-flex justify-content-start align-items-center gap-1 fw-bold text-secondary">
            <i class="pi pi-tags mt-1" style="font-size: 1.2rem"></i>
            <span class="fs-4">Main Info</span>
          </div>
        </template>
        <!-- Title input -->
        <div class="form-group mb-3">
          <FloatLabel variant="on">
            <InputText fluid id="title" v-model="v$.title.$model" :invalid="v$.title.$error" />
            <label for="title">Title</label>
          </FloatLabel>
          <Message size="small" severity="error" v-if="v$.title.$error" variant="simple">
            <div v-for="error of v$.title.$errors" :key="error.$uid">
              <div>{{ error.$message }}</div>
            </div>
          </Message>
        </div>
        <!-- Topic input -->
        <div class="form-group mb-3">
          <FloatLabel variant="on">
            <InputText fluid id="topic" v-model="v$.topic.$model" :invalid="v$.topic.$error" />
            <label for="topic">Title</label>
          </FloatLabel>
          <Message size="small" severity="error" v-if="v$.topic.$error" variant="simple">
            <div v-for="error of v$.topic.$errors" :key="error.$uid">
              <div>{{ error.$message }}</div>
            </div>
          </Message>
        </div>

        <!-- Summary input -->
        <div class="form-group mb-3">
          <FloatLabel variant="on">
            <Textarea
              id="summary"
              v-model="v$.summary.$model"
              :invalid="v$.summary.$error"
              rows="4"
              class="w-100"
              style="resize: none"
            />
            <label for="summary">Summary</label>
          </FloatLabel>
          <Message size="summary" severity="error" v-if="v$.summary.$error" variant="simple">
            <div v-for="error of v$.summary.$errors" :key="error.$uid">
              <div>{{ error.$message }}</div>
            </div>
          </Message>
        </div>

        <!-- Image URL-->

        <!-- Image URL -->
        <div class="form-group mb-3">
          <FloatLabel variant="on">
            <IconField>
              <InputIcon class="pi pi-image" />
              <InputText
                fluid
                id="imageUrl"
                v-model="v$.imageUrl.$model"
                :invalid="v$.imageUrl.$error"
                type="url"
              />
            </IconField>
            <label for="imageUrl">Image URL</label>
          </FloatLabel>
          <Message size="small" severity="error" v-if="v$.imageUrl.$error" variant="simple">
            <div v-for="error of v$.imageUrl.$errors" :key="error.$uid">
              <div>{{ error.$message }}</div>
            </div>
          </Message>
        </div>

        <!-- Tags input -->
        <div>
          <FloatLabel variant="on">
            <AutoComplete
              v-model="v$.tags.$model"
              :invalid="v$.tags.$error"
              inputId="addBlogTags"
              multiple
              fluid
              :typeahead="false"
            />
            <label for="addBlogTags">Tags</label>
          </FloatLabel>
          <Message size="small" severity="error" v-if="v$.tags.$error" variant="simple">
            <div v-for="error of v$.tags.$errors" :key="error.$uid">
              <div>{{ error.$message }}</div>
            </div>
          </Message>
        </div>
      </Panel>
      <!-- Blog main details end -->
      <!-- Blog background paragraphs start  -->
      <Panel id="edit-blog-paragraphs" class="mb-3" toggleable :collapsed="true">
        <template #header>
          <div class="d-flex justify-content-start align-items-center gap-1 fw-bold text-secondary">
            <i class="pi pi-file-edit mt-1" style="font-size: 1.2rem"></i>
            <span class="fs-4">Content</span>
          </div>
        </template>
        <p class="mb-3">
          Write the detailed content of your blog here. Use multiple paragraphs to explain concepts,
          tell your story, and provide meaningful value to your readers.
        </p>

        <ParagraphListEditor
          :paragraphType="ParagraphType.BlogSection"
          @paragraphs="(paragraphs: Paragraph[]) => (blog.content = paragraphs)"
          @SkipAutoSave="(val) => (skipAutoSaveForContentParagraphs = val)"
          @has-invalid-paragraphs="
            (isAnyInvalid: boolean) => (hasInvalidContentForms = isAnyInvalid)
          "
          :crudContext="CrudContext.Update"
          ref="paragraphListEditorRef"
          :fallback-container-id="'edit-blog-paragraphs'"
        />
      </Panel>
      <!-- Blog background paragraphs end  -->
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, type Ref } from "vue";
import { useBlogStore } from "@/stores/blog";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers, url } from "@vuelidate/validators";
import { Message } from "primevue";
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import Button from "primevue/button";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import TitleSection from "../shared/TitleSection.vue";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import Panel from "primevue/panel";
import Textarea from "primevue/textarea";
import AutoComplete from "primevue/autocomplete";
import { Blog } from "@/models/blog";
import ParagraphListEditor from "../paragraphs/ParagraphListEditor.vue";
import type { Paragraph } from "@/models/paragraph";
import { BlogStatus } from "@/enums/blogStatus";
import ProgressBar from "primevue/progressbar";
import debounce from "lodash.debounce";
import { ParagraphType } from "@/enums/paragraphType";
import { CrudContext } from "@/enums/crudContext";
import dayjs from "dayjs";
import { BlogHelper } from "@/helpers/blogHelper";
import ToggleSwitch from "primevue/toggleswitch";
import ConfirmDeleteButton from "../shared/ConfirmDeleteButton.vue";

// Access the store
const blogStore = useBlogStore();
const toast = useToast();
const router = useRouter();

onMounted(async () => {
  //start from the top of the page
  window.scrollTo(0, 0);
  //show form validation errors
  v$.value.$touch();
  //get blog ID from URL params
  const blogId = router.currentRoute.value.params["id"];
  //fetching blog with given ID
  if (blogId) {
    getBlogById(Number(blogId));
  }
  //get autosave setting from local storage
  const autoSaveSetting = localStorage.getItem("isBlogAutoSaveEnabled");
  isAutoSaveEnabled.value = autoSaveSetting ? JSON.parse(autoSaveSetting) : true;
});

// The blog being edited
const blog: Ref<Blog> = ref(new Blog());
const paragraphListEditorRef = ref();

// Determines if the blog is a placeholder, typically used
// when no valid blog was loaded indicating failed fetch
const isPlaceholderBlog = computed(() => blog.value?.id === 0);

// Track whether any content paragraph form is invalid
const hasInvalidContentForms: Ref<boolean> = ref(false);

// Check whether any of the blog’s sub-sections (e.g. background, challenges,
// achievements, or feedback) contain invalid forms. Returns true if at least one
// sub-form is invalid
const hasInvalidSubForms = computed(() => hasInvalidContentForms.value);
// Check the validity of the entire form
const isEntireFormInvalid = async (): Promise<boolean> => {
  // Validate the main form fields
  const areMainFieldsValid = await v$.value.$validate();
  // Return true if any section (main or sub-forms) is invalid
  return !areMainFieldsValid || hasInvalidSubForms.value;
};
const invalidFormMessage = ref(
  "Some fields are missing or invalid. Please fix them to save your changes.",
);

const isSavingBlog = ref(false);
const isDeletingBlog = ref(false);
const isPublishingBlog = ref(false);
//Show loading blog loader or not
const isLoadingBlog = ref(false);
// Whether to show the loading spinner (e.g. during autosave or fetch)
const displayLoadingSpinner = ref(true);
// Tracks whether the blog was saved automatically (via auto-save) or manually by the user.
// This is used to decide whether a toast notification should be shown.
// If the blog was saved automatically, no toast is displayed.
const isAutoSaved = ref(true);
// Controls whether autosave is enabled
const isAutoSaveEnabled = ref(true);
// This flag is set to true when the status of the blog
// is set to 'Published' programmatically after a successful publish.
// It prevents the watcher from treating the change as user input and triggering save-related behavior.
// Hence, it ensures the UI doesn’t treat the change as unsaved work.
const ignorePublishedStatusChange = ref(false);
// Flag to temporarily suppress auto-saving when background paragraphs are modified.
// Used to avoid triggering an unnecessary save when changes are already handled elsewhere (e.g., on delete).
const skipAutoSaveForContentParagraphs = ref(false);

/**
 * Determines whether autosave should be skipped based on the provided flag.
 *
 * This method is used to temporarily disable autosave for specific sections
 * (e.g. background paragraphs, challenges, achievements) during updates
 * such as deleting a paragraph, challenge etc which is handled in the component itself.
 *
 * If the `skipAutosaveRef` is true:
 * - Autosave will be skipped.
 * - `hasUnsavedChanges` will be set to false, indicating that no user-driven changes need saving.
 * - The flag will be reset to false to allow autosave on future edits.
 *
 * @param skipAutosaveRef - A reactive ref boolean that controls whether autosave should be skipped for a section.
 * @returns `true` if autosave should be skipped and was reset; `false` otherwise.
 */
const checkAndResetAutoSaveSkip = (skipAutosaveRef: Ref<boolean>): boolean => {
  if (skipAutosaveRef.value) {
    hasUnsavedChanges.value = false;
    skipAutosaveRef.value = false;
    return true;
  }
  return false;
};

// Toggle autosave setting and persist it in localStorage
const onChangeAutoSave = () => {
  isAutoSaveEnabled.value = !isAutoSaveEnabled.value;
  //save setting to local storage
  localStorage.setItem("isBlogAutoSaveEnabled", JSON.stringify(isAutoSaveEnabled.value));
  //if autosave is disabled, cancel a pending auto-save if there is already one in progress
  if (!isAutoSaveEnabled.value) {
    debouncedSubmitBlog.cancel();
  }
};

// Tracks whether the user has made any changes to the blog since the last save.
// This is used to enable or disable the "Save Changes" button and prevent unnecessary saves.
const hasUnsavedChanges = ref(false);

//Form validation start
const rules = {
  title: { required },
  topic: { required },
  summary: { required },
  imageUrl: { url },
  tags: {
    required: helpers.withMessage("You need to include at least one tag", required),
  },
};
const v$ = useVuelidate(rules, blog);
//Form validation end

//Fetch a blog with a given ID
const getBlogById = (id: number) => {
  isLoadingBlog.value = true;
  blogStore
    .getBlogById(id)
    .then((data) => {
      isInitialLoad.value = true;
      blog.value = data;
      //initialize the content paragraphs
      paragraphListEditorRef.value?.initializeParagraphs(data.content);
    })
    .catch((message) => {
      // Show error toast if the blog fetching fails
      toast.add({
        severity: "error",
        summary: "Failed to Fetch Blog Details",
        detail: message,
        life: 10000,
      });
    })
    .finally(() => (isLoadingBlog.value = false));
};

//save the blog changes if it was already published
const saveBlog = async () => {
  isAutoSaved.value = false;
  isSavingBlog.value = true;

  //cancel the pending auto-save if there is one in progress
  debouncedSubmitBlog.cancel();
  //then submit the blog
  await submitBlog();
};

//Change the blog status to Published if the blog hasn't been published yet
//and user has clicked the "Publish" button
const publishBlog = async () => {
  //cancel the pending auto-save if there is one in progress
  debouncedSubmitBlog.cancel();

  // Validate the entire form (main fields + paragraph + challenge + achievement + feedback sections)
  const isInvalid = await isEntireFormInvalid();

  //then publish the blog
  if (!isInvalid) {
    isPublishingBlog.value = true;
    blogStore
      .publishBlog(blog.value.id)
      .then(() => {
        toast.add({
          severity: "success",
          summary: "Blog Published",
          detail: "The blog post has been published successfully.",
          life: 5000,
        });
        //change the status of the displayed blog to "Published"
        blog.value.status = BlogStatus.Published;
        //mark the change as one that doesn't require saving / auto saving
        ignorePublishedStatusChange.value = true;
      })
      .catch((message) => {
        // Show error toast if there was an error while publishing blog
        toast.add({
          severity: "error",
          summary: "Error",
          detail: message,
          life: 10000,
        });
      })
      .finally(() => {
        isPublishingBlog.value = false;
        //cancel the pending auto-save if there is one in progress
        debouncedSubmitBlog.cancel();
      });
  }
};

//Submit any changes made to the blog
const submitBlog = async () => {
  // Validate the entire form (main fields + paragraph + challenge + achievement + feedback sections)
  const isInvalid = await isEntireFormInvalid();

  // Only proceed if form is valid
  if (!isInvalid) {
    //sanitize the blog to be submitted
    const sanitizedBlog = BlogHelper.prepareBlogForSubmission(blog.value);
    //save the blog
    blogStore
      .editBlog(blog.value.id, sanitizedBlog)
      .then(() => {
        hasUnsavedChanges.value = false;

        //Show toast if the blog was not autosaved
        if (!isAutoSaved.value) {
          //show success toast notification after editing a blog
          toast.add({
            severity: "success",
            summary: "Blog Updated",
            detail: "Changes saved. Your blog post is now up to date.",
            life: 5000,
          });
        }
        // Silently refetch the updated blog immediately after saving to ensure that:
        // - Newly created content paragraphs have their real database IDs
        // - (instead of temporary string IDs used on the frontend), which is essential for accurate deletion or editing
        // - Data consistency between frontend and backend is maintained
        // Note: No loading spinner is shown — this is a background fetch invisible to the user
        displayLoadingSpinner.value = false;
        getBlogById(blog.value.id);
      })
      .catch((message) => {
        // Show error toast if the blog update fails
        toast.add({
          severity: "error",
          summary: "Update Failed",
          detail: message,
          life: 10000,
        });
      })
      .finally(() => {
        isSavingBlog.value = false;
        //cancel the pending auto-save if there is one in progress
        debouncedSubmitBlog.cancel();
      });
  }
};

// Debounced version of the submitBlog function
// This ensures that the function will only be called after 10 seconds of inactivity.
// If the user makes another change before 10 seconds pass, the timer is reset.
const debouncedSubmitBlog = debounce(async () => {
  //Don't auto save if form is invalid
  const isInvalid: boolean = await isEntireFormInvalid();
  if (isInvalid) return;
  isAutoSaved.value = true;
  isSavingBlog.value = true;
  await submitBlog();
}, 10000);
// Flag to determine if the current change to the blog object is the initial load.
// This is used to prevent triggering auto-save when the blog is first loaded from the backend.
const isInitialLoad = ref(false);
// Watcher that observes any deep changes to the blog object.
// Purpose:
// - To automatically save changes the user makes while editing a blog.
// - After any change is detected, the debounced submitBlog function is triggered.
// - This avoids excessive saves and only calls the save function after 10 seconds of inactivity.
watch(
  blog,
  () => {
    // Skip the first watcher trigger, which happens when the blog is initially loaded
    // from the backend. We only want to auto-save user-initiated edits.
    if (isInitialLoad.value) {
      isInitialLoad.value = false;
      return;
    }
    // Ignore this watcher trigger if the blog's status was just set to 'Published'.
    // The change has already been saved to the backend, so there's no need to trigger autosave or manual save.
    // This flag is set to true when the "publishBlog" method is invoked
    if (ignorePublishedStatusChange.value) {
      ignorePublishedStatusChange.value = false;
      return;
    }

    //make sure there is no deletion in progress before saving any changes
    if (isDeletingBlog.value) return;

    //if skip auto save is on for content paragraphs, don't go any further
    if (checkAndResetAutoSaveSkip(skipAutoSaveForContentParagraphs)) return;

    hasUnsavedChanges.value = true;

    //don't save if this is just a placeholder blog
    if (isPlaceholderBlog.value) return;

    // Trigger the debounced save function if the auto save is turned on
    // This ensures we wait for 10 seconds of no changes before saving
    if (isAutoSaveEnabled.value) debouncedSubmitBlog();
  },
  { deep: true }, // Watch nested properties inside the blog object
);

const deleteBlog = () => {
  isDeletingBlog.value = true;
  blogStore
    .deleteBlog(blog.value.id)
    .then(() => {
      toast.add({
        severity: "success",
        summary: "Blog Deleted",
        detail: "The blog post has been successfully deleted.",
        life: 10000,
      });
      router.push("/blogs");
    })
    .catch((message) => {
      toast.add({
        severity: "error",
        summary: "Delete Failed",
        detail: message,
        life: 10000,
      });
    })
    .finally(() => (isDeletingBlog.value = false));
};
</script>

<style scoped lang="scss">
@media (min-width: 768px) {
  .register-form {
    max-width: 30rem;
  }
}
</style>
