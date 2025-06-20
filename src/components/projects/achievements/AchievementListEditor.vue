<template>
  <section>
    <!-- List of forms -->
    <div>
      <AddAchievementForm
        v-for="(achievement, index) in achievements"
        :index="index"
        :key="achievement.id"
        @update="(val: Achievement) => updateAchievementById(val)"
        @delete="() => deleteAchievementById(achievement.id)"
        :achievement="achievement"
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
import { ref, type Ref } from "vue";

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

const validatedAchievements: Ref<ValidatedItem<Achievement>[]> = ref([]);

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
</script>
