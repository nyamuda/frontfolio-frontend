<template>
  <div>
    <!-- Title and description start -->
    <TitleSection title="Edit your project details" subtitle="Edit Project" />
    <div class="row mb-2">
      <div class="col-md-6">
        <p>
          You can continue editing your project. Your changes are saved automatically. If your
          project is published, updates will be reflected immediately in your public portfolio. You
          can also manually save your changes whenever you'd like.
        </p>
      </div>
    </div>
    <!-- Title and description end -->

    <!-- Loader -->
    <div v-if="isLoadingProject && displayLoadingSpinner" class="mb-5">
      <ProgressBar mode="indeterminate" style="height: 6px"></ProgressBar>
    </div>
    <!-- Buttons start-->
    <div v-else>
      <div v-if="!isPlaceholderProject" class="d-flex flex-column align-items-end mb-5 gap-4">
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
              isPublishingProject || isSavingProject
                ? 'pi pi-spin pi-spinner-dotted'
                : !hasUnsavedChanges && !isInitialLoad
                  ? 'pi pi pi-check-circle'
                  : hasUnsavedChanges
                    ? 'pi pi-save'
                    : 'pi pi-pencil'
            "
            :label="
              isSavingProject
                ? 'Saving changes...'
                : isPublishingProject
                  ? 'Publishing project...'
                  : !hasUnsavedChanges && !isInitialLoad
                    ? 'Last saved ' + dayjs.utc(project.updatedAt).local().fromNow()
                    : hasUnsavedChanges
                      ? 'Save changes'
                      : 'No changes yet'
            "
            severity="contrast"
            @click="saveProject"
            size="small"
            :disabled="
              isPublishingProject ||
              isDeletingProject ||
              isSavingProject ||
              v$.$errors.length > 0 ||
              hasInvalidSubForms ||
              !hasUnsavedChanges
            "
            :variant="!hasUnsavedChanges && !isInitialLoad ? 'text' : ''"
          />
          <!-- Publish project button -->
          <Button
            v-if="project.status != ProjectStatus.Published"
            @click="publishProject"
            label="Publish project"
            size="small"
            :disabled="
              isPublishingProject ||
              isSavingProject ||
              v$.$errors.length > 0 ||
              hasInvalidSubForms ||
              isDeletingProject
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
              :disabled="isPublishingProject || isSavingProject || isDeletingProject"
            >
            </ToggleSwitch>
          </div>
        </div>
        <!-- Delete project button -->
        <ConfirmDeleteButton
          title="Delete Project"
          message="Are you sure you want to delete this project?"
          :delete-callback="deleteProject"
          button-accept-label="Yes, delete it"
          :is-deleting="isDeletingProject"
        />
      </div>
    </div>
    <!--Buttons end-->
    <form class="">
      <!-- Project main details start -->
      <Panel class="mb-3" toggleable>
        <template #header>
          <div class="d-flex justify-content-start align-items-center gap-1 fw-bold text-secondary">
            <i class="pi pi-info-circle mt-1" style="font-size: 1.2rem"></i>
            <span class="fs-4">Main Details</span>
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
        <!-- Start and end date inputs -->
        <div class="row mb-3">
          <div class="col-md-6 form-group">
            <FloatLabel variant="on">
              <DatePicker
                fluid
                inputId="startDate"
                v-model="v$.startDate.$model"
                view="month"
                dateFormat="M/yy"
                :invalid="v$.startDate.$error"
              />
              <label for="startDate">Start Date</label>
            </FloatLabel>
            <Message size="small" severity="error" v-if="v$.startDate.$error" variant="simple">
              <div v-for="error of v$.startDate.$errors" :key="error.$uid">
                <div>{{ error.$message }}</div>
              </div>
            </Message>
          </div>

          <div class="col-md-6 form-group">
            <FloatLabel variant="on">
              <DatePicker
                fluid
                inputId="endDate"
                v-model="v$.endDate.$model"
                view="month"
                dateFormat="M/yy"
                :invalid="v$.endDate.$error"
              />
              <label for="endDate">End Date</label>
            </FloatLabel>
            <Message size="small" severity="error" v-if="v$.endDate.$error" variant="simple">
              <div v-for="error of v$.endDate.$errors" :key="error.$uid">
                <div>{{ error.$message }}</div>
              </div>
            </Message>
          </div>
        </div>

        <!-- Sort order & difficulty level inputs -->
        <div class="row mb-3">
          <!-- Difficulty level input -->
          <div class="form-group col-md-6">
            <FloatLabel variant="on">
              <Select
                fluid
                id="difficultyLevel"
                :options="difficultyLevels"
                v-model="v$.difficultyLevel.$model"
                :invalid="v$.difficultyLevel.$error"
              />
              <label for="difficultyLevel">Difficulty Level</label>
            </FloatLabel>
            <Message
              size="small"
              severity="error"
              v-if="v$.difficultyLevel.$error"
              variant="simple"
            >
              <div v-for="error of v$.difficultyLevel.$errors" :key="error.$uid">
                <div>{{ error.$message }}</div>
              </div>
            </Message>
            <Message v-else size="small" severity="secondary" variant="simple"
              >How technically challenging was this project? Choose a level based on the complexity
              of the problem and the tools you used.</Message
            >
          </div>
          <!-- Sort order input -->
          <div class="form-group col-md-6">
            <FloatLabel variant="on">
              <InputNumber
                v-model="v$.sortOrder.$model"
                inputId="sortOrder"
                showButtons
                :min="1"
                :invalid="v$.sortOrder.$error"
                buttonLayout="horizontal"
                fluid
              >
              </InputNumber>
              <label for="sortOrder">Sort Order</label>
            </FloatLabel>
            <Message size="small" severity="error" v-if="v$.sortOrder.$error" variant="simple">
              <div v-for="error of v$.sortOrder.$errors" :key="error.$uid">
                <div>{{ error.$message }}</div>
              </div>
            </Message>
            <Message v-else size="small" severity="secondary" variant="simple"
              >Controls the position of this project in your portfolio. Lower numbers appear
              first.</Message
            >
          </div>
        </div>
        <!-- Summary input -->
        <div class="form-group">
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

        <!-- Image URL, Video URL, GitHub URL & Live URL -->
        <div class="row mb-3">
          <!-- Image URL -->
          <div class="form-group col-md-6 g-3">
            <FloatLabel variant="on">
              <IconField>
                <InputIcon class="pi pi-image" />
                <InputText
                  fluid
                  id="imageUrl"
                  v-model="v$.imageUrl.$model"
                  :invalid="v$.imageUrl.$error"
                  def
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
          <!-- Video URL -->
          <div class="form-group col-md-6 g-3">
            <FloatLabel variant="on">
              <IconField>
                <InputIcon class="pi pi-image" />
                <InputText
                  fluid
                  id="videoUrl"
                  v-model="v$.videoUrl.$model"
                  :invalid="v$.videoUrl.$error"
                  type="url"
                />
              </IconField>
              <label for="videoUrl">Video URL</label>
            </FloatLabel>
            <Message size="small" severity="error" v-if="v$.videoUrl.$error" variant="simple">
              <div v-for="error of v$.videoUrl.$errors" :key="error.$uid">
                <div>{{ error.$message }}</div>
              </div>
            </Message>
          </div>
          <!-- GitHub URL -->
          <div class="form-group col-md-6 g-3">
            <FloatLabel variant="on">
              <IconField>
                <InputIcon class="pi pi-github" />
                <InputText
                  fluid
                  id="githubUrl"
                  v-model="v$.githubUrl.$model"
                  :invalid="v$.githubUrl.$error"
                  type="url"
                />
              </IconField>
              <label for="githubUrl">GitHub URL</label>
            </FloatLabel>
            <Message size="small" severity="error" v-if="v$.githubUrl.$error" variant="simple">
              <div v-for="error of v$.githubUrl.$errors" :key="error.$uid">
                <div>{{ error.$message }}</div>
              </div>
            </Message>
          </div>
          <!-- Live URL -->
          <div class="form-group col-md-6 g-3">
            <FloatLabel variant="on">
              <IconField>
                <InputIcon class="pi pi-globe" />
                <InputText
                  fluid
                  id="liveUrl"
                  v-model="v$.liveUrl.$model"
                  :invalid="v$.liveUrl.$error"
                  type="url"
                />
              </IconField>
              <label for="liveUrl">Live Project URL</label>
            </FloatLabel>
            <Message size="small" severity="error" v-if="v$.liveUrl.$error" variant="simple">
              <div v-for="error of v$.liveUrl.$errors" :key="error.$uid">
                <div>{{ error.$message }}</div>
              </div>
            </Message>
          </div>
        </div>

        <!-- TechStack input -->
        <div>
          <FloatLabel variant="on">
            <AutoComplete
              v-model="v$.techStack.$model"
              :invalid="v$.techStack.$error"
              inputId="techStack"
              multiple
              fluid
              :typeahead="false"
            />
            <label for="techStack">Tech Stack Used</label>
          </FloatLabel>
          <Message size="small" severity="error" v-if="v$.techStack.$error" variant="simple">
            <div v-for="error of v$.techStack.$errors" :key="error.$uid">
              <div>{{ error.$message }}</div>
            </div>
          </Message>
        </div>
      </Panel>
      <!-- Project main details end -->
      <!-- Project background paragraphs start  -->
      <Panel class="mb-3" toggleable :collapsed="true">
        <template #header>
          <div class="d-flex justify-content-start align-items-center gap-1 fw-bold text-secondary">
            <i class="pi pi-history mt-1" style="font-size: 1.2rem"></i>
            <span class="fs-4">Project Background</span>
          </div>
        </template>
        <p class="mb-3">
          Use this section to add in-depth details about your project. Share your goals, why you
          built it, how you approached the process, and the key features. It's optional, but a
          wonderful way to show your thinking and help others understand your work and vision.
        </p>

        <ParagraphList
          :paragraphType="ParagraphType.ProjectBackground"
          @paragraphs="(paragraphs: Paragraph[]) => (project.background = paragraphs)"
          @SkipAutoSave="(val) => (skipAutoSaveForBackgroundParagraphs = val)"
          @has-invalid-paragraphs="
            (isAnyInvalid: boolean) => (hasInvalidBackgroundForms = isAnyInvalid)
          "
          :crudContext="CrudContext.Update"
          ref="backgroundEditorRef"
        />
      </Panel>
      <!-- Project background paragraphs end  -->

      <!-- Project challenges start  -->
      <Panel class="mb-3" toggleable :collapsed="true">
        <template #header>
          <div class="d-flex justify-content-start align-items-center gap-1 fw-bold text-secondary">
            <i class="pi pi-exclamation-triangle mt-1" style="font-size: 1.2rem"></i>
            <span class="fs-4">Project Challenges</span>
          </div>
        </template>
        <p class="mb-3">
          Use this section to describe any challenges or obstacles you faced while building the
          project. It could be technical issues, time constraints, or anything that tested your
          skills. Sharing challenges shows how you work through problems.
        </p>
        <ChallengeListEditor
          @challenges="(challenges: Challenge[]) => (project.challenges = challenges)"
          @is-any-challenge-invalid="
            (isAnyInvalid: boolean) => (hasInvalidChallengeForms = isAnyInvalid)
          "
        />
      </Panel>
      <!-- Project challenges end  -->

      <!-- Project achievements start  -->
      <Panel class="mb-3" toggleable :collapsed="true">
        <template #header>
          <div class="d-flex justify-content-start align-items-center gap-1 fw-bold text-secondary">
            <i class="pi pi-flag mt-1" style="font-size: 1.2rem"></i>
            <span class="fs-4">Project Achievements</span>
          </div>
        </template>
        <p class="mb-3">
          Use this section to highlight what you’re most proud of in the project. This could be a
          complex feature you implemented or a skill you developed. It’s a great way to show the
          impact and results of your work.
        </p>
        <AchievementListEditor
          @achievements="(achievements: Achievement[]) => (project.achievements = achievements)"
          @is-any-achievement-invalid="
            (isAnyInvalid: boolean) => (hasInvalidAchievementForms = isAnyInvalid)
          "
        />
      </Panel>
      <!-- Project achievements end  -->

      <!-- Project feedback start  -->
      <Panel class="mb-3" toggleable :collapsed="true">
        <template #header>
          <div class="d-flex justify-content-start align-items-center gap-1 fw-bold text-secondary">
            <i class="pi pi-comment mt-1" style="font-size: 1.2rem"></i>
            <span class="fs-4">Project Feedback</span>
          </div>
        </template>
        <p class="mb-3">
          Use this section to include feedback or comments you received from others about your
          project. It could be input from mentors, peers, users, or clients. Sharing feedback helps
          show how your work was received and can highlight areas of strength or improvement.
        </p>
        <FeedbackListEditor
          @feedback="(feedback: Feedback[]) => (project.feedback = feedback)"
          @is-any-feedback-invalid="(isAnyInvalid) => (hasInvalidFeedbackForms = isAnyInvalid)"
        />
      </Panel>
      <!-- Project feedback end  -->
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, type Ref } from "vue";
import { useProjectStore } from "@/stores/project";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers, url, numeric } from "@vuelidate/validators";
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
import { Project } from "@/models/project";
import ParagraphList from "../paragraphs/ParagraphListEditor.vue";
import ChallengeListEditor from "./challenges/ChallengeListEditor.vue";
import AchievementListEditor from "./achievements/AchievementListEditor.vue";
import FeedbackListEditor from "./feedback/FeedbackListEditor.vue";
import type { Paragraph } from "@/models/paragraph";
import type { Challenge } from "@/models/challenge";
import type { Achievement } from "@/models/achievement";
import type { Feedback } from "@/models/feedback";
import { ProjectStatus } from "@/enums/projectStatus";
import ProgressBar from "primevue/progressbar";
import debounce from "lodash.debounce";
import DatePicker from "primevue/datepicker";
import InputNumber from "primevue/inputnumber";
import Select from "primevue/select";
import { ProjectDifficultyLevel } from "@/enums/projectDifficultyLevel";
import { ParagraphType } from "@/enums/paragraphType";
import { CrudContext } from "@/enums/crudContext";
import dayjs from "dayjs";
import { ProjectHelper } from "@/helpers/projectHelper";
import ToggleSwitch from "primevue/toggleswitch";
import ConfirmDeleteButton from "../shared/ConfirmDeleteButton.vue";

