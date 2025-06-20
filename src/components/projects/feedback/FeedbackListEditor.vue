<template>
  <section>
    <!-- List of forms -->
    <div>
      <AddFeedbackForm
        v-for="(validatedFeedback, index) in validatedFeedback"
        :index="index"
        :key="validatedFeedback.item.id"
        @update="(val: ValidatedItem<Feedback>) => updateFeedbackById(val)"
        @delete="() => deleteFeedbackById(validatedFeedback.item.id)"
        :feedback="validatedFeedback.item"
      />
    </div>
    <!-- Add new form button -->
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
</template>

<script setup lang="ts">
import { Feedback } from "@/models/feedback";
import { computed, ref, watch, type Ref } from "vue";

import Button from "primevue/button";
import AddFeedbackForm from "./AddFeedbackForm.vue";
import type { ValidatedItem } from "@/interfaces/projects/validatedItem";

defineProps({
  buttonLabel: {
    type: String,
    required: false,
    default: () => "New feedback",
  },
});
const emit = defineEmits(["feedback", "isAnyFeedbackInvalid"]);

const validatedFeedback: Ref<ValidatedItem<Feedback>[]> = ref([]);

// Determine if any feedback in the list has failed validation
const isAnyFeedbackInvalid: Ref<boolean> = computed(() => {
  //look for any feedback whose validation is invalid
  const anyInvalid = validatedFeedback.value.filter((feedback) => !feedback.isValid);
  return anyInvalid.length > 0;
});

//Add a new feedback to the list of feedback when the Add button is clicked
const addNewFeedback = () => {
  const newFeedback = new Feedback();
  //by default, the a new feedback form is invalid since its fields (the required ones) will be  empty
  const isValid = false;
  validatedFeedback.value.push({ item: newFeedback, isValid });
};

// Update the feedback with the specified ID
const updateFeedbackById = (updatedFeedback: ValidatedItem<Feedback>) => {
  validatedFeedback.value = validatedFeedback.value.map((oldFeedback) =>
    oldFeedback.item.id === updatedFeedback.item.id ? updatedFeedback : oldFeedback,
  );
};
//delete a feedback with the specified ID
const deleteFeedbackById = (targetId: string) => {
  validatedFeedback.value = validatedFeedback.value.filter(
    (feedback) => feedback.item.id != targetId,
  );
};

// Watch for changes in the validatedFeedback array.
// Whenever any feedback's content or validation state updates,
// extract the feedback data and emit both the updated list
// and the combined validation status to keep the parent component in sync.
watch(
  validatedFeedback,
  (newValidatedFeedback) => {
    // Extract the feedback objects from the validatedFeedback array
    const feedback = newValidatedFeedback.map((val) => val.item);

    // Emit the updated list of feedback to the parent component
    emit("feedback", feedback);

    // Emit the current overall validation status indicating if any feedback is invalid
    emit("isAnyFeedbackInvalid", isAnyFeedbackInvalid.value);
  },
  { deep: true },
);
</script>
