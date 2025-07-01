<template>
  <section>
    <div>
      <AddFeedbackForm
        v-for="(validatedFeedback, index) in validatedFeedbacks"
        :index="index"
        :key="validatedFeedback.item.id"
        @update="(val: ValidatedItem<Feedback>) => updateFeedbackById(val)"
        @skipAutoSave="(val) => (skipAutoSave = val)"
        @delete="() => deleteFeedbackById(validatedFeedback.item.id)"
        :feedback="validatedFeedback.item"
        :crudContext="crudContext"
        :previousFeedbackId="validatedFeedbacks[index - 1]?.item.id.toString()"
      />
    </div>
    <div class="d-flex justify-content-center align-items-center">
      <Button
        @click="addNewFeedback"
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
import { Feedback } from "@/models/feedback";
import { computed, onMounted, type PropType, type Ref } from "vue";
import AddFeedbackForm from "./AddFeedbackForm.vue";
import Button from "primevue/button";
import type { ValidatedItem } from "@/interfaces/shared/validatedItem";
import { watch } from "vue";
import { ref } from "vue";
import { useFeedbackStore } from "@/stores/feedback";
import ConfirmPopup from "primevue/confirmpopup";
import type { CrudContext } from "@/enums/crudContext";

const emit = defineEmits(["feedbacks", "hasInvalidFeedbacks", "skipAutoSave"]);

const store = useFeedbackStore();

defineProps({
  buttonLabel: {
    type: String,
    required: false,
    default: () => "New feedback",
  },
  //the current CRUD operation context for the form
  // based on whether the user is creating, viewing, updating, or deleting the feedback
  crudContext: {
    type: String as PropType<CrudContext>,
    required: true,
  },
});

onMounted(() => {});

const validatedFeedbacks: Ref<ValidatedItem<Feedback>[]> = ref([]);

// Flag to prevent emitting events during the initial feedback load
// This ensures that we don't notify the parent about feedback changes
// when we're just initializing the data for the first time and that data is coming from the parent component
const isInitialLoad = ref(false);

/**
 * Initializes the feedback list with pre-existing feedbacks (forgive me - I know the word doesn't exist).
 * This is typically called from the parent component after fetching data from the backend.
 * The feedbacks are validated before being stored locally.
 * During this initialization phase, no update events will be emitted.
 */
const initializeFeedbacks = (feedbacks: Feedback[]) => {
  validatedFeedbacks.value = store.validateGivenFeedback(feedbacks);
  isInitialLoad.value = true;
};
// Expose this method so the parent component can call it after loading data
defineExpose({ initializeFeedbacks });

// Extracts and returns the original Feedback objects from the validatedFeedbacks array
const feedbacks: Ref<Feedback[]> = computed(() => {
  return validatedFeedbacks.value.reduce((accumulator, currentValue) => {
    accumulator.push(currentValue.item);
    return accumulator;
  }, [] as Feedback[]);
});

// Determine if any feedback in the list has failed validation
const hasInvalidFeedbacks: Ref<boolean> = computed(() => {
  //look for any feedbacks whose validation is invalid
  const anyInvalid = validatedFeedbacks.value.filter(
    (validatedFeedbacks) => !validatedFeedbacks.isValid,
  );
  return anyInvalid.length > 0;
});

//Add a new feedback to the list of feedbacks when the Add button is clicked
const addNewFeedback = () => {
  const newFeedback = new Feedback();

  //indicates whether the feedback is newly created on the frontend and hasn't been saved to the backend yet
  newFeedback.isNew = true;
  //by default, the a new feedback form is invalid since its fields (the required ones) will be  empty
  const isValid = false;
  validatedFeedbacks.value.push({ item: newFeedback, isValid });
};

// Update the feedback with the specified ID
const updateFeedbackById = (updatedFeedback: ValidatedItem<Feedback>) => {
  validatedFeedbacks.value = validatedFeedbacks.value.map((validatedFeedback) =>
    validatedFeedback.item.id === updatedFeedback.item.id ? updatedFeedback : validatedFeedback,
  );
};
//delete a feedback with the specified ID
const deleteFeedbackById = (targetId: string | number) => {
  validatedFeedbacks.value = validatedFeedbacks.value.filter(
    (validatedFeedback) => validatedFeedback.item.id != targetId,
  );
};

// Flag used to temporarily prevent auto-saving when a feedback is deleted individually.
// This avoids triggering a full save in parent components (e.g., project or blog editors)
// for deletions that are already handled at the feedback level.
const skipAutoSave = ref(false);

// Watch for changes in the validatedFeedbacks array.
// Whenever any feedback's content or validation state updates,
// extract the feedback data and emit both the updated list
// and the combined validation status to keep the parent component in sync.
watch(
  validatedFeedbacks,
  () => {
    // Skip emitting feedback changes if this is the initial load.
    // The change does not need to be sent back to the parent since
    //the initial load comes from the parent, so emitting would be redundant.
    if (isInitialLoad.value) {
      isInitialLoad.value = false;
      return;
    }
    // Emit the current overall validation status indicating if any feedback is invalid
    emit("hasInvalidFeedbacks", hasInvalidFeedbacks.value);
    //wether or not to auto save the changes in the parent component
    emit("skipAutoSave", skipAutoSave.value);
    // Emit the updated list of feedbacks to the parent component
    emit("feedbacks", feedbacks.value);
  },
  { deep: true },
);
</script>
