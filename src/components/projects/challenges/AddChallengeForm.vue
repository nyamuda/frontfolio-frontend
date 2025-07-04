<template>
  <section :id="challenge.id.toString()">
    <form @input="handleFormChange" class="mb-2">
      <!-- Divider & delete button section -->
      <div class="d-flex align-items-center">
        <Divider align="center" type="dashed" class="text-secondary fw-bold">
          <i class="pi pi-exclamation-triangle me-1"></i>
          <span class="">{{ dividerLabel }}</span>
        </Divider>
        <!-- Delete button -->
        <Button
          @click="confirmDelete"
          :icon="isDeletingChallenge ? 'pi pi-spin pi-spinner' : 'pi pi-trash'"
          :label="isDeletingChallenge ? 'Deleting...' : ''"
          :disabled="isDeletingChallenge"
          severity="danger"
          :rounded="isDeletingChallenge ? false : true"
          aria-label="Delete"
          size="small"
          class="ms-2"
          v-tooltip="'Delete this challenge'"
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

      <!-- Problem input -->
      <div class="form-group mb-3">
        <FloatLabel variant="on">
          <Textarea
            id="problem"
            size="small"
            v-model="v$.problem.$model"
            :invalid="v$.problem.$error"
            rows="5"
            class="w-100"
            style="resize: none"
          />
          <label for="problem">Problem Faced</label>
        </FloatLabel>
        <Message size="small" severity="error" v-if="v$.problem.$error" variant="simple">
          <div v-for="error of v$.problem.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </div>
        </Message>
      </div>

      <!-- Solution input -->
      <div class="form-group">
        <FloatLabel variant="on">
          <Textarea
            id="solution"
            size="small"
            v-model="v$.solution.$model"
            :invalid="v$.solution.$error"
            rows="6"
            class="w-100"
            style="resize: none"
          />
          <label for="solution">Solution</label>
        </FloatLabel>
        <Message size="small" severity="error" v-if="v$.solution.$error" variant="simple">
          <div v-for="error of v$.solution.$errors" :key="error.$uid">
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
import { Challenge } from "@/models/challenge";
import Divider from "primevue/divider";
import { required } from "@vuelidate/validators";
import type { ValidatedItem } from "@/interfaces/shared/validatedItem";
import ConfirmPopup from "primevue/confirmpopup";
import { CrudContext } from "@/enums/crudContext";
import { useChallengeStore } from "@/stores/challenge";
import { toWords } from "number-to-words";

const toast = useToast();

const store = useChallengeStore();
const confirm = useConfirm();
const props = defineProps({
  challenge: {
    type: Object as PropType<Challenge>,
    required: false,
    default: () => new Challenge(),
  },
  index: {
    type: Number,
    required: false,
    default: () => 0,
  },
  //the current CRUD operation context for the form
  // based on whether the user is creating, viewing, updating, or deleting the challenge
  crudContext: {
    type: String as PropType<CrudContext>,
    required: true,
  },
  // The DOM element ID of the challenge that appears immediately *before* the current challenge in the list.
  // When the current challenge is deleted, this ID is used to smoothly scroll the user’s view to the previous challenge,
  // helping maintain context and focus without jumping to an unrelated section.
  //
  // Example use: If a user deletes the second challenge in a list, the app scrolls to the first challenge.

  previousChallengeId: {
    type: [String],
    required: false,
  },
  // The DOM element ID of the challenge that appears immediately *after* the current challenge in the list.
  // This ID is used for scrolling only if there is a `nextChallengeId` to scroll to after a deletion.
  // Helps maintain continuity by shifting focus to the next available challenge.
  //
  // Example: If a user deletes the second challenge and there’s a third challenge, the app scrolls to that
  //third challenge.
  nextChallengeId: {
    type: [String],
    required: false,
  },
  // The DOM element ID of the container that wraps the list of items (e.g., challenges).
  // This is used as a final fallback scroll target if neither `previousChallengeId` nor `nextChallengeId` is available.
  // Helps prevent abrupt layout jumps by ensuring the user always lands back in the main container.
  //
  // Example: If a user deletes the only challenge in the list, the UI scrolls back to the top of the container.
  fallbackContainerId: {
    type: [String],
    required: false,
  },
});
const emit = defineEmits(["update", "delete", "skipAutoSave"]);
const isDeletingChallenge = ref(false);

