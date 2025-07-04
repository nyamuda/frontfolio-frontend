<template>
  <section :id="achievement.id.toString()">
    <form @input="handleFormChange" class="mb-2">
      <!-- Divider & delete button section -->
      <div class="d-flex align-items-center">
        <Divider align="center" type="dashed" class="text-secondary fw-bold">
          <i class="pi pi-flag me-1"></i>
          <span class="">{{ dividerLabel }}</span>
        </Divider>
        <!-- Delete button -->
        <Button
          @click="confirmDelete"
          :icon="isDeletingAchievement ? 'pi pi-spin pi-spinner' : 'pi pi-trash'"
          :label="isDeletingAchievement ? 'Deleting...' : ''"
          :disabled="isDeletingAchievement"
          severity="danger"
          :rounded="isDeletingAchievement ? false : true"
          aria-label="Delete"
          size="small"
          class="ms-2"
          v-tooltip="'Delete this achievement'"
        />
      </div>
      <!-- Title input -->
      <div class="form-group mb-3">
        <FloatLabel variant="on">
          <InputText
            size="small"
            fluid
            id="title"
            v-model="v$.title.$model"
            :invalid="v$.title.$error"
          />
          <label for="title">Title</label>
        </FloatLabel>
        <Message size="small" severity="error" v-if="v$.title.$error" variant="simple">
          <div v-for="error of v$.title.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </div>
        </Message>
      </div>

      <!-- Description input -->
      <div class="form-group">
        <FloatLabel variant="on">
          <Textarea
            id="problem"
            size="small"
            v-model="v$.description.$model"
            :invalid="v$.description.$error"
            rows="5"
            class="w-100"
            style="resize: none"
          />
          <label for="description">Description</label>
        </FloatLabel>
        <Message size="small" severity="error" v-if="v$.description.$error" variant="simple">
          <div v-for="error of v$.description.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </div>
        </Message>
      </div>
    </form>
    <ConfirmPopup></ConfirmPopup>
  </section>
</template>

<script setup lang="ts">
import useVuelidate from "@vuelidate/core";
import Textarea from "primevue/textarea";
import { Message, useConfirm, useToast } from "primevue";
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import { computed, onMounted, ref, type PropType, type Ref } from "vue";
import Button from "primevue/button";
import { Achievement } from "@/models/achievement";
import Divider from "primevue/divider";
import { required } from "@vuelidate/validators";
import type { ValidatedItem } from "@/interfaces/shared/validatedItem";
import ConfirmPopup from "primevue/confirmpopup";
import { CrudContext } from "@/enums/crudContext";
import { useAchievementStore } from "@/stores/achievement";
import { toWords } from "number-to-words";

const toast = useToast();

