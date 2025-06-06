<template>
  <div class="mt-5 container">
    <div class="py-4 m-auto">
      <div class="text-center card-body">
        <div>
          <i class="fas fa-envelope-open-text fa-5x text-secondary"></i>
        </div>
        <h2 class="card-title mb-2">Confirm your email</h2>
        <!-- Section to show if the OTP is being sent -->
        <div v-if="isSendingEmailVerificationCode" class="card-text mb-3">
          <div class="d-flex flex-column align-items-center">
            <ProgressSpinner />
            <span> We're sending a verification code to your email address.</span>
            <span>This should only take a few seconds.</span>
          </div>
        </div>
        <!-- Section to show if the OTP was sent -->
        <div v-else class="card-text mb-3 row d-flex flex-column align-items-center">
          <!-- Otp input section -->
          <OtpSection :callback-to-verify="verifyEmail" />
        </div>
        <RequestCodeButton
          v-if="authStore.emailToVerify"
          button-label="Resend Code"
          :auto-send="false"
          :is-sending-code="isSendingEmailVerificationCode"
          :action-callback="requestEmailVerificationCode"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import RequestCodeButton from "../shared/RequestCodeButton.vue";
import ProgressSpinner from "primevue/progressspinner";
import { useToast } from "primevue";
import OtpSection from "../shared/OtpSection.vue";

const authStore = useAuthStore();
const toast = useToast();

const isSendingEmailVerificationCode = ref(false);

//Make a request for email verification
const requestEmailVerificationCode = async () => {
  try {
    const email = authStore.emailToVerify;
    if (email) {
      await authStore.requestEmailVerification(email);
      toast.add({
        severity: "success",
        summary: "Code sent",
        detail: "The security code was sent to your email address.",
        life: 5000,
      });
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Sending Failed",
      detail: error,
      life: 10000,
    });
  }
};

//Verify email using OTP code
const verifyEmail = async (otpCode: string) => {
  try {
    const email = authStore.emailToVerify;
    if (email) {
      await authStore.verifyEmail({ otpCode, email });
      toast.add({
        severity: "success",
        summary: "Code sent",
        detail: "The security code was sent to your email address.",
        life: 5000,
      });
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Sending Failed",
      detail: error,
      life: 10000,
    });
  }
};
</script>
