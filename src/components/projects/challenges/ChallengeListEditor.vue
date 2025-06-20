<template>
  <section>
    <!-- List of forms -->
    <div>
      <AddChallengeForm
        v-for="(validatedChallenge, index) in validatedChallenges"
        :index="index"
        :key="validatedChallenge.item.id"
        @update="(val: ValidatedItem<Challenge>) => updateChallengeById(val)"
        @delete="() => deleteChallengeById(validatedChallenge.item.id)"
        :challenge="validatedChallenge.item"
      />
    </div>
    <!-- Add new form button -->
    <div class="d-flex justify-content-center align-items-center">
      <Button
        @click="addNewChallenge"
        icon="pi pi-plus"
        severity="contrast"
        :label="buttonLabel"
        size="small"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { Challenge } from "@/models/challenge";
import { computed, ref, watch, type Ref } from "vue";

import Button from "primevue/button";
import AddChallengeForm from "./AddChallengeForm.vue";
import type { ValidatedItem } from "@/interfaces/projects/validatedItem";

defineProps({
  buttonLabel: {
    type: String,
    required: false,
    default: () => "New challenge",
  },
});
const emit = defineEmits(["challenges", "isAnyChallengeInvalid"]);

const validatedChallenges: Ref<ValidatedItem<Challenge>[]> = ref([]);

// Determine if any challenge in the list has failed validation
const isAnyChallengeInvalid: Ref<boolean> = computed(() => {
  //look for any challenge whose validation is invalid
  const anyInvalid = validatedChallenges.value.filter(
    (validatedChallenge) => !validatedChallenge.isValid,
  );
  return anyInvalid.length > 0;
});

//Add a new challenge to the list of challenges when the Add button is clicked
const addNewChallenge = () => {
  const newChallenge = new Challenge();
  //by default, the a new challenge form is invalid since its fields (the required ones) will be  empty
  const isValid = false;
  validatedChallenges.value.push({ item: newChallenge, isValid });
};

// Update the challenge with the specified ID
const updateChallengeById = (updatedChallenge: ValidatedItem<Challenge>) => {
  validatedChallenges.value = validatedChallenges.value.map((validatedChallenge) =>
    validatedChallenge.item.id === updatedChallenge.item.id ? updatedChallenge : validatedChallenge,
  );
};
//delete a challenge with the specified ID
const deleteChallengeById = (targetId: string) => {
  validatedChallenges.value = validatedChallenges.value.filter(
    (challenge) => challenge.item.id != targetId,
  );
};

// Watch for changes in the validatedChallenges array.
// Whenever any challenge's content or validation state updates,
// extract the challenge data and emit both the updated list
// and the combined validation status to keep the parent component in sync.
watch(
  validatedChallenges,
  (newValidatedChallenges) => {
    // Extract the challenge objects from the validatedChallenges array
    const challenges = newValidatedChallenges.map((validatedChallenge) => validatedChallenge.item);

    // Emit the updated list of challenges to the parent component
    emit("challenges", challenges);

    // Emit the current overall validation status indicating if any challenge is invalid
    emit("isAnyChallengeInvalid", isAnyChallengeInvalid.value);
  },
  { deep: true },
);
</script>
