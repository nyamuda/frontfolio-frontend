<template>
  <section :id="paragraph.id.toString()">
    <form @input="handleFormChange" class="mb-2">
      <!-- Divider & delete button section -->
      <div class="d-flex align-items-center">
        <Divider align="center" type="dashed" class="text-secondary fw-bold">
          <i class="pi pi-file-edit me-1"></i>
          <span class="">{{ dividerLabel }}</span>
        </Divider>
        <!-- Delete button -->
        <Button
          @click="confirmDelete"
          :icon="isDeletingParagraph ? 'pi pi-spin pi-spinner' : 'pi pi-trash'"
          :label="isDeletingParagraph ? 'Deleting...' : ''"
          :disabled="isDeletingParagraph"
          severity="danger"
          :rounded="isDeletingParagraph ? false : true"
          aria-label="Delete"
          size="small"
          class="ms-2"
          v-tooltip="'Delete this paragraph'"
        />
      </div>

      <!-- Title input -->
      <div class="form-group mb-3">
        <FloatLabel variant="on">
          <InputText
            size="small"
            fluid
            id="title"
            v-model="v$.title.$model"
            :invalid="v$.title.$error"
          />
          <label for="title">Title</label>
        </FloatLabel>
        <Message size="small" severity="error" v-if="v$.title.$error" variant="simple">
          <div v-for="error of v$.title.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </div>
        </Message>
      </div>
      <!-- Image Url input -->
      <div class="form-group mb-3">
        <FloatLabel variant="on">
          <InputText
            size="small"
            fluid
            id="imageUrl"
            type="url"
            v-model="v$.imageUrl.$model"
            :invalid="v$.imageUrl.$error"
          />
          <label for="imageUrl">Image URL</label>
        </FloatLabel>
        <Message size="small" severity="error" v-if="v$.imageUrl.$error" variant="simple">
          <div v-for="error of v$.imageUrl.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </div>
        </Message>
      </div>

      <!-- Image caption input -->
      <div class="form-group mb-3">
        <FloatLabel variant="on">
          <InputText
            fluid
            size="small"
            id="imageCaption"
            v-model="v$.imageCaption.$model"
            :invalid="v$.imageCaption.$error"
          />
          <label for="imageCaption">Image Caption</label>
        </FloatLabel>
        <Message size="small" severity="error" v-if="v$.imageCaption.$error" variant="simple">
          <div v-for="error of v$.imageCaption.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </div>
        </Message>
      </div>

      <!-- Content input -->
      <div class="form-group">
        <FloatLabel variant="on">
          <Textarea
            id="content"
            size="small"
            v-model="v$.content.$model"
            :invalid="v$.content.$error"
            rows="6"
            class="w-100"
            style="resize: none"
          />
          <label for="content">Content</label>
        </FloatLabel>
        <Message size="small" severity="error" v-if="v$.content.$error" variant="simple">
          <div v-for="error of v$.content.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </div>
        </Message>
      </div>
    </form>
    <ConfirmPopup></ConfirmPopup>
  </section>
</template>

<script setup lang="ts">
import useVuelidate from "@vuelidate/core";
import Textarea from "primevue/textarea";
import { Message, useConfirm, useToast } from "primevue";
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import { computed, onMounted, ref, type PropType, type Ref } from "vue";
import Button from "primevue/button";
import { Paragraph } from "@/models/paragraph";
import Divider from "primevue/divider";
import { required, url } from "@vuelidate/validators";
import type { ValidatedItem } from "@/interfaces/shared/validatedItem";
import ConfirmPopup from "primevue/confirmpopup";
import { CrudContext } from "@/enums/crudContext";
import { useParagraphStore } from "@/stores/paragraph";
import { toWords } from "number-to-words";
import { ParagraphType } from "@/enums/paragraphType";

const toast = useToast();

const store = useParagraphStore();
const confirm = useConfirm();
const props = defineProps({
  paragraph: {
    type: Object as PropType<Paragraph>,
    required: false,
    default: () => new Paragraph(),
  },
  index: {
    type: Number,
    required: false,
    default: () => 0,
  },
  //the current CRUD operation context for the form
  // based on whether the user is creating, viewing, updating, or deleting the paragraph
  crudContext: {
    type: String as PropType<CrudContext>,
    required: true,
  },
  // The DOM element ID of the paragraph that appears immediately *before* the current paragraph in the list.
  // When the current paragraph is deleted, this ID is used to smoothly scroll the user’s view to the previous paragraph,
  // helping maintain context and focus without jumping to an unrelated section.
  //
  // Example use: If a user deletes the second paragraph in a list, the app scrolls to the first paragraph.

  previousParagraphId: {
    type: [String],
    required: false,
  },
  // The DOM element ID of the paragraph that appears immediately *after* the current paragraph in the list.
  // This ID is used for scrolling only if there is a `nextParagraphId` to scroll to after a deletion.
  // Helps maintain continuity by shifting focus to the next available paragraph.
  //
  // Example: If a user deletes the second paragraph and there’s a third paragraph, the app scrolls to that
  //third paragraph.
  nextParagraphId: {
    type: [String],
    required: false,
  },
  // The DOM element ID of the container that wraps the list of items (e.g., paragraphs).
  // This is used as a final fallback scroll target if neither `previousParagraphId` nor `nextParagraphId` is available.
  // Helps prevent abrupt layout jumps by ensuring the user always lands back in the main container.
  //
  // Example: If a user deletes the only paragraph in the list, the UI scrolls back to the top of the container.
  fallbackContainerId: {
    type: [String],
    required: false,
  },
});
const emit = defineEmits(["update", "delete", "skipAutoSave"]);
const isDeletingParagraph = ref(false);