// Access the store
const projectStore = useProjectStore();
const toast = useToast();
const router = useRouter();

onMounted(async () => {
  //start from the top of the page
  window.scrollTo(0, 0);
  //show form validation errors
  v$.value.$touch();
  //get project ID from URL params
  const projectId = router.currentRoute.value.params["id"];
  //fetching project with given ID
  if (projectId) {
    getProjectById(Number(projectId));
  }
  //get autosave setting from local storage
  const autoSaveSetting = localStorage.getItem("isProjectAutoSaveEnabled");
  isAutoSaveEnabled.value = autoSaveSetting ? JSON.parse(autoSaveSetting) : true;
});

// The project being edited
const project: Ref<Project> = ref(new Project());
const backgroundEditorRef = ref();

// Determines if the project is a placeholder, typically used
// when no valid project was loaded indicating failed fetch
const isPlaceholderProject = computed(() => project.value?.id === 0);

// Track whether any background paragraph form is invalid
const hasInvalidBackgroundForms: Ref<boolean> = ref(false);

// Track whether any challenge form is invalid
const hasInvalidChallengeForms: Ref<boolean> = ref(false);

// Track whether any achievement form is invalid
const hasInvalidAchievementForms: Ref<boolean> = ref(false);

// Track whether any feedback form is invalid
const hasInvalidFeedbackForms: Ref<boolean> = ref(false);

