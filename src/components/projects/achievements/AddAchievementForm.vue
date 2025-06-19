<template>
  <section>
    <form @change="handleFormChange" class="mb-4">
      <Divider align="center" type="dashed"> 📝 Achievement {{ index + 1 }} </Divider>
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
            id="description"
            size="small"
            v-model="v$.description.$model"
            :invalid="v$.description.$error"
            rows="3"
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

      <!-- Button section -->
      <div class="text-end">
        <Button
          @click="deleteAchievement"
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
import { Achievement } from "@/models/achievement";

const props = defineProps({
  achievement: {
    type: Achievement,
    required: false,
    default: () => new Achievement(),
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
  title: props.achievement.title,
  description: props.achievement.description,
});

const rules = {
  title: {},
  description: {},
};
const v$ = useVuelidate(rules, form);
//form validation end

const handleFormChange = () => {
  //save the new form updated details
  const achievement = props.achievement;
  achievement.title = form.value.title;
  achievement.description = form.value.description;
  emit("update", achievement);
};

const deleteAchievement = () => emit("delete");
</script>
