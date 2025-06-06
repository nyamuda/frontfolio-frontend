<template>
  <div class="text-center">
    <TitleSection :title="title" title-size="small" align-items="center" />
    <!-- OTP input section -->
    <div class="d-flex justify-content-center mb-2">
      <InputOtp v-model="value" :length="6" />
    </div>
    <p>{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import InputOtp from "primevue/inputotp";
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
callbackAfterSuccessfulVerification:{
 type: Function,
    required: false,
}
});
const value = ref("");


const sendOtp() => {

}
</script>