const store = useAchievementStore();
const confirm = useConfirm();
const props = defineProps({
  achievement: {
    type: Object as PropType<Achievement>,
    required: false,
    default: () => new Achievement(),
  },
  index: {
    type: Number,
    required: false,
    default: () => 0,
  },
  //the current CRUD operation context for the form
  // based on whether the user is creating, viewing, updating, or deleting the achievement
  crudContext: {
    type: String as PropType<CrudContext>,
    required: true,
  },
  // The DOM element ID of the achievement that appears immediately *before* the current achievement in the list.
  // When the current achievement is deleted, this ID is used to smoothly scroll the user’s view to the previous achievement,
  // helping maintain context and focus without jumping to an unrelated section.
  //
  // Example use: If a user deletes the second achievement in a list, the app scrolls to the first achievement.

  previousAchievementId: {
    type: [String],
    required: false,
  },
  // The DOM element ID of the achievement that appears immediately *after* the current achievement in the list.
  // This ID is used for scrolling only if there is a `nextAchievementId` to scroll to after a deletion.
  // Helps maintain continuity by shifting focus to the next available achievement.
  //
  // Example: If a user deletes the second achievement and there’s a third achievement, the app scrolls to that
  //third achievement.
  nextAchievementId: {
    type: [String],
    required: false,
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
const emit = defineEmits(["update", "delete", "skipAutoSave"]);
const isDeletingAchievement = ref(false);

onMounted(() => {
  v$.value.$touch();
});

//Text for the divider
const dividerLabel: Ref<string> = computed(() => "Achievement " + toWords(props.index + 1));

//form validation start
const form = ref({
  title: props.achievement.title,
  description: props.achievement.description,
});

const rules = {
  title: { required },
  description: { required },
};
const v$ = useVuelidate(rules, form);
//form validation end

const handleFormChange = async () => {
  //save the new achievement details
  const achievement = Object.assign(new Achievement(), props.achievement);
  achievement.title = form.value.title;
  achievement.description = form.value.description;

  //is the form valid or not
  const isFormValid: boolean = await v$.value.$validate();
  //emit the updated form details and the validation state
  const validatedAchievement: ValidatedItem<Achievement> = {
    item: achievement,
    isValid: isFormValid,
  };
  emit("update", validatedAchievement);
  emit("skipAutoSave", false);
};

/**
 * Smoothly scrolls to the DOM element representing the achievement *before* the current one.
 * This helps maintain user focus after deleting a achievement by repositioning them to the previous element.
 */
const moveToPreviousAchievement = () => {
  if (props.previousAchievementId) {
    // Scroll to the previous achievements's element using its ID
    const element = document.getElementById(props.previousAchievementId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
};

/**
 * Smoothly scrolls to the DOM element representing the achievement *after* the current one.
 *
 */
const moveToNextAchievement = () => {
  if (props.nextAchievementId) {
    // Scroll to the previous achievements's element using its ID
    const element = document.getElementById(props.nextAchievementId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
};
/**
 * Scrolls to the fallback container if there are no sibling achievements before or after the deleted one.
 * Ensures the user isn't left disoriented after deleting the only item in a section.
 */
const scrollToFallbackContainer = () => {
  if (props.fallbackContainerId) {
    const element = document.getElementById(props.fallbackContainerId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
};

/**
 * Determines where to scroll after a achievement is deleted.
 * Priority: scroll to the next item → scroll to the previous item → scroll to fallback container.
 */
const scrollAfterAchievementDelete = () => {
  if (props.nextAchievementId) moveToNextAchievement();
  else if (props.previousAchievementId) moveToPreviousAchievement();
  else scrollToFallbackContainer();
};

const confirmDelete = () => {
  confirm.require({
    message: "Are you sure you want to delete this achievement?",
    header: "Confirmation",
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      icon: "pi pi-times",
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      icon: "pi pi-trash",
      label: "Delete",
      severity: "danger",
    },
    accept: () => {
      //if current CRUD operation context is Update & the achievement is not new (already persisted in the database).
      //then the achievement needs to be deleted on the backend since its already an existing achievement that is
      //being edited
      if (props.crudContext == CrudContext.Update && !props.achievement.isNew) {
        deleteAchievement();
      }
      //else there is no need to delete the achievement on the backend since it hasn't been created yet
      //all we need to do is remove it from the UI
      else {
        // Emit a signal to skip auto-saving since this achievement doesn't exist in the database
        // This prevents the parent components from unnecessarily saving the delete
        emit("skipAutoSave", true);
        //remove achievement form from the UI
        emit("delete");
        //scroll to the previous or next achievement after the delete
        scrollAfterAchievementDelete();
      }
    },
    reject: () => {},
  });
};

//Delete the achievement on the backend
const deleteAchievement = () => {
  isDeletingAchievement.value = true;
  const achievementId = props.achievement.id;
  const projectId = props.achievement.projectId;
  if (achievementId && projectId) {
    store
      .deleteProjectAchievement(achievementId, projectId)
      .then(() => {
        // Emit a signal to skip auto-saving since this achievement has already been deleted individually.
        // This prevents the parent components from unnecessarily triggering a full parent component save.
        emit("skipAutoSave", true);
        //remove achievement form from UI
        emit("delete");

        //show toast
        toast.add({
          severity: "success",
          summary: "Achievement Deleted",
          detail: "Selected achievement was deleted.",
          life: 5000,
        });
        //scroll to the previous or next achievement after the delete
        scrollAfterAchievementDelete();
      })
      .catch((message) => {
        toast.add({
          severity: "error",
          summary: "Delete Failed",
          detail: message,
          life: 10000,
        });
      })
      .finally(() => (isDeletingAchievement.value = false));
  }
};
</script>
