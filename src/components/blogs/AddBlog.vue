<template>
  <div>
    <TitleSection title="Tell the story behind your blog" subtitle="New Blog" />

    <div class="row mb-2">
      <p class="col-md-6">
        Let the world see what you’ve been working on. Add a title, description, image, and any
        links that showcase your blog. You can save it as a draft or publish it when you’re ready.
      </p>
    </div>
    <!-- Save and Publish buttons start-->
    <div class="d-flex flex-column gap-2 align-items-end mb-5">
      <!-- Save changes & publish buttons -->
      <div class="d-flex justify-content-end gap-3 align-items-center">
        <Button
          size="small"
          @click="saveBlogAsDraft"
          :label="isSavingBlog ? 'Saving...' : 'Save as draft'"
          severity="contrast"
          :loading="isSavingBlog"
          :disabled="
            isPublishingBlog || isSavingBlog || v$.$errors.length > 0 || hasInvalidSubForms
          "
        />
        <Button
          size="small"
          v-if="blog.status != BlogStatus.Published"
          @click="publishBlog"
          :label="isPublishingBlog ? 'Publishing blog...' : 'Publish'"
          :loading="isPublishingBlog"
          :disabled="
            isPublishingBlog || isSavingBlog || v$.$errors.length > 0 || hasInvalidSubForms
          "
        />
      </div>
      <!-- Form error message -->
      <Message
        v-if="hasInvalidSubForms || v$.$error"
        icon="pi pi-times-circle"
        severity="error"
        variant="simple"
        size="small"
        >{{ invalidFormMessage }}</Message
      >
    </div>
    <!-- Save and Publish buttons end-->
    <form class="">
      <!-- Blog main details start -->
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
              >How technically challenging was this blog? Choose a level based on the complexity of
              the problem and the tools you used.</Message
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
              >Controls the position of this blog in your portfolio. Lower numbers appear
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

        <!-- Image URL, video URL, GitHub URL & Live URL -->
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
              <label for="liveUrl">Live Blog URL</label>
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
      <!-- Blog main details end -->
      <!-- Blog background paragraphs start  -->
      <Panel id="add-blog-paragraphs" class="mb-3" toggleable :collapsed="true">
        <template #header>
          <div class="d-flex justify-content-start align-items-center gap-1 fw-bold text-secondary">
            <i class="pi pi-history mt-1" style="font-size: 1.2rem"></i>
            <span class="fs-4">Blog Background</span>
          </div>
        </template>
        <p class="mb-3">
          Use this section to add in-depth details about your blog. Share your goals, why you built
          it, how you approached the process, and the key features. It's optional, but a wonderful
          way to show your thinking and help others understand your work and vision.
        </p>

        <ParagraphList
          :paragraphType="ParagraphType.BlogBackground"
          @paragraphs="(paragraphs) => (blog.background = paragraphs)"
          @has-invalid-paragraphs="(isInvalid) => (hasInvalidBackgroundForms = isInvalid)"
          :crudContext="CrudContext.Create"
          :fallback-container-id="'add-blog-paragraphs'"
        />
      </Panel>
      <!-- Blog background paragraphs end  -->

      <!-- Blog challenges start  -->
      <Panel id="add-blog-challenges" class="mb-3" toggleable :collapsed="true">
        <template #header>
          <div class="d-flex justify-content-start align-items-center gap-1 fw-bold text-secondary">
            <i class="pi pi-exclamation-triangle mt-1" style="font-size: 1.2rem"></i>
            <span class="fs-4">Blog Challenges</span>
          </div>
        </template>
        <p class="mb-3">
          Use this section to describe any challenges or obstacles you faced while building the
          blog. It could be technical issues, time constraints, or anything that tested your skills.
          Sharing challenges shows how you work through problems.
        </p>
        <ChallengeListEditor
          @challenges="(challenges: Challenge[]) => (blog.challenges = challenges)"
          @has-invalid-challenges="
            (isAnyInvalid: boolean) => (hasInvalidChallengeForms = isAnyInvalid)
          "
          :crudContext="CrudContext.Create"
          :fallback-container-id="'add-blog-challenges'"
        />
      </Panel>
      <!-- Blog challenges end  -->

      <!-- Blog achievements start  -->
      <Panel id="add-blog-achievements" class="mb-3" toggleable :collapsed="true">
        <template #header>
          <div class="d-flex justify-content-start align-items-center gap-1 fw-bold text-secondary">
            <i class="pi pi-flag mt-1" style="font-size: 1.2rem"></i>
            <span class="fs-4">Blog Achievements</span>
          </div>
        </template>
        <p class="mb-3">
          Use this section to highlight what you’re most proud of in the blog. This could be a
          complex feature you implemented or a skill you developed. It’s a great way to show the
          impact and results of your work.
        </p>
        <AchievementListEditor
          @achievements="(achievements: Achievement[]) => (blog.achievements = achievements)"
          @has-invalid-achievements="
            (isAnyInvalid: boolean) => (hasInvalidAchievementForms = isAnyInvalid)
          "
          :crudContext="CrudContext.Create"
          :fallback-container-id="'add-blog-achievements'"
        />
      </Panel>
      <!-- Blog achievements end  -->

      <!-- Blog feedback start  -->
      <Panel id="add-blog-feedback" class="mb-3" toggleable :collapsed="true">
        <template #header>
          <div class="d-flex justify-content-start align-items-center gap-1 fw-bold text-secondary">
            <i class="pi pi-comment mt-1" style="font-size: 1.2rem"></i>
            <span class="fs-4">Blog Feedback</span>
          </div>
        </template>
        <p class="mb-3">
          Use this section to include feedback or comments you received from others about your blog.
          It could be input from mentors, peers, users, or clients. Sharing feedback helps show how
          your work was received and can highlight areas of strength or improvement.
        </p>
        <FeedbackListEditor
          @feedback="(feedback: Feedback[]) => (blog.feedback = feedback)"
          @has-invalid-feedback="(isAnyInvalid) => (hasInvalidFeedbackForms = isAnyInvalid)"
          :crudContext="CrudContext.Create"
          :fallback-container-id="'add-blog-feedback'"
        />
      </Panel>
      <!-- Blog feedback end  -->
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from "vue";
import { useBlogStore } from "@/stores/blog";
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
import { Blog } from "@/models/blog";
import ParagraphList from "../paragraphs/ParagraphListEditor.vue";
import ChallengeListEditor from "./challenges/ChallengeListEditor.vue";
import AchievementListEditor from "./achievements/AchievementListEditor.vue";
import FeedbackListEditor from "./feedback/FeedbackListEditor.vue";
import type { Challenge } from "@/models/challenge";
import type { Achievement } from "@/models/achievement";
import type { Feedback } from "@/models/feedback";
import { BlogStatus } from "@/enums/blogStatus";
import DatePicker from "primevue/datepicker";
import InputNumber from "primevue/inputnumber";
import Select from "primevue/select";
import { BlogDifficultyLevel } from "@/enums/blogDifficultyLevel";
import { ParagraphType } from "@/enums/paragraphType";
import { CrudContext } from "@/enums/crudContext";
import { BlogHelper } from "@/helpers/blogHelper";

