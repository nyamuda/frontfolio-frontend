<template>
  <div>
    <TitleSection title="Tell the story behind your blog" subtitle="New Blog" />

    <div class="row mb-2">
      <p class="col-md-6">
        Let the world see what you’ve been working on. Add a title, description, image, and any
        links that showcase your blog. You can save it as a draft or publish it when you’re ready.
      </p>
    </div>
    <!-- Save button start-->
    <div class="d-flex flex-column gap-2 align-items-end mb-5">
      <!-- Save button -->
      <div class="d-flex justify-content-end gap-3 align-items-center">
        <Button
          size="small"
          @click="saveBlogAsDraft"
          :label="isSavingBlog ? 'Saving...' : 'Save as draft'"
          severity="contrast"
          :loading="isSavingBlog"
          :disabled="isSavingBlog || v$.$errors.length > 0 || hasInvalidSubForms"
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
    <!-- Save button end-->
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
        <!-- Topic input -->
        <div class="form-group mb-3">
          <FloatLabel variant="on">
            <InputText fluid id="topic" v-model="v$.topic.$model" :invalid="v$.topic.$error" />
            <label for="topic">Topic</label>
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
        <div class="row mb-3">
          <!-- Image URL -->
          <div class="form-group col-md-12">
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
      <!-- Blog content paragraphs start  -->
      <Panel id="add-blog-paragraphs" class="mb-3" toggleable :collapsed="true">
        <template #header>
          <div class="d-flex justify-content-start align-items-center gap-1 fw-bold text-secondary">
            <i class="pi pi-history mt-1" style="font-size: 1.2rem"></i>
            <span class="fs-4">Blog Content</span>
          </div>
        </template>
        <p class="mb-3">
          Use this section to add in-depth details about your blog. Share your goals, why you built
          it, how you approached the process, and the key features. It's optional, but a wonderful
          way to show your thinking and help others understand your work and vision.
        </p>

        <ParagraphList
          :paragraphType="ParagraphType.BlogSection"
          @paragraphs="(paragraphs) => (blog.content = paragraphs)"
          @has-invalid-paragraphs="(isInvalid) => (hasInvalidContentForms = isInvalid)"
          :crudContext="CrudContext.Create"
          :fallback-container-id="'add-blog-paragraphs'"
        />
      </Panel>
      <!-- Blog content paragraphs end  -->
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from "vue";
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
import ParagraphList from "../paragraphs/ParagraphListEditor.vue";
import { BlogStatus } from "@/enums/blogStatus";
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

const isSavingBlog = ref(false);

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
        toast.add({
          severity: "success",
          summary: "Blog Saved as Draft",
          detail: "You can continue editing and publish it when you're ready.",
          life: 5000,
        });

        router.push(`/blogs/${id}/edit`);
      })
      .catch(() => {
        // Show error toast notification

        toast.add({
          severity: "error",
          summary: "Failed to Save Draft",
          detail: "We couldn’t save your draft. Make sure you're connected and try again.",
          life: 10000,
        });
      })
      .finally(() => {
        isSavingBlog.value = false;
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
