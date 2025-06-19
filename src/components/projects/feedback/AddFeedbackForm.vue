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

      <!-- Author role input -->
      <div class="form-group mb-3">
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

      <!-- Comment input -->
      <div class="form-group">
        <FloatLabel variant="on">
          <Textarea
            id="comment"
            size="small"
            v-model="v$.comment.$model"
            :invalid="v$.comment.$error"
            rows="3"
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

      <!-- Date submitted input -->
      <div class="form-group">
        <FloatLabel variant="on">
          <DatePicker
            inputId="submittedAt"
            v-model="v$.submittedAt.$model"
            view="month"
            dateFormat="mm/yy"
          />
          <label for="submittedAt">Date Submitted</label>
        </FloatLabel>
        <Message size="small" severity="error" v-if="v$.submittedAt.$error" variant="simple">
          <div v-for="error of v$.submittedAt.$errors" :key="error.$uid">
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
import { ref } from "vue";
import Button from "primevue/button";
import Divider from "primevue/divider";
import { Challenge } from "@/models/challenge";
import DatePicker from "primevue/datepicker";

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

//form validation start
const form = ref({
  title: props.challenge.title,
  problem: props.challenge.problem,
  solution: props.challenge.solution,
});

const rules = {
  title: {},
  problem: {},
  solution: {},
};
const v$ = useVuelidate(rules, form);
//form validation end

const handleFormChange = () => {
  //save the new form updated details
  const challenge = props.challenge;
  challenge.title = form.value.title;
  challenge.problem = form.value.problem;
  challenge.solution = form.value.solution;
  emit("update", challenge);
};

const deleteChallenge = () => emit("delete");
</script>
