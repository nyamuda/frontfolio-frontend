<template>
  <section>
    <form @change="handleFormChange" class="mb-4">
      <Divider align="center" type="dashed"> 📝 {{ dividerLabel }} {{ index + 1 }} </Divider>
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
      <!-- Image Url input -->
      <div class="form-group mb-3">
        <FloatLabel variant="on">
          <InputText
            size="small"
            fluid
            id="imageUrl"
            type="url"
            v-model="v$.imageUrl.$model"
            :invalid="v$.imageUrl.$error"
          />
          <label for="imageUrl">Image URL</label>
        </FloatLabel>
        <Message size="small" severity="error" v-if="v$.imageUrl.$error" variant="simple">
          <div v-for="error of v$.imageUrl.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </div>
        </Message>
      </div>

      <!-- Image caption input -->
      <div class="form-group mb-3">
        <FloatLabel variant="on">
          <InputText
            fluid
            size="small"
            id="imageCaption"
            v-model="v$.imageCaption.$model"
            :invalid="v$.imageCaption.$error"
          />
          <label for="imageCaption">Image Caption</label>
        </FloatLabel>
        <Message size="small" severity="error" v-if="v$.imageCaption.$error" variant="simple">
          <div v-for="error of v$.imageCaption.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </div>
        </Message>
      </div>

      <!-- Content input -->
      <div class="form-group">
        <FloatLabel variant="on">
          <Textarea
            id="content"
            size="small"
            v-model="v$.content.$model"
            :invalid="v$.content.$error"
            rows="6"
            class="w-100"
            style="resize: none"
          />
          <label for="content">Content</label>
        </FloatLabel>
        <Message size="small" severity="error" v-if="v$.content.$error" variant="simple">
          <div v-for="error of v$.content.$errors" :key="error.$uid">
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
import { computed, onMounted, ref, type Ref } from "vue";
import Button from "primevue/button";
import { Paragraph } from "@/models/paragraph";
import Divider from "primevue/divider";
import { required, url } from "@vuelidate/validators";
import type { ValidatedItem } from "@/interfaces/projects/validatedItem";

const props = defineProps({
  paragraph: {
    type: Paragraph,
    required: false,
    default: () => new Paragraph(),
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

//Text for the divider
const dividerLabel: Ref<string> = computed(() => {
  switch (props.paragraph.paragraphType) {
    case "ProjectBackground":
      return "Project Paragraph";
    default:
      return "Paragraph";
  }
});

//form validation start
const form = ref({
  title: props.paragraph.title,
  imageUrl: props.paragraph.imageUrl,
  imageCaption: props.paragraph.imageCaption,
  content: props.paragraph.content,
});

const rules = {
  title: { required },
  imageUrl: { url },
  imageCaption: {},
  content: { required },
};
const v$ = useVuelidate(rules, form);
//form validation end

const handleFormChange = async () => {
  //save the new paragraph details
  const paragraph = props.paragraph;
  paragraph.title = form.value.title;
  paragraph.imageUrl = form.value.imageUrl;
  paragraph.imageCaption = form.value.imageCaption;
  paragraph.content = form.value.content;
  //is the form valid or not
  const isFormValid: boolean = await v$.value.$validate();
  //emit the updated form details and the validation state
  const validatedParagraph: ValidatedItem<Paragraph> = { item: paragraph, isValid: isFormValid };
  emit("update", validatedParagraph);
};

const deleteParagraph = () => emit("delete");
</script>
