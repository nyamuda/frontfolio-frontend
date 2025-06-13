<template>
  <div>
    <TitleSection title="Tell the story behind your project" subtitle="New Project" />

    <div class="row mb-5">
      <p class="col-md-6">
        Let the world see what you’ve been working on. Add a title, description, image, and any
        links that showcase your project. You can save it as a draft or publish it when you’re
        ready.
      </p>
      <div class="col-md-6 d-flex justify-content-end gap-3 align-items-center">
        <Button label="Save changes" severity="secondary" size="small" />
        <Button label="Publish" size="small" />
      </div>
    </div>
    <form @submit.prevent="submitForm" class="">
      <!-- Project main details -->
      <Panel header="Main Details" class="mb-3" toggleable>
        <!-- Title input -->
        <div class="form-group mb-3">
          <FloatLabel variant="on">
            <IconField>
              <InputIcon class="pi pi-user" />
              <InputText fluid id="title" v-model="v$.name.$model" :invalid="v$.name.$error" />
            </IconField>
            <label for="title">Title</label>
          </FloatLabel>
          <Message size="small" severity="error" v-if="v$.title.$error" variant="simple">
            <div v-for="error of v$.title.$errors" :key="error.$uid">
              <div>{{ error.$message }}</div>
            </div>
          </Message>
        </div>
      </Panel>
      <!-- Project descriptive paragraphs  -->
      <Panel header="Descriptive Paragraphs" class="mb-3" toggleable>
        <p class="m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </p>
      </Panel>

      <!-- Name input -->
      <div class="form-group mb-3">
        <FloatLabel variant="on">
          <IconField>
            <InputIcon class="pi pi-user" />
            <InputText fluid id="registerName" v-model="v$.name.$model" :invalid="v$.name.$error" />
          </IconField>
          <label for="registerName">Name</label>
        </FloatLabel>
        <Message size="small" severity="error" v-if="v$.name.$error" variant="simple">
          <div v-for="error of v$.name.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </div>
        </Message>
      </div>

      <!-- Email input -->
      <div class="form-group mb-3">
        <FloatLabel variant="on">
          <IconField>
            <InputIcon class="pi pi-envelope" />
            <InputText
              id="registerEmail"
              class="w-100"
              v-model="v$.email.$model"
              :invalid="v$.email.$error"
              type="email"
            />
          </IconField>
          <label for="registerEmail">Email</label>
        </FloatLabel>
        <Message size="small" severity="error" v-if="v$.email.$error" variant="simple">
          <div v-for="error of v$.email.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </div>
        </Message>
      </div>

      <!-- Password input -->
      <div class="form-group mb-3">
        <FloatLabel variant="on">
          <IconField>
            <InputIcon class="pi pi-lock" />
            <InputText
              fluid
              id="registerPassword"
              v-model="v$.password.$model"
              :invalid="v$.password.$error"
              type="password"
            />
          </IconField>
          <label for="registerPassword">Password</label>
        </FloatLabel>
        <Message size="small" severity="error" v-if="v$.password.$error" variant="simple">
          <div v-for="error of v$.password.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </div>
        </Message>
      </div>

      <!-- Submit button -->
      <Button
        fluid
        class="mb-2"
        size="small"
        type="submit"
        severity="primary"
        :label="isRegistering ? 'Creating account...' : 'Sign up'"
        :loading="isRegistering"
        :disabled="v$.$errors.length > 0 || isRegistering"
      />
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useVuelidate } from "@vuelidate/core";
import { required, email, helpers, minLength } from "@vuelidate/validators";
import { Message } from "primevue";
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import Button from "primevue/button";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import TitleSection from "../shared/TitleSection.vue";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import Panel from "primevue/panel";
import { title } from "@primeuix/themes/aura/card";

// Access the store
const authStore = useAuthStore();
const toast = useToast();
const router = useRouter();

onMounted(() => {
  v$.value.$touch();
});

const isRegistering = ref(false);

//form validation start
const registrationForm = ref({
  title: "",
  name: "",
  email: "",
  password: "",
});
const passwordRule = helpers.regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/);
const passwordErrorMessage =
  "Password must be at least 8 characters long and contain a mix of letters, numbers, and special characters";

const rules = {
  title: { required },
  name: { required, minLengthValue: minLength(3) },
  email: { required, email },
  password: {
    required,
    passwordRule: helpers.withMessage(passwordErrorMessage, passwordRule),
  },
};
const v$ = useVuelidate(rules, registrationForm);
//form validation end

const submitForm = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (isFormCorrect) {
    isRegistering.value = true;
    authStore
      .register(registrationForm.value)
      .then(() => {
        router.push("/auth/email-verification/request");
      })
      .catch((message) => {
        toast.add({
          severity: "error",
          summary: "Registration Failed",
          detail: message,
          life: 20000,
        });
      })
      .finally(() => (isRegistering.value = false));
  }
};
</script>

<style scoped lang="scss">
@media (min-width: 768px) {
  .register-form {
    max-width: 30rem;
  }
}
</style>
