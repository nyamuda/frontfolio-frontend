<template>
  <section>
    <form @change="handleFormChange" class="mb-4">
      <Divider align="center" type="dashed"> 📝 Challenge {{ index + 1 }} </Divider>
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
      <div class="form-group">
        <FloatLabel variant="on">
          <Textarea
            id="problem"
            size="small"
            v-model="v$.problem.$model"
            :invalid="v$.problem.$error"
            rows="3"
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
          <label for="solution">solution</label>
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
          @click="deleteParagraph"
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
import { computed, ref, type Ref } from "vue";
import Button from "primevue/button";
import { Paragraph } from "@/models/paragraph";
import Divider from "primevue/divider";
import { Challenge } from "@/models/challenge";

const props = defineProps({
  paragraph: {
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
  title: props.paragraph.title,
  imageUrl: props.paragraph.imageUrl,
  imageCaption: props.paragraph.imageCaption,
  content: props.paragraph.content,
});

const rules = {
  title: {},
  imageUrl: {},
  imageCaption: {},
  content: {},
};
const v$ = useVuelidate(rules, form);
//form validation end

const handleFormChange = () => {
  //save the new paragraph details
  const paragraph = props.paragraph;
  paragraph.title = form.value.title;
  paragraph.imageUrl = form.value.imageUrl;
  paragraph.imageCaption = form.value.imageCaption;
  paragraph.content = form.value.content;

  emit("update", paragraph);
};

const deleteParagraph = () => emit("delete");
</script>
