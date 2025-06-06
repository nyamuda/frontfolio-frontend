<template>
  <div class="mt-5 container">
    <div class="py-4 m-auto">
      <div class="text-center card-body">
        <div>
          <i class="fas fa-envelope-open-text fa-5x text-secondary"></i>
        </div>
        <h2 class="card-title mb-2">Confirm your email</h2>
        <div v-if="isSendingEmailVerificationLink" class="card-text mb-3">
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
          v-if="pendingEmailVerification.useId && pendingEmailVerification.emailToVerify"
          :email="pendingEmailVerification.emailToVerify"
          button-label="Resend Link"
          :auto-send="
            pendingEmailVerification.useId && pendingEmailVerification.emailToVerify ? true : false
          "
          @is-sending-code="(val) => (isSendingEmailVerificationCode = val)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "vuex";
import RequestCodeButton from "../shared/RequestCodeButton.vue";

import ProgressSpinner from "primevue/progressspinner";

const store = useStore();

const isSendingEmailVerificationCode = ref(false);
const pendingEmailVerification = computed(() => store.state.account.pendingEmailVerification);
</script>
