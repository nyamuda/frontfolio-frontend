<template>
  <section :id="achievement.id.toString()">
    <form @input="handleFormChange" class="mb-2">
     <!-- Divider & delete button section -->
      <div class="d-flex align-items-center">
        <Divider align="center" type="dashed" class="text-secondary fw-bold">
          <i class="pi pi-file-edit me-1"></i>
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
  //Id of the achievement before the current one.
  //Used to smoothly navigate up to the previous achievement if the current one is deleted.
  previousAchievementId: {
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
 * Scrolls to the previous achievement in the list using its element ID.
 * Useful after deleting a achievement to keep the user’s focus on the preceding one.
 *
 * */
const moveUpToPreviousAchievement = () => {
  if (props.previousAchievementId) {
    // Scroll to the previous achievements's element using its ID
    const element = document.getElementById(props.previousAchievementId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
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
        //scroll up to the previous achievement after the delete
        moveUpToPreviousAchievement();
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
        //scroll uo to the previous achievement after the delete
        moveUpToPreviousAchievement();
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