// Check whether any of the project’s sub-sections (e.g. background, challenges,
// achievements, or feedback) contain invalid forms. Returns true if at least one
// sub-form is invalid
const hasInvalidSubForms = computed(
  () =>
    hasInvalidBackgroundForms.value ||
    hasInvalidChallengeForms.value ||
    hasInvalidAchievementForms.value ||
    hasInvalidFeedbackForms.value,
);
// Check the validity of the entire form
const isEntireFormInvalid = async (): Promise<boolean> => {
  // Validate the main form fields
  const areMainFieldsValid = await v$.value.$validate();
  // Return true if any section (main or sub-forms) is invalid
  return !areMainFieldsValid || hasInvalidSubForms.value;
};
const invalidFormMessage = ref(
  "Some required fields are missing or invalid. Please fix them to save your changes.",
);

const isSavingProject = ref(false);
const isDeletingProject = ref(false);
const isPublishingProject = ref(false);
//Show loading project loader or not
const isLoadingProject = ref(false);
// Whether to show the loading spinner (e.g. during autosave or fetch)
const displayLoadingSpinner = ref(true);
// Tracks whether the project was saved automatically (via auto-save) or manually by the user.
// This is used to decide whether a toast notification should be shown.
// If the project was saved automatically, no toast is displayed.
const isAutoSaved = ref(true);
// Controls whether autosave is enabled
const isAutoSaveEnabled = ref(true);
// Flag to temporarily suppress auto-saving when background paragraphs are modified.
// Used to avoid triggering an unnecessary save when changes are already handled elsewhere (e.g., on delete).
const skipAutoSaveForBackgroundParagraphs = ref(false);

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
  localStorage.setItem("isProjectAutoSaveEnabled", JSON.stringify(isAutoSaveEnabled.value));
  //if autosave is disabled, cancel a pending auto-save if there is already one in progress
  if (!isAutoSaveEnabled.value) {
    debouncedSubmitProject.cancel();
  }
};

