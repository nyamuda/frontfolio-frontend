<template>
  <div class="">
    <!--If the reset link has expired-->
    <div v-if="hasTokenExpiredOrIsInvalid" class="d-flex justify-content-center align-items-center">
      <div class="text-center">
        <i class="fas fa-exclamation-triangle text-danger fa-4x"></i>
        <h4 class="mt-2 text-danger">Reset Link Expired</h4>
        <p class="text-muted">The password reset link has expired or is invalid.</p>
        <p class="text-muted">Please request a new password reset link.</p>
        <router-link to="/email/password-reset-request">
          <Button severity="primary" label=" Request new link" icon="fas fa-sync-alt" />
        </router-link>
      </div>
    </div>
    <!--Password reset form-->
    <form v-else class="reset-password-form m-auto" @submit.prevent="submitForm">
      <TitleSection title="Set Your New Password" title-size="small" align-items="start" />
      <p class="mb-3">Please enter your new password and confirm it to proceed.</p>
      <!-- Password input -->
      <div class="form-group mb-3">
        <FloatLabel variant="on">
          <IconField>
            <InputIcon class="fas fa-lock" />
            <InputText
              fluid
              id="resetPassword"
              v-model="v$.password.$model"
              :invalid="v$.password.$error"
              type="password"
            />
          </IconField>
          <label for="resetPassword">Password</label>
        </FloatLabel>
        <Message size="small" severity="error" v-if="v$.password.$error" variant="simple">
          <div v-for="error of v$.password.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </div>
        </Message>
      </div>

      <!-- Password confirm input -->
      <div class="form-group mb-3">
        <FloatLabel variant="on">
          <IconField>
            <InputIcon class="fas fa-lock" />
            <InputText
              fluid
              id="resetPasswordConfirm"
              v-model="v$.passwordConfirm.$model"
              :invalid="v$.passwordConfirm.$error"
              type="password"
            />
          </IconField>
          <label for="resetPasswordConfirm">Confirm Password</label>
        </FloatLabel>
        <Message size="small" severity="error" v-if="v$.passwordConfirm.$error" variant="simple">
          <div v-for="error of v$.passwordConfirm.$errors" :key="error.$uid">
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
        :label="isResettingPassword ? 'Resetting password...' : 'Submit new password'"
        :loading="isResettingPassword"
        :disabled="v$.$errors.length > 0 || isResettingPassword"
      />
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
//Vuelidate for login form validation
import { useVuelidate } from "@vuelidate/core";
import { required, helpers, sameAs } from "@vuelidate/validators";
import { Message } from "primevue";
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import Button from "primevue/button";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import { useToast } from "primevue/usetoast";
import TitleSection from "../shared/TitleSection.vue";
import { jwtDecode } from "jwt-decode";

const router = useRouter();
const toast = useToast();
// Access the store
const authStore = useAuthStore();

//provided token from the URL
const providedToken = ref("");

//check if the reset token has expired or not
const hasTokenExpiredOrIsInvalid = ref(true);

//form validation with Vuelidate start
const resetPasswordForm = ref({
  password: "",
  passwordConfirm: "",
});
const passwordRule = helpers.regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/);
const passwordErrorMessage =
  "Password must be at least 8 characters long and contain a mix of letters, numbers, and special characters";
const passwordNotMatching = "The passwords you entered do not match";
const rules = computed(() => ({
  password: {
    required,
    passwordRule: helpers.withMessage(passwordErrorMessage, passwordRule),
  },
  passwordConfirm: {
    required,
    sameAsPassword: helpers.withMessage(
      passwordNotMatching,
      sameAs(computed(() => resetPasswordForm.value.password)),
    ),
  },
}));
const v$ = useVuelidate(rules, resetPasswordForm, { $autoDirty: true });
//form validation with Vuelidate end

onMounted(() => {
  try {
    //validate the password reset form
    v$.value.$touch();

    //get the token provided in the URL from
    //when the user clicks the reset button in their confirmation email
    providedToken.value = router.currentRoute.value.query.token?.toString() ?? "";

    //check if the token has expired or not
    //check if access token has expired or not
    const exp = jwtDecode(providedToken.value).exp; // in seconds
    const now = Math.floor(Date.now() / 1000); // current time in seconds

    hasTokenExpiredOrIsInvalid.value = exp ? exp > now : true;
    //throw an exception if the token has expired
    if (hasTokenExpiredOrIsInvalid.value) throw new Error();
  } catch {
    hasTokenExpiredOrIsInvalid.value = true;
  }
});

const isResettingPassword = ref(false);

const submitForm = async () => {
  const isFormCorrect = await v$._value.$validate();
  if (isFormCorrect && providedToken.value) {
    isResettingPassword.value = true;
    store
      .dispatch("account/resetPassword", {
        token: providedToken.value,
        password: resetPasswordForm.value.password,
      })
      .then((message) => {
        toast.add({
          severity: "success",
          summary: "Password Reset",
          detail: message,
        });
        router.push("/account/login");
      })
      .catch((message) => {
        toast.add({
          severity: "error",
          summary: "Reset Failed",
          detail: message,
          life: 10000,
        });
      })
      .finally(() => (isResettingPassword.value = false));
  }
};
</script>

<style scoped>
@media (min-width: 512px) {
  .reset-password-form {
    max-width: 28rem;
  }
}
</style>
