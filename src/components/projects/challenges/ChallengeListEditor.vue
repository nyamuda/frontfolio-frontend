<template>
  <section>
    <div>
      <AddChallengeForm
        v-for="(validatedChallenge, index) in validatedChallenges"
        :index="index"
        :key="validatedChallenge.item.id"
        @update="(val: ValidatedItem<Challenge>) => updateChallengeById(val)"
        @skipAutoSave="(val) => (skipAutoSave = val)"
        @delete="() => deleteChallengeById(validatedChallenge.item.id)"
        :challenge="validatedChallenge.item"
        :crudContext="crudContext"
        :previousChallengeId="validatedChallenges[index - 1]?.item.id.toString()"
      />
    </div>
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
  <ConfirmPopup></ConfirmPopup>
</template>

<script setup lang="ts">
import { Challenge } from "@/models/challenge";
import { computed, onMounted, type PropType, type Ref } from "vue";
import AddChallengeForm from "./AddChallengeForm.vue";
import Button from "primevue/button";
import type { ValidatedItem } from "@/interfaces/shared/validatedItem";
import { watch } from "vue";
import { ref } from "vue";
import { useChallengeStore } from "@/stores/challenge";
import ConfirmPopup from "primevue/confirmpopup";
import type { CrudContext } from "@/enums/crudContext";

const emit = defineEmits(["challenges", "hasInvalidChallenges", "skipAutoSave"]);

const store = useChallengeStore();

defineProps({
  buttonLabel: {
    type: String,
    required: false,
    default: () => "New challenge",
  },
  //the current CRUD operation context for the form
  // based on whether the user is creating, viewing, updating, or deleting the challenge
  crudContext: {
    type: String as PropType<CrudContext>,
    required: true,
  },
});

onMounted(() => {});

const validatedChallenges: Ref<ValidatedItem<Challenge>[]> = ref([]);

// Flag to prevent emitting events during the initial challenge load
// This ensures that we don't notify the parent about challenge changes
// when we're just initializing the data for the first time and that data is coming from the parent component
const isInitialLoad = ref(false);

/**
 * Initializes the challenge list with pre-existing challenges.
 * This is typically called from the parent component after fetching data from the backend.
 * The challenges are validated before being stored locally.
 * During this initialization phase, no update events will be emitted.
 */
const initializeChallenges = (challenges: Challenge[]) => {
  validatedChallenges.value = store.validateGivenChallenges(challenges);
  isInitialLoad.value = true;
};
// Expose this method so the parent component can call it after loading data
defineExpose({ initializeChallenges });

// Extracts and returns the original Challenge objects from the validatedChallenges array
const challenges: Ref<Challenge[]> = computed(() => {
  return validatedChallenges.value.reduce((accumulator, currentValue) => {
    accumulator.push(currentValue.item);
    return accumulator;
  }, [] as Challenge[]);
});

// Determine if any challenge in the list has failed validation
const hasInvalidChallenges: Ref<boolean> = computed(() => {
  //look for any challenges whose validation is invalid
  const anyInvalid = validatedChallenges.value.filter(
    (validatedChallenges) => !validatedChallenges.isValid,
  );
  return anyInvalid.length > 0;
});

//Add a new challenge to the list of challenges when the Add button is clicked
const addNewChallenge = () => {
  const newChallenge = new Challenge();

  //indicates whether the challenge is newly created on the frontend and hasn't been saved to the backend yet
  newChallenge.isNew = true;
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
const deleteChallengeById = (targetId: string | number) => {
  validatedChallenges.value = validatedChallenges.value.filter(
    (validatedChallenge) => validatedChallenge.item.id != targetId,
  );
};

// Flag used to temporarily prevent auto-saving when a challenge is deleted individually.
// This avoids triggering a full save in parent components (e.g., project or blog editors)
// for deletions that are already handled at the challenge level.
const skipAutoSave = ref(false);

// Watch for changes in the validatedChallenges array.
// Whenever any challenge's content or validation state updates,
// extract the challenge data and emit both the updated list
// and the combined validation status to keep the parent component in sync.
watch(
  validatedChallenges,
  () => {
    // Skip emitting challenge changes if this is the initial load.
    // The change does not need to be sent back to the parent since
    //the initial load comes from the parent, so emitting would be redundant.
    if (isInitialLoad.value) {
      isInitialLoad.value = false;
      return;
    }
    // Emit the current overall validation status indicating if any challenge is invalid
    emit("hasInvalidChallenges", hasInvalidChallenges.value);
    //wether or not to auto save the changes in the parent component
    emit("skipAutoSave", skipAutoSave.value);
    // Emit the updated list of challenges to the parent component
    emit("challenges", challenges.value);
  },
  { deep: true },
);
</script>
