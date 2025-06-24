<template>
  <div>
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

    <!-- Loader -->
    <div v-if="isLoadingProject" class="mb-5">
      <ProgressBar mode="indeterminate" style="height: 6px"></ProgressBar>
    </div>
    <!-- Save and Publish buttons start-->
    <div v-else class="d-flex justify-content-end gap-3 align-items-center mb-5">
      <Button
        :icon="
          isPublishingProject || isSavingProject
            ? 'pi pi-spin pi-refresh'
            : !hasUnsavedChanges && !isInitialLoad
              ? 'pi pi pi-check'
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
                ? 'All changes saved'
                : hasUnsavedChanges
                  ? 'Save changes'
                  : 'No changes yet'
        "
        severity="contrast"
        @click="saveProject"
        size="small"
        :disabled="
          isPublishingProject ||
          isSavingProject ||
          v$.$errors.length > 0 ||
          hasInvalidSubForms ||
          !hasUnsavedChanges
        "
      />

      <Button
        v-if="project.status != ProjectStatus.Published"
        @click="publishProject"
        label="Publish project"
        size="small"
        :disabled="
          isPublishingProject || isSavingProject || v$.$errors.length > 0 || hasInvalidSubForms
        "
      />
    </div>
    <!-- Save and Publish buttons end-->
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
          paragraphType="ProjectBackground"
          @paragraphs="(paragraphs: Paragraph[]) => (project.background = paragraphs)"
          @is-any-paragraph-invalid="
            (isAnyInvalid: boolean) => (hasInvalidBackgroundForms = isAnyInvalid)
          "
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
    {{ project }}
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, type Ref } from "vue";
import { useProjectStore } from "@/stores/project";
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

// Access the store
const projectStore = useProjectStore();
const toast = useToast();
const router = useRouter();

onMounted(async () => {
  v$.value.$touch();
  //get project ID from URL params
  const projectId = router.currentRoute.value.params["id"];
  //fetching project with given ID
  if (projectId) {
    getProjectById(Number(projectId));
  }
});

// The project being edited
const project: Ref<Project> = ref(new Project());
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

const isSavingProject = ref(false);
const isPublishingProject = ref(false);
//Show loading project loader or not
const isLoadingProject = ref(false);
// Tracks whether the project was saved automatically (via auto-save) or manually by the user.
// This is used to decide whether a toast notification should be shown.
// If the project was saved automatically, no toast is displayed.
const isAutoSaved = ref(true);
// Tracks whether the user has made any changes to the project since the last save.
// This is used to enable or disable the "Save Changes" button and prevent unnecessary saves.
const hasUnsavedChanges = ref(false);

//Form validation start
const rules = {
  title: { required },
  startDate: {},
  endDate: {},
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
    .then((data) => (project.value = data))
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
    projectStore
      .editProject(project.value.id, project.value)
      .then(() => {
        hasUnsavedChanges.value = false;
        //Don't show toast if the project was autosaved
        if (isAutoSaved.value) return;
        //show success toast notification after editing a project
        const toastSummary = isPublishingProject.value ? "Project Published" : "Project Updated";

        const toastDetail = isPublishingProject.value
          ? "Your project has been published and is now live in your portfolio."
          : "Your draft has been updated.";
        toast.add({
          severity: "success",
          summary: toastSummary,
          detail: toastDetail,
          life: 5000,
        });
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
const isInitialLoad = ref(true);
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
    hasUnsavedChanges.value = true;
    // Trigger the debounced save function
    // This ensures we wait for 10 seconds of no changes before saving
    debouncedSubmitProject();
  },
  { deep: true }, // Watch nested properties inside the project object
);
</script>

<style scoped lang="scss">
@media (min-width: 768px) {
  .register-form {
    max-width: 30rem;
  }
}
</style>