// Tracks whether the user has made any changes to the project since the last save.
// This is used to enable or disable the "Save Changes" button and prevent unnecessary saves.
const hasUnsavedChanges = ref(false);
const difficultyLevels: Ref<ProjectDifficultyLevel[]> = ref([
  ProjectDifficultyLevel.Beginner,
  ProjectDifficultyLevel.Intermediate,
  ProjectDifficultyLevel.Advanced,
]);

//Form validation start
const rules = {
  title: { required },
  difficultyLevel: { required },
  sortOrder: { required, numeric },
  startDate: { required },
  endDate: { required },
  summary: { required },
  imageUrl: { url },
  videoUrl: { url },
  githubUrl: { url },
  liveUrl: { url },
  techStack: {
    required: helpers.withMessage(
      "You need to include at least one tool, language, or framework used in this project",
      required,
    ),
  },
};
const v$ = useVuelidate(rules, project);
//Form validation end

//Fetch a project with a given ID
const getProjectById = (id: number) => {
  isLoadingProject.value = true;
  projectStore
    .getProjectById(id)
    .then((data) => {
      isInitialLoad.value = true;
      project.value = data;
      //initialize the background paragraphs
      backgroundEditorRef.value?.initializeParagraphs(data.background);
    })
    .catch((message) => {
      // Show error toast if the project fetching fails
      toast.add({
        severity: "error",
        summary: "Failed to Fetch Project Details",
        detail: message,
        life: 10000,
      });
    })
    .finally(() => (isLoadingProject.value = false));
};

