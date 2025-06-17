<template>
  <section>
    <div v-for="(paragraph, index) in paragraphs" :key="index">
      <ParagraphSection
        @update="(val: Paragraph) => handleParagraphUpdate(index, val)"
        :paragraph="paragraph"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Paragraph } from "@/models/paragraph";
import { ref, type Ref } from "vue";

const paragraphs: Ref<Paragraph[]> = ref([]);

// Update the paragraph at the specified index
const updateParagraphAtIndex = (targetIndex: number, updatedParagraph: Paragraph) => {
  paragraphs.value = paragraphs.value.map((paragraph, currentIndex) => {
    return currentIndex === targetIndex ? updatedParagraph : paragraph;
  });
};
</script>