// Access the store
const blogStore = useBlogStore();
const toast = useToast();
const router = useRouter();

onMounted(() => {
  v$.value.$touch();
});

// The new blog being created
const blog: Ref<Blog> = ref(new Blog());
const invalidFormMessage = ref(
  "Some fields are missing or invalid. Please fix them to save or publish your blog.",
);
// Track whether any background paragraph form is invalid
const hasInvalidBackgroundForms: Ref<boolean> = ref(false);

// Track whether any challenge form is invalid
const hasInvalidChallengeForms: Ref<boolean> = ref(false);

// Track whether any achievement form is invalid
const hasInvalidAchievementForms: Ref<boolean> = ref(false);

// Track whether any feedback form is invalid
const hasInvalidFeedbackForms: Ref<boolean> = ref(false);

// Check whether any of the blog’s sub-sections (e.g. background, challenges,
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

const isSavingBlog = ref(false);
const isPublishingBlog = ref(false);
const difficultyLevels: Ref<BlogDifficultyLevel[]> = ref([
  BlogDifficultyLevel.Beginner,
  BlogDifficultyLevel.Intermediate,
  BlogDifficultyLevel.Advanced,
]);

//form validation start
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
//form validation end

//Change the blog status to Draft if user has clicked the "Save" button
const saveBlogAsDraft = async () => {
  isSavingBlog.value = true;
  //change the status to Draft
  blog.value.status = BlogStatus.Draft;
  //then submit the blog
  await submitBlog();
};

//Change the blog status to Published if user has clicked the "Publish" button
const publishBlog = async () => {
  isPublishingBlog.value = true;
  //change the status to Published
  blog.value.status = BlogStatus.Published;
  //then submit the blog
  await submitBlog();
};

const submitBlog = async () => {
  // Validate the entire form (main fields + paragraph + challenge + achievement + feedback sections)
  const isInvalid = await isEntireFormInvalid();

  // Only proceed if form is valid
  if (!isInvalid) {
    //sanitize the blog to be submitted
    const sanitizedBlog = BlogHelper.prepareBlogForSubmission(blog.value);
    //save the blog
    blogStore
      .addNewBlog(sanitizedBlog)
      .then(({ id }) => {
        // Show success toast notification
        const toastSummary = isPublishingBlog.value ? "Blog Published" : "Blog Saved as Draft";
        const toastDetail = isPublishingBlog.value
          ? "Your blog has been successfully published."
          : "You can continue editing and publish it when you're ready.";
        toast.add({
          severity: "success",
          summary: toastSummary,
          detail: toastDetail,
          life: 5000,
        });

        // Navigate to the blog list page if the blog was published
        if (isPublishingBlog.value) router.push("/blogs");
        //if its a draft, navigate to the edit blog page
        else {
          router.push(`/blogs/${id}/edit`);
        }
      })
      .catch(() => {
        // Show error toast notification
        const toastSummary = isPublishingBlog.value
          ? "Failed to Publish Blog"
          : "Failed to Save Draft";

        const toastDetail = isPublishingBlog.value
          ? "Something went wrong while publishing your blog. Please try again."
          : "We couldn’t save your draft. Make sure you're connected and try again.";
        toast.add({
          severity: "error",
          summary: toastSummary,
          detail: toastDetail,
          life: 10000,
        });
        //if blog was being published, change it back to draft
        //this will allow the "Publish" button to be displayed again
        if (isPublishingBlog.value) blog.value.status = BlogStatus.Draft;
      })
      .finally(() => {
        isSavingBlog.value = false;
        isPublishingBlog.value = false;
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
