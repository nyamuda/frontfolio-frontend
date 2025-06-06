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
          <OtpSection />
          <!-- Inline editor for the email the OTP is sent to -->
          <Inplace>
            <template #display>
              <span class="text-center">
                {{ emailToVerify || "Change our email address" }}
              </span>
            </template>
            <template #content="{ closeCallback }">
              <span class="d-flex align-items-center gap-2">
                <InputText v-model="emailToVerify" autofocus />
                <Button icon="pi pi-times" text severity="danger" @click="closeCallback" />
              </span>
            </template>
          </Inplace>
        </div>
        <RequestCodeButton
          v-if="emailToVerify"
          button-label="Resend Code"
          :auto-send="emailToVerify ? true : false"
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
import Inplace from "primevue/inplace";
import OtpSection from "../shared/OtpSection.vue";

const authStore = useAuthStore();
const toast = useToast();

const isSendingEmailVerificationCode = ref(false);
const emailToVerify = ref(authStore.emailToVerify);
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
</script>
