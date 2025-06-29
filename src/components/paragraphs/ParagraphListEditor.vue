<template>
  <section>
    <div>
      <AddParagraphForm
        v-for="(validatedParagraph, index) in validatedParagraphs"
        :index="index"
        :key="validatedParagraph.item.id"
        @update="(val: ValidatedItem<Paragraph>) => updateParagraphById(val)"
        @skipAutoSave="(val) => (skipAutoSave = val)"
        @delete="() => deleteParagraphById(validatedParagraph.item.id)"
        :paragraph="validatedParagraph.item"
        :crudContext="crudContext"
        :previousItemId="validatedParagraphs[index - 1]?.item.id.toString()"
      />
    </div>
    <div class="d-flex justify-content-center align-items-center">
      <Button
        @click="addNewParagraph"
        icon="pi pi-plus"
        severity="contrast"
        :label="buttonLabel"
        size="small"
      />
    </div>
  </section>
  <ConfirmPopup></ConfirmPopup>
</template>

<script setup lang="ts">
import { Paragraph } from "@/models/paragraph";
import { computed, onMounted, type PropType, type Ref } from "vue";
import AddParagraphForm from "./AddParagraphForm.vue";
import Button from "primevue/button";
import type { ValidatedItem } from "@/interfaces/shared/validatedItem";
import type { ParagraphType } from "@/enums/paragraphType";
import { watch } from "vue";
import { ref } from "vue";
import { useParagraphStore } from "@/stores/paragraph";
import ConfirmPopup from "primevue/confirmpopup";
import type { CrudContext } from "@/enums/crudContext";

const emit = defineEmits(["paragraphs", "hasInvalidParagraphs", "skipAutoSave"]);

const store = useParagraphStore();

const props = defineProps({
  paragraphType: {
    type: String as PropType<ParagraphType>,
    required: true,
  },
  buttonLabel: {
    type: String,
    required: false,
    default: () => "New paragraph",
  },
  //the current CRUD operation context for the form
  // based on whether the user is creating, viewing, updating, or deleting the paragraph
  crudContext: {
    type: String as PropType<CrudContext>,
    required: true,
  },
});

onMounted(() => {});

const validatedParagraphs: Ref<ValidatedItem<Paragraph>[]> = ref([]);

// Flag to prevent emitting events during the initial paragraph load
// This ensures that we don't notify the parent about paragraph changes
// when we're just initializing the data for the first time and that data is coming from the parent component
const isInitialLoad = ref(false);

/**
 * Initializes the paragraph list with pre-existing paragraphs.
 * This is typically called from the parent component after fetching data from the backend.
 * The paragraphs are validated before being stored locally.
 * During this initialization phase, no update events will be emitted.
 */
const initializeParagraphs = (paragraphs: Paragraph[]) => {
  validatedParagraphs.value = store.validateGivenParagraphs(paragraphs);
  isInitialLoad.value = true;
};
// Expose this method so the parent component can call it after loading data
defineExpose({ initializeParagraphs });

// Extracts and returns the original Paragraph objects from the validatedParagraphs array
const paragraphs: Ref<Paragraph[]> = computed(() => {
  return validatedParagraphs.value.reduce((accumulator, currentValue) => {
    accumulator.push(currentValue.item);
    return accumulator;
  }, [] as Paragraph[]);
});

// Determine if any paragraph in the list has failed validation
const hasInvalidParagraphs: Ref<boolean> = computed(() => {
  //look for any paragraphs whose validation is invalid
  const anyInvalid = validatedParagraphs.value.filter(
    (validatedParagraphs) => !validatedParagraphs.isValid,
  );
  return anyInvalid.length > 0;
});

//Add a new paragraph to the list of paragraphs when the Add button is clicked
const addNewParagraph = () => {
  const newParagraph = new Paragraph();
  //set the paragraph type e.g project background, project challenge etc
  newParagraph.paragraphType = props.paragraphType;

  //indicates whether the paragraph is newly created on the frontend and hasn't been saved to the backend yet
  newParagraph.isNew = true;
  //by default, the a new paragraph form is invalid since its fields (the required ones) will be  empty
  const isValid = false;
  validatedParagraphs.value.push({ item: newParagraph, isValid });
};

// Update the paragraph with the specified ID
const updateParagraphById = (updatedParagraph: ValidatedItem<Paragraph>) => {
  validatedParagraphs.value = validatedParagraphs.value.map((validatedParagraph) =>
    validatedParagraph.item.id === updatedParagraph.item.id ? updatedParagraph : validatedParagraph,
  );
};
//delete a paragraph with the specified ID
const deleteParagraphById = (targetId: string | number) => {
  validatedParagraphs.value = validatedParagraphs.value.filter(
    (validatedParagraph) => validatedParagraph.item.id != targetId,
  );
};

// Flag used to temporarily prevent auto-saving when a paragraph is deleted individually.
// This avoids triggering a full save in parent components (e.g., project or blog editors)
// for deletions that are already handled at the paragraph level.
const skipAutoSave = ref(false);

// Watch for changes in the validatedParagraphs array.
// Whenever any paragraph's content or validation state updates,
// extract the paragraph data and emit both the updated list
// and the combined validation status to keep the parent component in sync.
watch(
  validatedParagraphs,
  () => {
    // Skip emitting paragraph changes if this is the initial load.
    // The change does not need to be sent back to the parent since
    //the initial load comes from the parent, so emitting would be redundant.

    if (isInitialLoad.value) {
      isInitialLoad.value = false;

      return;
    }
    // Emit the current overall validation status indicating if any paragraph is invalid
    emit("hasInvalidParagraphs", hasInvalidParagraphs.value);
    //wether or not to auto save the changes in the parent component
    emit("skipAutoSave", skipAutoSave.value);
    // Emit the updated list of paragraphs to the parent component
    emit("paragraphs", paragraphs.value);
  },
  { deep: true },
);
</script>
