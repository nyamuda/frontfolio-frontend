<template>
  <section>
    <div>
      <AddParagraphForm
        v-for="(validatedParagraph, index) in validatedParagraphs"
        :index="index"
        :key="validatedParagraph.item.id"
        @update="(val: ValidatedItem<Paragraph>) => updateParagraphById(val)"
        @delete="() => deleteParagraphById(validatedParagraph.item.id)"
        :paragraph="validatedParagraph.item"
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
import { computed, ref, watch, type PropType, type Ref } from "vue";
import AddParagraphForm from "./AddParagraphForm.vue";
import Button from "primevue/button";
import type { ParagraphType } from "@/types/paragraphType";
import type { ValidatedItem } from "@/interfaces/projects/validatedItem";

const emit = defineEmits(["paragraphs", "isAnyParagraphInvalid"]);
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

const validatedParagraphs: Ref<ValidatedItem<Paragraph>[]> = ref([]);

// Determine if any paragraph in the list has failed validation
const isAnyParagraphInvalid: Ref<boolean> = computed(() => {
  //look for any paragraphs whose validation is invalid
  const anyInvalid: ValidatedItem<Paragraph>[] = validatedParagraphs.value.filter(
    (validatedParagraphs) => !validatedParagraphs.isValid,
  );
  return anyInvalid.length > 0;
});

//Add a new paragraph to the list of paragraphs when the Add button is clicked
const addNewParagraph = () => {
  const newParagraph = new Paragraph();
  //set the paragraph type e.g project background, project challenge etc
  newParagraph.paragraphType = props.paragraphType;
  //by default, the a new paragraph form is invalid since its fields (the required ones) will be  empty
  const isValid = false;
  validatedParagraphs.value.push({ item: newParagraph, isValid });
};

// Update the paragraph with the specified ID
const updateParagraphById = (updatedParagraph: ValidatedItem<Paragraph>) => {
  validatedParagraphs.value = validatedParagraphs.value.map((validatedParagraph) =>
    validatedParagraph.item.id === updatedParagraph.item.id ? updatedParagraph : validatedParagraph,
  );
};
//delete a paragraph with the specified ID
const deleteParagraphById = (targetId: string) => {
  validatedParagraphs.value = validatedParagraphs.value.filter(
    (validatedParagraph) => validatedParagraph.item.id != targetId,
  );
};

// Watch for changes in the validatedParagraphs array.
// Whenever any paragraph's content or validation state updates,
// extract the paragraph data and emit both the updated list
// and the combined validation status to keep the parent component in sync.
watch(
  validatedParagraphs,
  (newValidatedParagraphs) => {
    // Extract the Paragraph objects from the validatedParagraphs array
    const paragraphs: Paragraph[] = newValidatedParagraphs.map(
      (validatedParagraph) => validatedParagraph.item,
    );

    // Emit the updated list of paragraphs to the parent component
    emit("paragraphs", paragraphs);

    // Emit the current overall validation status indicating if any paragraph is invalid
    emit("isAnyParagraphInvalid", isAnyParagraphInvalid.value);
  },
  { deep: true },
);
</script>
