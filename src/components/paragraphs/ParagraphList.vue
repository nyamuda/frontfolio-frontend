<template>
  <section>
    <div v-for="(paragraph, index) in paragraphs" :key="index">
      <ParagraphSection :paragraph="paragraph" />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Paragraph } from "@/models/paragraph";
import { ref, type Ref } from "vue";

const paragraphs: Ref<Paragraph[]> = ref([]);
</script>
