<template>
  <section>
    <form @change="handleFormChange" class="mb-4">
      <Divider align="center" type="dashed"> 📝 Feedback {{ index + 1 }} </Divider>
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

      <!-- Button section -->
      <div class="text-end">
        <Button
          @click="deleteFeedback"
          icon="pi pi-trash"
          severity="danger"
          rounded
          aria-label="Delete"
        />
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import useVuelidate from "@vuelidate/core";
import Textarea from "primevue/textarea";
import { Message } from "primevue";
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import { onMounted, ref } from "vue";
import Button from "primevue/button";
import Divider from "primevue/divider";
import { Feedback } from "@/models/feedback";
import DatePicker from "primevue/datepicker";
import type { ValidatedItem } from "@/interfaces/projects/validatedItem";
import { required } from "@vuelidate/validators";

const props = defineProps({
  feedback: {
    type: Feedback,
    required: false,
    default: () => new Feedback(),
  },
  index: {
    type: Number,
    required: false,
    default: () => 0,
  },
});
const emit = defineEmits(["update", "delete"]);
onMounted(() => {
  v$.value.$touch();
});

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
  //save the new form updated details
  const feedback = props.feedback;
  feedback.authorName = form.value.authorName;
  feedback.authorRole = form.value.authorRole;
  feedback.comment = form.value.comment;
  feedback.submittedAt = form.value.submittedAt;

  //is the form valid or not
  const isFormValid: boolean = await v$.value.$validate();

  //emit the updated form details and the validation state
  const validatedFeedback: ValidatedItem<Feedback> = { item: feedback, isValid: isFormValid };
  emit("update", validatedFeedback);
};

const deleteFeedback = () => emit("delete");
</script>
