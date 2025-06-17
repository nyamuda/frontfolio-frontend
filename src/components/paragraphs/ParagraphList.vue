<template>
  <section>
    <div>
      <ParagraphSection
        v-for="(paragraph, index) in paragraphs"
        :key="index"
        @update="(val: Paragraph) => updateParagraphAtIndex(index, val)"
        @delete="() => deleteParagraphAtIndex(index)"
        :paragraph="paragraph"
      />
    </div>
    <div class="d-flex justify-content-center align-items-center">
      <Button
        @click="addNewParagraph"
        icon="pi pi-plus"
        severity="contrast"
        label="New paragraph"
        size="small"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { Paragraph } from "@/models/paragraph";
import { ref, type Ref } from "vue";
import ParagraphSection from "../shared/ParagraphSection.vue";
import Button from "primevue/button";

const paragraphs: Ref<Paragraph[]> = ref([]);

const addNewParagraph = () => paragraphs.value.push(new Paragraph());

// Update the paragraph at the specified index
const updateParagraphAtIndex = (targetIndex: number, updatedParagraph: Paragraph) => {
  paragraphs.value = paragraphs.value.map((paragraph, currentIndex) =>
    currentIndex === targetIndex ? updatedParagraph : paragraph,
  );
};
//delete a paragraph at the specified index
const deleteParagraphAtIndex = (targetIndex: number) => {
  console.log(paragraphs.value);
  paragraphs.value = paragraphs.value.filter((_, index) => {
    if (index != targetIndex) {
      console.log(`current index is ${index} & target index is ${targetIndex}`);
      return true;
    } else {
      console.log(`current index is ${index} & target index is ${targetIndex}`);
      return false;
    }
  });
  console.log(paragraphs.value);
};
</script>
