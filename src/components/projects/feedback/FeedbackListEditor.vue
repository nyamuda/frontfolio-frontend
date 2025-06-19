<template>
  <section>
    <!-- List of forms -->
    <div>
      <AddFeedbackForm
        v-for="(feedback, index) in feedbackList"
        :index="index"
        :key="feedback.id"
        @update="(val: Feedback) => updateFeedbackById(val)"
        @delete="() => deleteFeedbackById(feedback.id)"
        :feedback="feedback"
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
import { ref, type Ref } from "vue";

import Button from "primevue/button";
import AddFeedbackForm from "./AddFeedbackForm.vue";

defineProps({
  buttonLabel: {
    type: String,
    required: false,
    default: () => "New feedback",
  },
});

const feedbackList: Ref<Feedback[]> = ref([]);

//Add a new feedback to feedbackList when the add feedback button is clicked
const addNewFeedback = () => feedbackList.value.push(new Feedback());

// Update the feedback with the specified ID
const updateFeedbackById = (updatedFeedback: Feedback) => {
  feedbackList.value = feedbackList.value.map((feedback) =>
    feedback.id === updatedFeedback.id ? updatedFeedback : feedback,
  );
};
//delete a feedback with the specified ID
const deleteFeedbackById = (targetId: string) => {
  feedbackList.value = feedbackList.value.filter((feedback) => feedback.id != targetId);
};
</script>
