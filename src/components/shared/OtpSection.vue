<template>
  <div class="d-flex justify-content-center">
    <TitleSection title="W" />
    <InputOtp v-model="value" :length="6" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import InputOtp from "primevue/inputotp";
import TitleSection from "./TitleSection.vue";

defineProps({
  //title of the otp section
  title: {
    type: String,
    default: "We just sent an email",
  },
  //callback method to call to verify OTP
  callbackToVerify: {
    type: Function,
    required: false,
  },
});

const value = ref("");
</script>