onMounted(() => {
  v$.value.$touch();
});

//Text for the divider
const dividerLabel: Ref<string> = computed(() => "Challenge " + toWords(props.index + 1));

//form validation start
const form = ref({
  title: props.challenge.title,
  problem: props.challenge.problem,
  solution: props.challenge.solution,
});

const rules = {
  title: { required },
  problem: { required },
  solution: { required },
};
const v$ = useVuelidate(rules, form);
//form validation end

const handleFormChange = async () => {
  //save the new challenge details
  const challenge = Object.assign(new Challenge(), props.challenge);
  challenge.title = form.value.title;
  challenge.problem = form.value.problem;
  challenge.solution = form.value.solution;

  //is the form valid or not
  const isFormValid: boolean = await v$.value.$validate();
  //emit the updated form details and the validation state
  const validatedChallenge: ValidatedItem<Challenge> = { item: challenge, isValid: isFormValid };
  emit("update", validatedChallenge);
  emit("skipAutoSave", false);
};

/**
 * Smoothly scrolls to the DOM element representing the challenge *before* the current one.
 * This helps maintain user focus after deleting a challenge by repositioning them to the previous element.
 */
const moveToPreviousChallenge = () => {
  if (props.previousChallengeId) {
    // Scroll to the previous challenges's element using its ID
    const element = document.getElementById(props.previousChallengeId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
};

/**
 * Smoothly scrolls to the DOM element representing the challenge *after* the current one.
 *
 */
const moveToNextChallenge = () => {
  if (props.nextChallengeId) {
    // Scroll to the previous challenges's element using its ID
    const element = document.getElementById(props.nextChallengeId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
};
/**
 * Scrolls to the fallback container if there are no sibling challenges before or after the deleted one.
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
 * Determines where to scroll after a challenge is deleted.
 * Priority: scroll to the next item → scroll to the previous item → scroll to fallback container.
 */
const scrollAfterChallengeDelete = () => {
  if (props.nextChallengeId) moveToNextChallenge();
  else if (props.previousChallengeId) moveToPreviousChallenge();
  else scrollToFallbackContainer();
};


const confirmDelete = () => {
  confirm.require({
    message: "Are you sure you want to delete this challenge?",
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
      //if current CRUD operation context is Update & the challenge is not new (already persisted in the database).
      //then the challenge needs to be deleted on the backend since its already an existing challenge that is
      //being edited
      if (props.crudContext == CrudContext.Update && !props.challenge.isNew) {
        deleteChallenge();
      }
      //else there is no need to delete the challenge on the backend since it hasn't been created yet
      //all we need to do is remove it from the UI
      else {
        // Emit a signal to skip auto-saving since this challenge doesn't exist in the database
        // This prevents the parent components from unnecessarily saving the delete
        emit("skipAutoSave", true);
        //remove challenge form from the UI
        emit("delete");
         //scroll to the previous or next challenge after the delete
        scrollAfterChallengeDelete();
      }
    },
    reject: () => {},
  });
};

//Delete the challenge on the backend
const deleteChallenge = () => {
  isDeletingChallenge.value = true;
  const challengeId = props.challenge.id;
  const projectId = props.challenge.projectId;
  if (challengeId && projectId) {
    store
      .deleteProjectChallenge(challengeId, projectId)
      .then(() => {
        // Emit a signal to skip auto-saving since this challenge has already been deleted individually.
        // This prevents the parent components from unnecessarily triggering a full parent component save.
        emit("skipAutoSave", true);
        //remove challenge form from UI
        emit("delete");

        //show toast
        toast.add({
          severity: "success",
          summary: "Challenge Deleted",
          detail: "Selected challenge was deleted.",
          life: 5000,
        });
         //scroll to the previous or next challenge after the delete
        scrollAfterChallengeDelete();
      })
      .catch((message) => {
        toast.add({
          severity: "error",
          summary: "Delete Failed",
          detail: message,
          life: 10000,
        });
      })
      .finally(() => (isDeletingChallenge.value = false));
  }
};
</script>
