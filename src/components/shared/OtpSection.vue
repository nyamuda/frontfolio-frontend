<template>
  <div class="card -d-flex justify-content-center">
    <InputOtp v-model="value" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import InputOtp from 'primevue/inputotp';


const value = ref("");
</script>
