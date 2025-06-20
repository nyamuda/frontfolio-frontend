<template>
  <section>
    <!-- List of forms -->
    <div>
      <AddAchievementForm
        v-for="(validatedAchievement, index) in validatedAchievements"
        :index="index"
        :key="validatedAchievement.item.id"
        @update="(val: ValidatedItem<Achievement>) => updateAchievementById(val)"
        @delete="() => deleteAchievementById(validatedAchievement.item.id)"
        :achievement="validatedAchievement.item"
      />
    </div>
    <!-- Add new form button -->
    <div class="d-flex justify-content-center align-items-center">
      <Button
        @click="addNewAchievement"
        icon="pi pi-plus"
        severity="contrast"
        :label="buttonLabel"
        size="small"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { Achievement } from "@/models/achievement";
import { computed, ref, watch, type Ref } from "vue";

import Button from "primevue/button";
import AddAchievementForm from "./AddAchievementForm.vue";
import type { ValidatedItem } from "@/interfaces/projects/validatedItem";

defineProps({
  buttonLabel: {
    type: String,
    required: false,
    default: () => "New achievement",
  },
});
const emit = defineEmits(["achievements", "isAnyAchievementInvalid"]);

const validatedAchievements: Ref<ValidatedItem<Achievement>[]> = ref([]);

// Determine if any achievement in the list has failed validation
const isAnyAchievementInvalid: Ref<boolean> = computed(() => {
  //look for any achievement whose validation is invalid
  const anyInvalid = validatedAchievements.value.filter(
    (validatedAchievement) => !validatedAchievement.isValid,
  );
  return anyInvalid.length > 0;
});

//Add a new achievement to the list of achievements when the button is clicked
const addNewAchievement = () => {
  const newAchievement = new Achievement();
  //by default, the a new achievement form is invalid since its fields (the required ones) will be  empty
  const isValid = false;
  validatedAchievements.value.push({ item: newAchievement, isValid });
};

// Update the achievement with the specified ID
const updateAchievementById = (updatedAchievement: ValidatedItem<Achievement>) => {
  validatedAchievements.value = validatedAchievements.value.map((validatedAchievement) =>
    validatedAchievement.item.id === updatedAchievement.item.id
      ? updatedAchievement
      : validatedAchievement,
  );
};
//delete a achievement with the specified ID
const deleteAchievementById = (targetId: string) => {
  validatedAchievements.value = validatedAchievements.value.filter(
    (achievement) => achievement.item.id != targetId,
  );
};

// Watch for changes in the validatedAchievements array.
// Whenever any achievement's content or validation state updates,
// extract the achievement data and emit both the updated list
// and the combined validation status to keep the parent component in sync.
watch(
  validatedAchievements,
  (newValidatedAchievements) => {
    // Extract the achievement objects from the validatedAchievements array
    const achievements = newValidatedAchievements.map(
      (validatedAchievement) => validatedAchievement.item,
    );

    // Emit the updated list of achievements to the parent component
    emit("achievements", achievements);

    // Emit the current overall validation status indicating if any achievement is invalid
    emit("isAnyAchievementInvalid", isAnyAchievementInvalid.value);
  },
  { deep: true },
);
</script>
