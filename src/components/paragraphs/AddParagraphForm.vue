<template>
  <section :id="paragraph.id.toString()">
    <form @input="handleFormChange" class="mb-2">
      <div class="d-flex align-items-center">
        <Divider align="center" type="dashed" class="text-secondary fw-bold">
          <i class="pi pi-file-edit me-1"></i>
          <span class="">{{ dividerLabel }}</span>
        </Divider>
        <!-- Deleted -->
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
import { ParagraphType } from "@/enums/paragraphType";
import ConfirmPopup from "primevue/confirmpopup";
import { CrudContext } from "@/enums/crudContext";
import { useParagraphStore } from "@/stores/paragraph";
import { toWords } from "number-to-words";

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
  //Id of the paragraph before the current one.
  //Used to smoothly navigate up to the previous paragraph if the current one is deleted.
  previousParagraphId: {
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
const dividerLabel: Ref<string> = computed(() => {
  switch (props.paragraph.paragraphType) {
    case ParagraphType.ProjectBackground:
      return "Project paragraph " + toWords(props.index + 1);
    default:
      return "Paragraph " + toWords(props.index + 1);
  }
});

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
 * Scrolls to the previous paragraph in the list using its element ID.
 * Useful after deleting a paragraph to keep the user’s focus on the preceding one.
 *
 * */
const moveUpToPreviousParagraph = () => {
  if (props.previousParagraphId) {
    // Scroll to the previous paragraphs's element using its ID
    const element = document.getElementById(props.previousParagraphId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
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
        //scroll up to the previous paragraph after the delete
        moveUpToPreviousParagraph();
      }
    },
    reject: () => {},
  });
};

//Delete the paragraph on the backend
const deleteParagraph = () => {
  isDeletingParagraph.value = true;
  const paragraphId = props.paragraph.id;
  const projectId = props.paragraph.projectId;
  if (paragraphId && projectId) {
    store
      .deleteProjectBackgroundParagraph(paragraphId, projectId)
      .then(() => {
        // Emit a signal to skip auto-saving since this paragraph has already been deleted individually.
        // This prevents the parent components from unnecessarily triggering a full parent component save.
        emit("skipAutoSave", true);
        //remove paragraph form from UI
        emit("delete");

        //show toast
        toast.add({
          severity: "success",
          summary: "Paragraph Deleted",
          detail: "Selected paragraph was deleted.",
          life: 5000,
        });
        //scroll uo to the previous paragraph after the delete
        moveUpToPreviousParagraph();
      })
      .catch((message) => {
        toast.add({
          severity: "error",
          summary: "Delete Failed",
          detail: message,
          life: 10000,
        });
      })
      .finally(() => (isDeletingParagraph.value = false));
  }
};
</script>
