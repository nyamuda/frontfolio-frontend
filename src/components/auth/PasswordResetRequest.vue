<template>
  <div class="mt-5 container">
    <div class="py-4 m-auto">
      <div class="text-center card-body">
        <div>
          <i class="fas fa-envelope-open-text fa-5x text-secondary"></i>
        </div>

        <TitleSection
          title="Reset Your Password"
          title-size="small"
          align-items="center"
          style="margin-bottom: -1rem"
        />
        <!-- Section to show if the OTP is being sent -->
        <div v-if="isSendingResetCode" class="card-text mb-3">
          <div class="d-flex flex-column align-items-center">
            <ProgressSpinner />
            <span> We're sending a password reset code to your email address.</span>
            <span>This should only take a few seconds.</span>
          </div>
        </div>
        <!-- Section to show if the OTP was sent -->
        <div v-else class="card-text d-flex flex-column align-items-center">
          <!-- Otp input section -->
          <!-- Displayed if OTP was successfully sent or hasn't been sent yet -->
          <OtpSection
            v-if="otpSendingResult == 'success' || otpSendingResult == 'nothingSent'"
            :callback-to-verify="verifyPasswordResetCode"
            :is-verifying-otp="authStore.isVerifyingPasswordResetOtp"
            :title="otpSectionTitleAndMessage.title"
            :message="otpSectionTitleAndMessage.message"
          />
          <!-- Displayed gf an attempt to resend OTP was a failure -->
          <div
            v-else-if="otpSendingResult == 'failure'"
            class="d-flex flex-column align-items-center text-danger"
          >
            <i class="pi pi-times-circle mb-2" style="font-size: 3rem"></i>
            <span>We couldn't send the password reset code.</span>
            <span>Please try again soon.</span>
            <Button
              class="my-2"
              @click="makeOtpSendingResultDefault"
              icon="pi pi-pencil"
              label="Edit Email"
              severity="info"
              variant="outlined"
              size="small"
            />
          </div>
        </div>
        <!-- Button to request a new OTP -->
        <RequestCodeButton
          v-if="authStore.userEmail"
          :button-label="
            otpSendingResult == 'success'
              ? 'Resend Code'
              : otpSendingResult == 'failure'
                ? 'Retry Sending Code'
                : 'Send Code'
          "
          :auto-send="false"
          :is-sending-code="isSendingResetCode"
          :action-callback="requestResetCode"
          :is-button-disabled="authStore.isVerifyingPasswordResetOtp"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, type Ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import RequestCodeButton from "../shared/RequestCodeButton.vue";
import ProgressSpinner from "primevue/progressspinner";
import { useToast } from "primevue/usetoast";
import OtpSection from "../shared/OtpSection.vue";
import TitleSection from "../shared/TitleSection.vue";
import type { sendingOtpResult } from "@/types/sendingOtpResult";
import { useRouter } from "vue-router";
import Button from "primevue/button";

const authStore = useAuthStore();
const toast = useToast();
const router = useRouter();
const isSendingResetCode = ref(false);
const otpSendingResult: Ref<sendingOtpResult> = ref("nothingSent");

//title and message for the OTP section
//based on whether an OTP was sent or not
const otpSectionTitleAndMessage: Ref<{ title: string; message: string }> = computed(() => {
  return {
    title: otpSendingResult.value === "success" ? "Reset Code Sent" : "Request Reset Code",
    message:
      otpSendingResult.value === "success"
        ? "Please enter the password reset security code sent to"
        : authStore.userEmail
          ? "We'll send a password reset code to"
          : "Enter your email address and we'll send you a password reset security code.",
  };
});

//Make a request for password reset
const requestResetCode = async () => {
  const email = authStore.userEmail;
  if (email) {
    isSendingResetCode.value = true;
    authStore
      .requestPasswordReset(email)
      .then(() => {
        otpSendingResult.value = "success";
        toast.add({
          severity: "success",
          summary: "Code Sent",
          detail: "The reset code was sent to your email address.",
          life: 5000,
        });
      })
      .catch((message) => {
        otpSendingResult.value = "failure";
        toast.add({
          severity: "error",
          summary: "Sending Failed",
          detail: message,
          life: 10000,
        });
      })
      .finally(() => (isSendingResetCode.value = false));
  }
};

//Verify email using OTP code
const verifyPasswordResetCode = async (otpCode: string) => {
  try {
    const email = authStore.userEmail;
    if (email) {
      const { resetToken } = await authStore.verifyPasswordResetOtp({ otpCode, email });
      toast.add({
        severity: "success",
        summary: "Reset Code Verified",
        detail: "Your reset code has been successfully verified. You can now reset your password.",
        life: 10000,
      });
      //direct the user to the password reset page
      router.push(`/auth/password-reset/reset?token=${resetToken}`);
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Verification Failed",
      detail: error,
      life: 10000,
    });
  }
};

//Change the value of otpSendingResult to "nothingSent" (the default value)
//This will allow the OTPSection component to be displayed
//and thus allow the user to edit their email in call a password reset request was a "failure"
const makeOtpSendingResultDefault = () => (otpSendingResult.value = "nothingSent");
</script>
