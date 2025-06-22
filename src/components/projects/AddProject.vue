<template>
  <div>
    <TitleSection title="Tell the story behind your project" subtitle="New Project" />

    <div class="row mb-2">
      <p class="col-md-6">
        Let the world see what you’ve been working on. Add a title, description, image, and any
        links that showcase your project. You can save it as a draft or publish it when you’re
        ready.
      </p>
    </div>
    <!-- Save and Publish buttons start-->
    <div class="d-flex justify-content-end gap-3 align-items-center mb-5">
      <Button
        @click="saveProjectAsDraft"
        :label="isSavingProject ? 'Saving...' : 'Save as draft'"
        severity="contrast"
        variant="outlined"
        :loading="isSavingProject"
        :disabled="
          isPublishingProject || isSavingProject || v$.$errors.length > 0 || hasInvalidSubForms
        "
      />
      <Button
        v-if="project.status != ProjectStatus.Published"
        @click="publishProject"
        :label="isPublishingProject ? 'Publishing project...' : 'Publish'"
        :loading="isPublishingProject"
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

        <!-- Image URL, GitHub URL & Live URL -->
        <div class="row mb-3">
          <!-- Image URL -->
          <div class="form-group col-md-4 g-3">
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
          <!-- GitHub URL -->
          <div class="form-group col-md-4 g-3">
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
          <div class="form-group col-md-4 g-3">
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
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from "vue";
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

// Access the store
const projectStore = useProjectStore();
const toast = useToast();
const router = useRouter();

onMounted(() => {
  v$.value.$touch();
});

// The new project being created
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

//form validation start
const rules = {
  title: { required },
  summary: { required },
  imageUrl: { url },
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
//form validation end

//Change the project status to Draft if user has clicked the "Save" button
const saveProjectAsDraft = async () => {
  isSavingProject.value = true;
  //change the status to Draft
  project.value.status = ProjectStatus.Draft;
  //then submit the project
  await submitProject();
};

//Change the project status to Published if user has clicked the "Publish" button
const publishProject = async () => {
  isPublishingProject.value = true;
  //change the status to Published
  project.value.status = ProjectStatus.Published;
  //then submit the project
  await submitProject();
};

const submitProject = async () => {
  // Validate the entire form (main fields + paragraph + challenge + achievement + feedback sections)
  const isInvalid = await isEntireFormInvalid();

  // Only proceed if form is valid
  if (!isInvalid) {
    projectStore
      .addNewProject(project.value)
      .then(({ id }) => {
        //project status
        const status: ProjectStatus = project.value.status;
        // Show success toast notification
        const toastSummary =
          status == ProjectStatus.Published ? "Project Published" : "Project Saved as Draft";
        const toastDetail =
          status == ProjectStatus.Published
            ? "Your project has been successfully published."
            : "You can continue editing and publish it when you're ready.";
        toast.add({
          severity: "success",
          summary: toastSummary,
          detail: toastDetail,
          life: 5000,
        });

        // Navigate to the project list page if the project was published
        if (status == ProjectStatus.Published) router.push("/projects");
        //if its a draft, navigate to the edit project page
        else {
          router.push(`/projects/${id}/edit`);
        }
      })
      .catch((message) => {
        // Show error toast if the project creation fails
        toast.add({
          severity: "error",
          summary: "Failed to Create Project",
          detail: message,
          life: 10000,
        });
      })
      .finally(() => {
        isSavingProject.value = false;
        isPublishingProject.value = false;
      });
  }
};
</script>

<style scoped lang="scss">
@media (min-width: 768px) {
  .register-form {
    max-width: 30rem;
  }
}
</style>
