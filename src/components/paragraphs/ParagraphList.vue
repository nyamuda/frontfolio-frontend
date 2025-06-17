<template>
  <section>
    <div>
      <ParagraphSection
        v-for="(paragraph, index) in paragraphs"
        :key="paragraph.id"
        @update="(val: Paragraph) => updateParagraphById(val)"
        @delete="() => deleteParagraphById(paragraph.id)"
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

// Update the paragraph with the specified index
const updateParagraphById = (targetId: string, updatedParagraph: Paragraph) => {
  paragraphs.value = paragraphs.value.map((paragraph) =>
    paragraph.id === targetId ? updatedParagraph : paragraph,
  );
};
//delete a paragraph with the specified ID
const deleteParagraphById = (targetId: string) => {
  paragraphs.value = paragraphs.value.filter((paragraph) => paragraph.id != targetId);
};
</script>
