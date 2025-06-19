<template>
  <section>
    <div>
      <AddParagraphForm
        v-for="(validatedParagraph, index) in validatedParagraphs"
        :index="index"
        :key="validatedParagraph.paragraph.id"
        @update="(val: ValidatedParagraph) => updateParagraphById(val)"
        @delete="() => deleteParagraphById(validatedParagraph.paragraph.id)"
        :paragraph="validatedParagraph.paragraph"
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
import { computed, ref, type PropType, type Ref } from "vue";
import AddParagraphForm from "./AddParagraphForm.vue";
import Button from "primevue/button";
import type { ParagraphType } from "@/types/paragraphType";
import type { ValidatedParagraph } from "@/interfaces/projects/validatedParagraph";

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

const validatedParagraphs: Ref<ValidatedParagraph[]> = ref([]);

// Determine if any paragraph in the list has failed validation
const isAnyParagraphInvalid: Ref<boolean> = computed(() => {
  //look for any paragraphs whose validation is false
  const anyInvalid: ValidatedParagraph[] = validatedParagraphs.value.filter(
    (validatedParagraphs) => !validatedParagraphs.isValid,
  );
  return anyInvalid.length > 0;
});

//Add a new paragraph to the list of paragraphs when the button is clicked
const addNewParagraph = () => {
  const newParagraph = new Paragraph();
  //set the paragraph type e.g project background, project challenge etc
  newParagraph.paragraphType = props.paragraphType;
  //by default, the a new paragraph form is invalid since its fields are empty
  const isValid = false;
  validatedParagraphs.value.push({ paragraph: newParagraph, isValid });
};

// Update the paragraph with the specified ID
const updateParagraphById = (updatedParagraph: ValidatedParagraph) => {
  validatedParagraphs.value = validatedParagraphs.value.map((validatedParagraph) =>
    validatedParagraph.paragraph.id === updatedParagraph.paragraph.id
      ? updatedParagraph
      : validatedParagraph,
  );
};
//delete a paragraph with the specified ID
const deleteParagraphById = (targetId: string) => {
  validatedParagraphs.value = validatedParagraphs.value.filter(
    (validatedParagraph) => validatedParagraph.paragraph.id != targetId,
  );
};
</script>
