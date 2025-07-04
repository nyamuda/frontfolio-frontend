<template>
  <section>
    <div>
      <transition-group name="slide-left-fade">
        <AddAchievementForm
          v-for="(validatedAchievement, index) in validatedAchievements"
          :index="index"
          :key="validatedAchievement.item.id"
          @update="(val: ValidatedItem<Achievement>) => updateAchievementById(val)"
          @skipAutoSave="(val) => (skipAutoSave = val)"
          @delete="() => deleteAchievementById(validatedAchievement.item.id)"
          :achievement="validatedAchievement.item"
          :crudContext="crudContext"
          :previousAchievementId="validatedAchievements[index - 1]?.item.id.toString()"
          :nextAchievementId="validatedAchievements[index + 1]?.item.id.toString()"
          :fallbackContainerId="fallbackContainerId"
        />
      </transition-group>
    </div>
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
  <ConfirmPopup></ConfirmPopup>
</template>

<script setup lang="ts">
import { Achievement } from "@/models/achievement";
import { computed, onMounted, type PropType, type Ref } from "vue";
import AddAchievementForm from "./AddAchievementForm.vue";
import Button from "primevue/button";
import type { ValidatedItem } from "@/interfaces/shared/validatedItem";
import { watch } from "vue";
import { ref } from "vue";
import { useAchievementStore } from "@/stores/achievement";
import ConfirmPopup from "primevue/confirmpopup";
import type { CrudContext } from "@/enums/crudContext";

const emit = defineEmits(["achievements", "hasInvalidAchievements", "skipAutoSave"]);

const store = useAchievementStore();

defineProps({
  buttonLabel: {
    type: String,
    required: false,
    default: () => "New achievement",
  },
  //the current CRUD operation context for the form
  // based on whether the user is creating, viewing, updating, or deleting the achievement
  crudContext: {
    type: String as PropType<CrudContext>,
    required: true,
  },
  // The DOM element ID of the container that wraps the list of items (e.g., achievements).
  // This is used as a final fallback scroll target if neither `previousAchievementId` nor `nextAchievementId` is available.
  // Helps prevent abrupt layout jumps by ensuring the user always lands back in the main container.
  //
  // Example: If a user deletes the only achievement in the list, the UI scrolls back to the top of the container.
  fallbackContainerId: {
    type: [String],
    required: false,
  },
});

onMounted(() => {});

const validatedAchievements: Ref<ValidatedItem<Achievement>[]> = ref([]);

// Flag to prevent emitting events during the initial achievement load
// This ensures that we don't notify the parent about achievement changes
// when we're just initializing the data for the first time and that data is coming from the parent component
const isInitialLoad = ref(false);

/**
 * Initializes the achievement list with pre-existing achievements.
 * This is typically called from the parent component after fetching data from the backend.
 * The achievements are validated before being stored locally.
 * During this initialization phase, no update events will be emitted.
 */
const initializeAchievements = (achievements: Achievement[]) => {
  validatedAchievements.value = store.validateGivenAchievements(achievements);
  isInitialLoad.value = true;
};
// Expose this method so the parent component can call it after loading data
defineExpose({ initializeAchievements });

// Extracts and returns the original Achievement objects from the validatedAchievements array
const achievements: Ref<Achievement[]> = computed(() => {
  return validatedAchievements.value.reduce((accumulator, currentValue) => {
    accumulator.push(currentValue.item);
    return accumulator;
  }, [] as Achievement[]);
});

// Determine if any achievement in the list has failed validation
const hasInvalidAchievements: Ref<boolean> = computed(() => {
  //look for any achievements whose validation is invalid
  const anyInvalid = validatedAchievements.value.filter(
    (validatedAchievements) => !validatedAchievements.isValid,
  );
  return anyInvalid.length > 0;
});

//Add a new achievement to the list of achievements when the Add button is clicked
const addNewAchievement = () => {
  const newAchievement = new Achievement();

  //indicates whether the achievement is newly created on the frontend and hasn't been saved to the backend yet
  newAchievement.isNew = true;
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
const deleteAchievementById = (targetId: string | number) => {
  validatedAchievements.value = validatedAchievements.value.filter(
    (validatedAchievement) => validatedAchievement.item.id != targetId,
  );
};

// Flag used to temporarily prevent auto-saving when a achievement is deleted individually.
// This avoids triggering a full save in parent components (e.g., project or blog editors)
// for deletions that are already handled at the achievement level.
const skipAutoSave = ref(false);

// Watch for changes in the validatedAchievements array.
// Whenever any achievement's content or validation state updates,
// extract the achievement data and emit both the updated list
// and the combined validation status to keep the parent component in sync.
watch(
  validatedAchievements,
  () => {
    // Skip emitting achievement changes if this is the initial load.
    // The change does not need to be sent back to the parent since
    //the initial load comes from the parent, so emitting would be redundant.
    if (isInitialLoad.value) {
      isInitialLoad.value = false;
      return;
    }
    // Emit the current overall validation status indicating if any achievement is invalid
    emit("hasInvalidAchievements", hasInvalidAchievements.value);
    //wether or not to auto save the changes in the parent component
    emit("skipAutoSave", skipAutoSave.value);
    // Emit the updated list of achievements to the parent component
    emit("achievements", achievements.value);
  },
  { deep: true },
);
</script>
<style lang="scss">
// .skew-fade-slide-enter-active,
// .skew-fade-slide-leave-active {
//   transition: all 0.4s ease;
// }

// .skew-fade-slide-enter-from {
//   opacity: 0;
//   transform: skewY(1deg) translateY(10px); /* skew + slide in */
// }

// .skew-fade-slide-leave-to {
//   opacity: 0;
//   transform: translateX(20px); /* fade + slide right on leave */
// }

.slide-left-fade-enter-active,
.slide-left-fade-leave-active {
  transition: all 0.4s ease;
}

.slide-left-fade-enter-from {
  opacity: 0;
  transform: translateX(-15px);
}

.slide-left-fade-leave-to {
  opacity: 0;
  transform: translateX(15px); /* move to the right on leave */
}
</style>
