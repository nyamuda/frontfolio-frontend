<template>
  <section :id="feedback.id.toString()">
    <form @input="handleFormChange" class="mb-2">
      <!-- Divider & delete button section -->
      <div class="d-flex align-items-center">
        <Divider align="center" type="dashed" class="text-secondary fw-bold">
          <i class="pi pi-comment me-1"></i>
          <span class="">{{ dividerLabel }}</span>
        </Divider>
        <!-- Delete button -->
        <Button
          @click="confirmDelete"
          :icon="isDeletingFeedback ? 'pi pi-spin pi-spinner' : 'pi pi-trash'"
          :label="isDeletingFeedback ? 'Deleting...' : ''"
          :disabled="isDeletingFeedback"
          severity="danger"
          :rounded="isDeletingFeedback ? false : true"
          aria-label="Delete"
          size="small"
          class="ms-2"
          v-tooltip="'Delete this feedback'"
        />
      </div>
      <!-- Author name input -->
      <div class="form-group mb-3">
        <FloatLabel variant="on">
          <InputText
            size="small"
            fluid
            id="authorName"
            v-model="v$.authorName.$model"
            :invalid="v$.authorName.$error"
          />
          <label for="authorName">Author Name</label>
        </FloatLabel>
        <Message size="small" severity="error" v-if="v$.authorName.$error" variant="simple">
          <div v-for="error of v$.authorName.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </div>
        </Message>
      </div>

      <div class="row mb-3">
        <!-- Author role input -->
        <div class="col-md-7 form-group">
          <FloatLabel variant="on">
            <InputText
              size="small"
              fluid
              id="authorRole"
              v-model="v$.authorRole.$model"
              :invalid="v$.authorRole.$error"
            />
            <label for="authorRole">Author Role</label>
          </FloatLabel>
          <Message size="small" severity="error" v-if="v$.authorRole.$error" variant="simple">
            <div v-for="error of v$.authorRole.$errors" :key="error.$uid">
              <div>{{ error.$message }}</div>
            </div>
          </Message>
        </div>

        <!-- Date submitted input -->
        <div class="col-md-5 form-group">
          <FloatLabel variant="on">
            <DatePicker
              fluid
              @value-change="handleFormChange"
              inputId="submittedAt"
              v-model="v$.submittedAt.$model"
              view="month"
              dateFormat="M/yy"
              size="small"
              :invalid="v$.submittedAt.$error"
            />
            <label for="submittedAt">Date Submitted</label>
          </FloatLabel>
          <Message size="small" severity="error" v-if="v$.submittedAt.$error" variant="simple">
            <div v-for="error of v$.submittedAt.$errors" :key="error.$uid">
              <div>{{ error.$message }}</div>
            </div>
          </Message>
        </div>
      </div>

      <!-- Comment input -->
      <div class="form-group">
        <FloatLabel variant="on">
          <Textarea
            id="comment"
            size="small"
            v-model="v$.comment.$model"
            :invalid="v$.comment.$error"
            rows="4"
            class="w-100"
            style="resize: none"
          />
          <label for="comment">Comment</label>
        </FloatLabel>
        <Message size="small" severity="error" v-if="v$.comment.$error" variant="simple">
          <div v-for="error of v$.comment.$errors" :key="error.$uid">
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
import { Feedback } from "@/models/feedback";
import Divider from "primevue/divider";
import { required } from "@vuelidate/validators";
import type { ValidatedItem } from "@/interfaces/shared/validatedItem";
import ConfirmPopup from "primevue/confirmpopup";
import { CrudContext } from "@/enums/crudContext";
import { useFeedbackStore } from "@/stores/feedback";
import { toWords } from "number-to-words";
import DatePicker from "primevue/datepicker";

const toast = useToast();

const store = useFeedbackStore();
const confirm = useConfirm();
const props = defineProps({
  feedback: {
    type: Object as PropType<Feedback>,
    required: false,
    default: () => new Feedback(),
  },
  index: {
    type: Number,
    required: false,
    default: () => 0,
  },
  //the current CRUD operation context for the form
  // based on whether the user is creating, viewing, updating, or deleting the feedback
  crudContext: {
    type: String as PropType<CrudContext>,
    required: true,
  },
  // The DOM element ID of the feedback that appears immediately *before* the current feedback in the list.
  // When the current feedback is deleted, this ID is used to smoothly scroll the user’s view to the previous feedback,
  // helping maintain context and focus without jumping to an unrelated section.
  //
  // Example use: If a user deletes the second feedback in a list, the app scrolls to the first feedback.

  previousFeedbackId: {
    type: [String],
    required: false,
  },
  // The DOM element ID of the feedback that appears immediately *after* the current feedback in the list.
  // This ID is used for scrolling only if there is a `nextFeedbackId` to scroll to after a deletion.
  // Helps maintain continuity by shifting focus to the next available feedback.
  //
  // Example: If a user deletes the second feedback and there’s a third feedback, the app scrolls to that
  //third feedback.
  nextFeedbackId: {
    type: [String],
    required: false,
  },
  // The DOM element ID of the container that wraps the list of items (e.g., feedback).
  // This is used as a final fallback scroll target if neither `previousFeedbackId` nor `nextFeedbackId` is available.
  // Helps prevent abrupt layout jumps by ensuring the user always lands back in the main container.
  //
  // Example: If a user deletes the only feedback in the list, the UI scrolls back to the top of the container.
  fallbackContainerId: {
    type: [String],
    required: false,
  },
});
const emit = defineEmits(["update", "delete", "skipAutoSave"]);
const isDeletingFeedback = ref(false);

