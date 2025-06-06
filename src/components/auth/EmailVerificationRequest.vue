<template>
  <div class="mt-5 container">
    <div class="py-4 m-auto">
      <div class="text-center card-body">
        <div>
          <i class="fas fa-envelope-open-text fa-5x text-secondary"></i>
        </div>
        <h2 class="card-title mb-2">Confirm your email</h2>
        <div v-if="isSendingEmailVerificationCode" class="card-text mb-3">
          <div class="d-flex flex-column align-items-center">
            <ProgressSpinner />
            <span> We're sending a verification code to your email address.</span>
            <span>This should only take a few seconds.</span>
          </div>
        </div>
        <div v-else class="card-text mb-3 row d-flex flex-column align-items-center">
          <span>We’ve sent you a confirmation link.</span>
          <span> Haven’t received the email? Be sure to check your spam or junk folder. </span>
        </div>
        <RequestCodeButton
          v-if="emailToVerify"
          button-label="Resend Code"
          :auto-send="emailToVerify ? true : false"
          :is-sending-code="isSendingEmailVerificationCode"
          :action-callback="requestEmailVericationCode"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import RequestCodeButton from "../shared/RequestCodeButton.vue";
import ProgressSpinner from "primevue/progressspinner";
import { useToast } from "primevue";

const authStore = useAuthStore();
const toast = useToast();

const isSendingEmailVerificationCode = ref(false);
const emailToVerify = computed(() => authStore.emailToVerify);
//Make a request for email verification
const requestEmailVericationCode = async () => {
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
</script>