//save the project changes if it was already published
const saveProject = async () => {
  isAutoSaved.value = false;
  isSavingProject.value = true;

  //cancel the pending auto-save if there is one in progress
  debouncedSubmitProject.cancel();
  //then submit the project
  await submitProject();
};

//Change the project status to Published if the project hasn't been published yet
// and user has clicked the "Publish" button
const publishProject = async () => {
  isAutoSaved.value = false;
  isPublishingProject.value = true;
  //change the status to Published
  project.value.status = ProjectStatus.Published;
  //cancel the pending auto-save if there is one in progress
  debouncedSubmitProject.cancel();
  //then submit the project
  await submitProject();
};

const submitProject = async () => {
  // Validate the entire form (main fields + paragraph + challenge + achievement + feedback sections)
  const isInvalid = await isEntireFormInvalid();

  // Only proceed if form is valid
  if (!isInvalid) {
    //sanitize the project to be submitted
    const sanitizedProject = ProjectHelper.prepareProjectForSubmission(project.value);
    //save the project
    projectStore
      .editProject(project.value.id, sanitizedProject)
      .then(() => {
        hasUnsavedChanges.value = false;

        //Show toast if the project was not autosaved
        if (!isAutoSaved.value) {
          //show success toast notification after editing a project
          const toastSummary = isPublishingProject.value ? "Project Published" : "Project Updated";

          const toastDetail = isPublishingProject.value
            ? "Your project has been published and is now live in your portfolio."
            : "Your project has been updated.";
          toast.add({
            severity: "success",
            summary: toastSummary,
            detail: toastDetail,
            life: 5000,
          });
        }

        // Silently refetch the updated project immediately after saving to ensure that:
        // - Newly created background paragraphs, challenges, and achievements have their real database IDs
        // - (instead of temporary string IDs used on the frontend), which is essential for accurate deletion or editing
        // - Data consistency between frontend and backend is maintained
        // Note: No loading spinner is shown — this is a background fetch invisible to the user
        displayLoadingSpinner.value = false;
        getProjectById(project.value.id);
      })
      .catch((message) => {
        // Show error toast if the project creation fails
        toast.add({
          severity: "error",
          summary: "Update Failed",
          detail: message,
          life: 10000,
        });
        //if project was being published, change it back to draft
        //this will allow the "Publish" button to be displayed again
        if (isPublishingProject.value) project.value.status = ProjectStatus.Draft;
      })
      .finally(() => {
        isSavingProject.value = false;
        isPublishingProject.value = false;
        //cancel the pending auto-save if there is one in progress
        debouncedSubmitProject.cancel();
      });
  }
};

