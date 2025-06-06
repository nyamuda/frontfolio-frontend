<template>
  <div class="text-center">
    <TitleSection
      :title="title"
      title-size="small"
      align-items="center"
      style="margin-bottom: -1rem"
    />
    <!-- Inline editor for the email the OTP is sent to -->
    <div class="mb-2">
      <span>{{ message }}</span>
      <Inplace>
        <template #display>
          <span class="text-center">
            {{ authStore.emailToVerify || "Change our email address" }}
            <i class="ms-1 text-primary pi pi-pencil"></i>
          </span>
        </template>
        <template #content="{ closeCallback }">
          <span class="d-flex align-items-center gap-2">
            <InputText v-model="authStore.emailToVerify" autofocus />
            <Button icon="pi pi-times" text severity="danger" @click="closeCallback" />
          </span>
        </template>
      </Inplace>
    </div>
    <!-- OTP input section -->
    <div class="d-flex justify-content-center mb-2">
      <InputOtp v-model="value" :length="6" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import InputOtp from "primevue/inputotp";
import { useAuthStore } from "@/stores/auth";
import Inplace from "primevue/inplace";
import TitleSection from "./TitleSection.vue";

defineProps({
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
    required: false,
  },
  //callback method to call once OTP verification is a success
  callbackAfterSuccessfulVerification: {
    type: Function,
    required: false,
  },
});

const authStore = useAuthStore();
const value = ref("");

//const sendOtp() => {}
</script>
