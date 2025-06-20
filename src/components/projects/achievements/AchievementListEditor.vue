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

const achievements: Ref<ValidatedItem<Achievement>[]> = ref([]);

//Add a new achievement to the list of achievements when the button is clicked
const addNewAchievement = () => achievements.value.push(new Achievement());

// Update the achievement with the specified ID
const updateAchievementById = (updatedAchievement: Achievement) => {
  achievements.value = achievements.value.map((achievement) =>
    achievement.id === updatedAchievement.id ? updatedAchievement : achievement,
  );
};
//delete a achievement with the specified ID
const deleteAchievementById = (targetId: string) => {
  achievements.value = achievements.value.filter((achievement) => achievement.id != targetId);
};
</script>