// Debounced version of the submitProject function
// This ensures that the function will only be called after 10 seconds of inactivity.
// If the user makes another change before 10 seconds pass, the timer is reset.
const debouncedSubmitProject = debounce(async () => {
  //Don't auto save if form is invalid
  const isInvalid: boolean = await isEntireFormInvalid();
  if (isInvalid) return;
  isAutoSaved.value = true;
  isSavingProject.value = true;
  await submitProject();
}, 10000);
// Flag to determine if the current change to the project object is the initial load.
// This is used to prevent triggering auto-save when the project is first loaded from the backend.
const isInitialLoad = ref(false);
// Watcher that observes any deep changes to the project object.
// Purpose:
// - To automatically save changes the user makes while editing a project.
// - After any change is detected, the debounced submitProject function is triggered.
// - This avoids excessive saves and only calls the save function after 10 seconds of inactivity.
watch(
  project,
  () => {
    // Skip the first watcher trigger, which happens when the project is initially loaded
    // from the backend. We only want to auto-save user-initiated edits.
    if (isInitialLoad.value) {
      isInitialLoad.value = false;
      return;
    }
    //make sure there is no deletion in progress before saving any changes
    if (isDeletingProject.value) return;

    //if skip auto save is on for background paragraphs, don't go any further
    if (checkAndResetAutoSaveSkip(skipAutoSaveForBackgroundParagraphs)) return;

    hasUnsavedChanges.value = true;

    //don't save if this is just a placeholder project
    if (isPlaceholderProject.value) return;

    // Trigger the debounced save function if the auto save is turned on
    // This ensures we wait for 10 seconds of no changes before saving
    if (isAutoSaveEnabled.value) debouncedSubmitProject();
  },
  { deep: true }, // Watch nested properties inside the project object
);

const deleteProject = () => {
  isDeletingProject.value = true;
  projectStore
    .deleteProject(project.value.id)
    .then(() => {
      toast.add({
        severity: "success",
        summary: "Project Deleted",
        detail: "The project has been deleted. You won’t see it in your portfolio anymore.",
        life: 10000,
      });
      router.push("/projects");
    })
    .catch((message) => {
      toast.add({
        severity: "error",
        summary: "Delete Failed",
        detail: message,
        life: 10000,
      });
    })
    .finally(() => (isDeletingProject.value = false));
};
</script>

<style scoped lang="scss">
@media (min-width: 768px) {
  .register-form {
    max-width: 30rem;
  }
}
</style>
