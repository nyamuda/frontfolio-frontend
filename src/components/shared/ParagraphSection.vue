<template>
  <section>
    <!-- Title input -->
    <div class="form-group mb-3">
      <FloatLabel variant="on">
        <InputText fluid id="title" v-model="v$.name.$model" :invalid="v$.name.$error" />
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
        <InputText fluid id="imageUrl" v-model="v$.name.$model" :invalid="v$.name.$error" />
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
        <InputText fluid id="title" v-model="v$.name.$model" :invalid="v$.name.$error" />
        <label for="title">Title</label>
      </FloatLabel>
      <Message size="small" severity="error" v-if="v$.title.$error" variant="simple">
        <div v-for="error of v$.title.$errors" :key="error.$uid">
          <div>{{ error.$message }}</div>
        </div>
      </Message>
    </div>

    <!-- Content input -->
    <div class="form-group mb-3">
      <FloatLabel variant="on">
        <InputText fluid id="title" v-model="v$.name.$model" :invalid="v$.name.$error" />
        <label for="title">Title</label>
      </FloatLabel>
      <Message size="small" severity="error" v-if="v$.title.$error" variant="simple">
        <div v-for="error of v$.title.$errors" :key="error.$uid">
          <div>{{ error.$message }}</div>
        </div>
      </Message>
    </div>
  </section>
</template>

<script setup lang="ts">
import useVuelidate from "@vuelidate/core";
import { required, url } from "@vuelidate/validators";
import { ref } from "vue";

//form validation start
const form = ref({
  title: "",
  imageUrl: "",
  content: "",
});

const rules = {
  title: { required },
  imageUrl: { required, url },
  content: { required },
};
const v$ = useVuelidate(rules, form);
//form validation end
</script>
