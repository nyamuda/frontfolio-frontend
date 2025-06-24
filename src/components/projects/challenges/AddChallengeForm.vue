<template>
  <section>
    <form @change="handleFormChange" class="mb-4">
      <Divider align="center" type="dashed">
        <i class="pi pi-exclamation-triangle"></i> Challenge {{ index + 1 }}
      </Divider>
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

      <!-- Button section -->
      <div class="text-end">
        <Button
          @click="deleteChallenge"
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
import { Challenge } from "@/models/challenge";
import type { ValidatedItem } from "@/interfaces/shared/validatedItem";
import { required } from "@vuelidate/validators";

const props = defineProps({
  challenge: {
    type: Challenge,
    required: false,
    default: () => new Challenge(),
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
  //save the new form updated details
  const challenge = props.challenge;
  challenge.title = form.value.title;
  challenge.problem = form.value.problem;
  challenge.solution = form.value.solution;
  //is the form valid or not
  const isFormValid: boolean = await v$.value.$validate();
  //emit the updated form details and the validation state
  const validatedChallenge: ValidatedItem<Challenge> = { item: challenge, isValid: isFormValid };
  emit("update", validatedChallenge);
};

const deleteChallenge = () => emit("delete");
</script>
