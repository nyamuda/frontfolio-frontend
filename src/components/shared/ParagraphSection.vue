<template>
  <section></section>
</template>

<script setup lang="ts">
import useVuelidate from "@vuelidate/core";
import { required, url } from "@vuelidate/validators";
import { ref } from "vue";

//form validation start
const form = ref({
  title: "",
  imageUrl: "",
  content: "",
});

const rules = {
  title: { required },
  imageUrl: { required, url },
  content: { required },
};
const v$ = useVuelidate(rules, form);
//form validation end
</script>