onMounted(() => {
  v$.value.$touch();
});

//Text for the divider
const dividerLabel: Ref<string> = computed(() => "Feedback " + toWords(props.index + 1));

//form validation start
const form = ref({
  authorName: props.feedback.authorName,
  authorRole: props.feedback.authorRole,
  comment: props.feedback.comment,
  submittedAt: props.feedback.submittedAt,
});

const rules = {
  authorName: { required },
  authorRole: {},
  comment: { required },
  submittedAt: { required },
};
const v$ = useVuelidate(rules, form);
//form validation end

const handleFormChange = async () => {
  //save the new feedback details
  const feedback = Object.assign(new Feedback(), props.feedback);
  feedback.authorName = form.value.authorName;
  feedback.authorRole = form.value.authorRole;
  feedback.comment = form.value.comment;
  feedback.submittedAt = form.value.submittedAt;

  //is the form valid or not
  const isFormValid: boolean = await v$.value.$validate();
  //emit the updated form details and the validation state
  const validatedFeedback: ValidatedItem<Feedback> = { item: feedback, isValid: isFormValid };
  emit("update", validatedFeedback);
  emit("skipAutoSave", false);
};

/**
 * Smoothly scrolls to the DOM element representing the feedback *before* the current one.
 * This helps maintain user focus after deleting a feedback by repositioning them to the previous element.
 */
const moveToPreviousFeedback = () => {
  if (props.previousFeedbackId) {
    // Scroll to the previous feedback's element using its ID
    const element = document.getElementById(props.previousFeedbackId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
};

/**
 * Smoothly scrolls to the DOM element representing the feedback *after* the current one.
 *
 */
const moveToNextFeedback = () => {
  if (props.nextFeedbackId) {
    // Scroll to the previous feedback's element using its ID
    const element = document.getElementById(props.nextFeedbackId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
};
/**
 * Scrolls to the fallback container if there are no sibling feedback before or after the deleted one.
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
 * Determines where to scroll after a feedback is deleted.
 * Priority: scroll to the next item → scroll to the previous item → scroll to fallback container.
 */
const scrollAfterFeedbackDelete = () => {
  if (props.nextFeedbackId) moveToNextFeedback();
  else if (props.previousFeedbackId) moveToPreviousFeedback();
  else scrollToFallbackContainer();
};


const confirmDelete = () => {
  confirm.require({
    message: "Are you sure you want to delete this feedback?",
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
      //if current CRUD operation context is Update & the feedback is not new (already persisted in the database).
      //then the feedback needs to be deleted on the backend since its already an existing feedback that is
      //being edited
      if (props.crudContext == CrudContext.Update && !props.feedback.isNew) {
        deleteFeedback();
      }
      //else there is no need to delete the feedback on the backend since it hasn't been created yet
      //all we need to do is remove it from the UI
      else {
        // Emit a signal to skip auto-saving since this feedback doesn't exist in the database
        // This prevents the parent components from unnecessarily saving the delete
        emit("skipAutoSave", true);
        //remove feedback form from the UI
        emit("delete");
         //scroll to the previous or next feedback after the delete
        scrollAfterFeedbackDelete();
      }
    },
    reject: () => {},
  });
};

//Delete the feedback on the backend
const deleteFeedback = () => {
  isDeletingFeedback.value = true;
  const feedbackId = props.feedback.id;
  const projectId = props.feedback.projectId;
  if (feedbackId && projectId) {
    store
      .deleteProjectFeedback(feedbackId, projectId)
      .then(() => {
        // Emit a signal to skip auto-saving since this feedback has already been deleted individually.
        // This prevents the parent components from unnecessarily triggering a full parent component save.
        emit("skipAutoSave", true);
        //remove feedback form from UI
        emit("delete");

        //show toast
        toast.add({
          severity: "success",
          summary: "Feedback Deleted",
          detail: "Selected feedback was deleted.",
          life: 5000,
        });
          //scroll to the previous or next feedback after the delete
        scrollAfterFeedbackDelete();
      })
      .catch((message) => {
        toast.add({
          severity: "error",
          summary: "Delete Failed",
          detail: message,
          life: 10000,
        });
      })
      .finally(() => (isDeletingFeedback.value = false));
  }
};
</script>
