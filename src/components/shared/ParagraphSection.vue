<template>
  <section>
    <!-- Title input -->
    <div class="form-group mb-3">
      <FloatLabel variant="on">
        <InputText fluid id="title" v-model="v$.title.$model" :invalid="v$.title.$error" />
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
    <div class="form-group mb-3">
      <FloatLabel variant="on">
        <Textarea
          id="content"
          v-model="v$.content.$model"
          :invalid="v$.content.$error"
          rows="4"
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
  </section>
</template>

<script setup lang="ts">
import useVuelidate from "@vuelidate/core";
import { required, url } from "@vuelidate/validators";
import Textarea from "primevue/textarea";
import { ref } from "vue";

const props=defineProps({
  //title for the paragraph
  title: {
    type: String,
    required: true,
  },
  //image URL for the paragraph
  imageUrl: {
    type: String,
    required: false,
  },
  //caption for the image
  imageCaption: {
    type: String,
    required: false,
  },
  //the actual content of the paragraph
  content: {
    type: String,
    required: true,
  },
});

//form validation start
const form = ref({
  title: "",
  imageUrl: "",
  imageCaption: "",
  content: "",
});

const rules = {
  title: { required },
  imageUrl: { url },
  imageCaption: {},
  content: { required },
};
const v$ = useVuelidate(rules, form);
//form validation end
</script>
