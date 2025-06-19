<template>
  <section>
    <!-- List of forms -->
    <div>
      <AddChallengeForm
        v-for="(challenge, index) in challenges"
        :index="index"
        :key="challenge.id"
        @update="(val: Challenge) => updateChallengeById(val)"
        @delete="() => deleteChallengeById(challenge.id)"
        :challenge="challenge"
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
import { ref, type Ref } from "vue";

import Button from "primevue/button";
import AddChallengeForm from "./AddChallengeForm.vue";

defineProps({
  buttonLabel: {
    type: String,
    required: false,
    default: () => "New challenge",
  },
});

const challenges: Ref<Challenge[]> = ref([]);

//Add a new challenge to the list of challenges when the button is clicked
const addNewChallenge = () => challenges.value.push(new Challenge());

// Update the challenge with the specified ID
const updateChallengeById = (updatedChallenge: Challenge) => {
  challenges.value = challenges.value.map((challenge) =>
    challenge.id === updatedChallenge.id ? updatedChallenge : challenge,
  );
};
//delete a challenge with the specified ID
const deleteChallengeById = (targetId: string) => {
  challenges.value = challenges.value.filter((challenge) => challenge.id != targetId);
};
</script>
