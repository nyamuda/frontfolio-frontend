<template>
  <div class="text-center">
    <TitleSection
      :title="title"
      title-size="small"
      align-items="center"
      style="margin-bottom: -1rem"
    />
    <!-- Inline editor for the email the OTP is sent to -->
    <div>
      <span>{{ message }}</span>
      <Inplace>
        <template #display>
          <span class="text-center">
            {{ authStore.emailToVerify || "Enter your email address" }}
            <i class="ms-1 text-primary pi pi-pencil"></i>
          </span>
        </template>
        <template #content="{ closeCallback }">
          <span class="d-flex justify-content-center align-items-center gap-1 my-2">
            <InputText v-model="authStore.emailToVerify" autofocus size="small" type="email" />
            <Button icon="pi pi-times" text severity="danger" @click="closeCallback" />
          </span>
        </template>
      </Inplace>
    </div>
    <!-- OTP input section -->
    <div class="d-flex justify-content-center mt-2">
      <InputOtp @change="onOtpChange" v-model="otpCode" :length="6" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import InputOtp from "primevue/inputotp";
import { useAuthStore } from "@/stores/auth";
import Inplace from "primevue/inplace";
import TitleSection from "./TitleSection.vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";

//const emit = defineEmits(["otpCode"]);

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
});

const authStore = useAuthStore();
const otpCode = ref("");

const onOtpChange = async () => {
  //emit("otpCode", otpCode.value);
  if (otpCode.value.length == 6) {
    await props.callbackToVerify(otpCode);

    otpCode.value = "";
  }
};

//const sendOtp() => {}
</script>
