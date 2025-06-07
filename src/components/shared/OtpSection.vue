<template>
  <div class="text-center">
    <h5>{{ title }}</h5>
    <!-- Inline editor for the email the OTP is sent to -->
    <div>
      <span>{{ message }}</span>
      <Inplace>
        <template #display>
          <span class="text-center">
            {{ authStore.userEmail || "Your email" }}
            <i class="ms-1 text-primary pi pi-pencil"></i>
          </span>
        </template>
        <template #content="{ closeCallback }">
          <span class="d-flex justify-content-center align-items-center gap-1 my-2">
            <InputText
              v-model="authStore.userEmail"
              autofocus
              size="small"
              type="email"
              placeholder="Email"
            />
            <Button icon="pi pi-times" text severity="danger" @click="closeCallback" />
            <!-- Email input -->

            <FloatLabel variant="on">
              <IconField>
                <InputIcon class="pi pi-envelope" />
                <InputText
                  id="otpEmail"
                  class="w-100"
                  v-model="v$.email.$model"
                  :invalid="v$.email.$error"
                  type="email"
                />
              </IconField>
              <label for="otpEmail">Email</label>
            </FloatLabel>
            <Message size="small" severity="error" v-if="v$.email.$error" variant="simple">
              <div v-for="error of v$.email.$errors" :key="error.$uid">
                <div>{{ error.$message }}</div>
              </div>
            </Message>
          </span>
        </template>
      </Inplace>
    </div>
    <!-- OTP input section -->
    <div class="d-flex justify-content-center my-2">
      <InputOtp @change="onOtpChange" v-model="otpCode" :length="6" integerOnly />
    </div>
    <div v-if="isVerifyingOtp" class="d-flex justify-content-center">
      <ProgressSpinner style="width: 70px; height: 70px" aria-label="Loading" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import InputOtp from "primevue/inputotp";
import { useAuthStore } from "@/stores/auth";
import Inplace from "primevue/inplace";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import ProgressSpinner from "primevue/progressspinner";
import { email, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import InputIcon from "primevue/inputicon";
import { Message } from "primevue";
import FloatLabel from "primevue/floatlabel";

const props = defineProps({
  //title for the otp section
  title: {
    type: String,
    default: "We just sent an email",
  },
  //message for the otp section
  message: {
    type: String,
    default: "Enter the security code we sent to",
  },
  //callback method to call to verify OTP
  callbackToVerify: {
    type: Function,
    required: true,
  },
  //whether or not an OTP is being verified
  //this is used to show the loader
  isVerifyingOtp: {
    type: Boolean,
    required: true,
  },
});

const authStore = useAuthStore();
const otpCode = ref("");

//Verify the OTP code once 6 digits are entered
const onOtpChange = async () => {
  if (otpCode.value.length == 6) {
    //verify OTP
    await props.callbackToVerify(otpCode.value);
  }
};

const rules = {
  email: { required, email },
};
const v$ = useVuelidate(rules, { email: authStore.userEmail });
//email input valid end
</script>
