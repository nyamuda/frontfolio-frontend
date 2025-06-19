<template>
  <section>
    <div>
      <ParagraphSection
        v-for="(paragraph, index) in paragraphs"
        :index="index"
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
        :label="buttonLabel"
        size="small"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { Paragraph } from "@/models/paragraph";
import { ref, type PropType, type Ref } from "vue";
import ParagraphSection from "./ParagraphSection.vue";
import Button from "primevue/button";
import type { ParagraphType } from "@/types/paragraphType";

const props = defineProps({
  paragraphType: {
    type: String as PropType<ParagraphType>,
    required: true,
  },
  buttonLabel: {
    type: String,
    required: false,
    default: () => "New paragraph",
  },
});

const paragraphs: Ref<Paragraph[]> = ref([]);

//Add a new paragraph to the list of paragraphs when the button is clicked
const addNewParagraph = () => {
  const newParagraph = new Paragraph();
  //set the paragraph type e.g project background, project challenge etc
  newParagraph.paragraphType = props.paragraphType;
  paragraphs.value.push(newParagraph);
};

// Update the paragraph with the specified ID
const updateParagraphById = (updatedParagraph: Paragraph) => {
  paragraphs.value = paragraphs.value.map((paragraph) =>
    paragraph.id === updatedParagraph.id ? updatedParagraph : paragraph,
  );
};
//delete a paragraph with the specified ID
const deleteParagraphById = (targetId: string) => {
  paragraphs.value = paragraphs.value.filter((paragraph) => paragraph.id != targetId);
};
</script>
