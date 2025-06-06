<template>
  <div>
    <!-- Send code button start -->
    <Button
      severity="primary"
      @click="sendCode"
      :label="
        isSendingCode ? 'Sending code...' : counter > 0 ? `Please wait (${counter})` : buttonLabel
      "
      icon="fas fa-sync-alt"
      :disabled="isSendingCode || isButtonDisabled"
      :loading="isSendingCode"
      :variant="buttonVariant"
    />
    <!-- Send code button end -->
  </div>
</template>

<script setup lang="ts">
import Button from "primevue/button";
import { onMounted, ref } from "vue";

const props = defineProps({
  //variant of the button (e.g., link, text)
  buttonVariant: {
    type: String,
    default: "link",
  },
  // text to show on the button (e.g., "Send Code" or "Resend Code")
  buttonLabel: {
    type: String,
    default: "Send Code",
  },
  // automatically send the code when the component mounts
  autoSend: {
    type: Boolean,
    default: false,
  },
  // callback type: "emailVerification" or "passwordReset"
  actionCallback: {
    type: Function,
    required: true,
  },
  //whether the code is being sent or not
  isSendingCode: {
    type: Boolean,
    required: true,
  },
});

onMounted(() => {
  // if autoSend is true and email and userId are provided, send the code on mount
  if (props.autoSend) sendCode();
});

// track countdown value in seconds
const counter = ref(0);
// disable the button while countdown is active
const isButtonDisabled = ref(false);

// starts a 5-second countdown and disables the button during that time
const startCounter = () => {
  counter.value = 5;
  isButtonDisabled.value = true;
  const interval = setInterval(() => {
    counter.value -= 1;
    if (counter.value <= 0) {
      clearInterval(interval);
      isButtonDisabled.value = false;
    }
  }, 1000);
};

// sends a code (either verification or password reset) to the email
const sendCode = async () => {
  await props.actionCallback();

  //disable the send code button for some seconds
  startCounter();
};
</script>