onMounted(() => {
  v$.value.$touch();
});

//Text for the divider
const dividerLabel: Ref<string> = computed(() => "Paragraph " + toWords(props.index + 1));

//form validation start
const form = ref({
  title: props.paragraph.title,
  imageUrl: props.paragraph.imageUrl,
  imageCaption: props.paragraph.imageCaption,
  content: props.paragraph.content,
});

const rules = {
  title: { required },
  imageUrl: { url },
  imageCaption: {},
  content: { required },
};
const v$ = useVuelidate(rules, form);
//form validation end

const handleFormChange = async () => {
  //save the new paragraph details
  const paragraph = Object.assign(new Paragraph(), props.paragraph);
  paragraph.title = form.value.title;
  paragraph.imageUrl = form.value.imageUrl;
  paragraph.imageCaption = form.value.imageCaption;
  paragraph.content = form.value.content;
  //is the form valid or not
  const isFormValid: boolean = await v$.value.$validate();
  //emit the updated form details and the validation state
  const validatedParagraph: ValidatedItem<Paragraph> = { item: paragraph, isValid: isFormValid };
  emit("update", validatedParagraph);
  emit("skipAutoSave", false);
};

/**
 * Smoothly scrolls to the DOM element representing the paragraph *before* the current one.
 * This helps maintain user focus after deleting a paragraph by repositioning them to the previous element.
 */
const moveToPreviousParagraph = () => {
  if (props.previousParagraphId) {
    // Scroll to the previous paragraphs's element using its ID
    const element = document.getElementById(props.previousParagraphId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
};

/**
 * Smoothly scrolls to the DOM element representing the paragraph *after* the current one.
 *
 */
const moveToNextParagraph = () => {
  if (props.nextParagraphId) {
    // Scroll to the previous paragraphs's element using its ID
    const element = document.getElementById(props.nextParagraphId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
};
/**
 * Scrolls to the fallback container if there are no sibling paragraphs before or after the deleted one.
 * Ensures the user isn't left disoriented after deleting the only item in a section.
 */
const scrollToFallbackContainer = () => {
  if (props.fallbackContainerId) {
    const element = document.getElementById(props.fallbackContainerId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
};

/**
 * Determines where to scroll after a paragraph is deleted.
 * Priority: scroll to the next item → scroll to the previous item → scroll to fallback container.
 */
const scrollAfterParagraphDelete = () => {
  if (props.nextParagraphId) moveToNextParagraph();
  else if (props.previousParagraphId) moveToPreviousParagraph();
  else scrollToFallbackContainer();
};

const confirmDelete = () => {
  confirm.require({
    message: "Are you sure you want to delete this paragraph?",
    header: "Confirmation",
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      icon: "pi pi-times",
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      icon: "pi pi-trash",
      label: "Delete",
      severity: "danger",
    },
    accept: () => {
      //if current CRUD operation context is Update & the paragraph is not new (already persisted in the database).
      //then the paragraph needs to be deleted on the backend since its already an existing paragraph that is
      //being edited
      if (props.crudContext == CrudContext.Update && !props.paragraph.isNew) {
        deleteParagraph();
      }
      //else there is no need to delete the paragraph on the backend since it hasn't been created yet
      //all we need to do is remove it from the UI
      else {
        // Emit a signal to skip auto-saving since this paragraph doesn't exist in the database
        // This prevents the parent components from unnecessarily saving the delete
        emit("skipAutoSave", true);
        //remove paragraph form from the UI
        emit("delete");

        //scroll to the previous or next paragraph after the delete
        scrollAfterParagraphDelete();
      }
    },
    reject: () => {},
  });
};

//Delete the paragraph on the backend
const deleteParagraph = async () => {
  try {
    isDeletingParagraph.value = true;
    const paragraphId = props.paragraph.id;
    //if deleting project background paragraph
    if (props.paragraph.paragraphType == ParagraphType.ProjectBackground) {
      const projectId = props.paragraph.projectId;
      //delete the paragraph
      if (paragraphId && projectId) {
        await store.deleteProjectBackgroundParagraph(paragraphId, projectId);
      }
    }
    //if deleting blog content paragraph
    if (props.paragraph.paragraphType == ParagraphType.BlogSection) {
      const blogId = props.paragraph.blogId;
      //delete the paragraph
      if (paragraphId && blogId) {
        await store.deleteBlogContentParagraph(paragraphId, blogId);
      }
    }
    // Emit a signal to skip auto-saving since this paragraph has already been deleted individually.
    // This prevents the parent components from unnecessarily triggering a full parent component save.
    emit("skipAutoSave", true);
    //remove paragraph form from UI
    emit("delete");
    //scroll to the previous or next paragraph after the delete
    scrollAfterParagraphDelete();
    //show toast
    toast.add({
      severity: "success",
      summary: "Paragraph Deleted",
      detail: "Selected paragraph was deleted.",
      life: 5000,
    });
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Delete Failed",
      detail: error,
      life: 10000,
    });
  } finally {
    isDeletingParagraph.value = false;
  }
};
</script>
